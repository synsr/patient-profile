import { usePatientAlerts } from '@/lib/api/mockData';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, MessageSquare, AlertTriangle } from 'lucide-react';
import type { Alert } from '@/lib/types';
import { UrgentBadge, ActionRequiredBadge } from '@/components/badges';

const NOTIFICATION_ICONS = {
  FORM_SUBMITTED: FileText,
  APPOINTMENT_SCHEDULED: Calendar,
  MESSAGE_RECEIVED: MessageSquare,
} as const;

function NotificationCard({ notification }: { notification: Alert }) {
  const Icon = NOTIFICATION_ICONS[notification.type];
  const isUrgent = notification.tags.some((tag) => tag.name === 'Urgent');
  const hasActionRequired = notification.actionRequired && !notification.resolvedDate;

  return (
    <Card className={isUrgent ? 'border-red-500' : ''}>
      <CardContent className='p-4'>
        <div className='flex items-start gap-4'>
          <div className={`rounded-full p-2 ${isUrgent ? 'bg-red-100' : 'bg-primary/10'}`}>
            {isUrgent ? (
              <AlertTriangle className='h-5 w-5 text-red-500' />
            ) : (
              <Icon className='h-5 w-5 text-primary' />
            )}
          </div>
          <div className='flex-1 space-y-2'>
            <div className='flex items-center justify-between'>
              <div className='space-y-1'>
                <h4 className='font-medium'>
                  {notification.type === 'FORM_SUBMITTED' && `${notification.data.name} Submitted`}
                  {notification.type === 'APPOINTMENT_SCHEDULED' &&
                    `Appointment: ${notification.data.title}`}
                  {notification.type === 'MESSAGE_RECEIVED' && 'New Message'}
                </h4>
                <p className='text-sm text-muted-foreground'>
                  {new Date(notification.createdDate).toLocaleString()}
                </p>
              </div>
              <div className='flex flex-wrap gap-2'>
                {isUrgent ? <UrgentBadge /> : hasActionRequired ? <ActionRequiredBadge /> : null}
              </div>
            </div>
            <div className='text-sm'>
              {notification.type === 'FORM_SUBMITTED' && (
                <p>
                  Submitted by {notification.data.patient?.firstName}{' '}
                  {notification.data.patient?.lastName}
                </p>
              )}
              {notification.type === 'APPOINTMENT_SCHEDULED' && (
                <p>
                  Scheduled for {new Date(notification.data.start!).toLocaleString()} with{' '}
                  {notification.data.organizer?.firstName} {notification.data.organizer?.lastName}
                </p>
              )}
              {notification.type === 'MESSAGE_RECEIVED' && (
                <p className='line-clamp-2'>{notification.data.message}</p>
              )}
            </div>
            {hasActionRequired && (
              <div className='flex gap-2'>
                <Button size='sm' variant={isUrgent ? 'destructive' : 'default'}>
                  Resolve
                </Button>
                <Button size='sm' variant='outline'>
                  View Details
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function NotificationsTab({ id }: { id: string }) {
  const { data, isLoading } = usePatientAlerts(id) as {
    data: { data: Alert[]; total: number } | undefined;
    isLoading: boolean;
  };

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <Skeleton className='h-24 w-full' />
        <Skeleton className='h-24 w-full' />
        <Skeleton className='h-24 w-full' />
      </div>
    );
  }

  if (!data?.data.length) {
    return (
      <div className='flex h-[200px] items-center justify-center'>
        <p className='text-muted-foreground'>No notifications found</p>
      </div>
    );
  }

  // Sort notifications by date (newest first) and separate urgent ones
  const sortedNotifications = [...data.data].sort(
    (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
  );

  const urgentNotifications = sortedNotifications.filter((notification) =>
    notification.tags.some((tag) => tag.name === 'Urgent')
  );
  const regularNotifications = sortedNotifications.filter(
    (notification) => !notification.tags.some((tag) => tag.name === 'Urgent')
  );

  return (
    <div className='space-y-6'>
      {urgentNotifications.length > 0 && (
        <div className='space-y-4'>
          <h3 className='text-lg font-semibold text-red-500'>Urgent Notifications</h3>
          {urgentNotifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </div>
      )}

      {regularNotifications.length > 0 && (
        <div className='space-y-4'>
          <h3 className='text-lg font-semibold'>Other Notifications</h3>
          {regularNotifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </div>
      )}
    </div>
  );
}

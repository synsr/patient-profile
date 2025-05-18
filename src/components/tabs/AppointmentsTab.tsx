import { usePatientEvents } from '@/lib/api/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock, MapPin, User, Users, Video } from 'lucide-react';

export function AppointmentsTab({ id }: { id: string }) {
  const { data: events, isLoading, error } = usePatientEvents(id);

  if (isLoading) return <Skeleton className='h-96 w-full' />;
  if (error || !events) return <div>Error loading appointments</div>;

  console.log(
    'All events:',
    events.map((e) => ({ id: e.id, title: e.title, status: e.status }))
  );

  // Filter and sort appointments
  const upcomingAppointments = events
    .filter((event) => {
      console.log('Checking event:', { id: event.id, title: event.title, status: event.status });
      return event.status === 'CONFIRMED';
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  console.log(
    'Upcoming appointments:',
    upcomingAppointments.map((e) => ({ id: e.id, title: e.title, status: e.status }))
  );

  const recentVisits = events
    .filter((event) => event.status === 'COMPLETED')
    .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())
    .slice(0, 5);

  const noShows = events
    .filter((event) => event.status === 'CANCELLED')
    .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());

  const formatDuration = (start: string, end: string) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const duration = endTime.getTime() - startTime.getTime();
    const minutes = Math.floor(duration / (1000 * 60));
    return `${minutes} min`;
  };

  return (
    <div className='space-y-8'>
      {/* Actions Section */}
      <div className='flex gap-4'>
        <Button>Schedule New Appointment</Button>
        {upcomingAppointments.length > 0 && <Button variant='secondary'>Check-in Patient</Button>}
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length > 0 ? (
            <div className='space-y-4'>
              {upcomingAppointments.map((event) => (
                <div
                  key={event.id}
                  className='flex items-start justify-between p-4 border rounded-lg'>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <Calendar className='w-4 h-4 text-gray-500' />
                      <span className='font-medium'>
                        {new Date(event.start).toLocaleDateString()}
                      </span>
                      <Clock className='w-4 h-4 text-gray-500 ml-2' />
                      <span>
                        {new Date(event.start).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {' - '}
                        {new Date(event.end).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {' ('}
                        {formatDuration(event.start, event.end)}
                        {')'}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <User className='w-4 h-4 text-gray-500' />
                      <span>
                        {event.organizer.firstName} {event.organizer.lastName}
                      </span>
                      {event.attendees.length > 2 && (
                        <div className='flex items-center gap-1'>
                          <Users className='w-4 h-4 text-gray-500' />
                          <span className='text-sm text-gray-500'>
                            +{event.attendees.length - 2} more
                          </span>
                        </div>
                      )}
                    </div>
                    <div className='flex items-center gap-2'>
                      <MapPin className='w-4 h-4 text-gray-500' />
                      <span>
                        {event.location.isVirtual ? (
                          <div className='flex items-center gap-1'>
                            <Video className='w-4 h-4' />
                            Virtual Appointment
                            {event.meetingLink && (
                              <Button variant='link' size='sm' className='h-auto p-0'>
                                Join Meeting
                              </Button>
                            )}
                          </div>
                        ) : (
                          event.location.name
                        )}
                      </span>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <div className='text-sm text-gray-600'>{event.appointment.reason}</div>
                      <div className='flex gap-2'>
                        <Badge variant='outline'>{event.appointment.appointmentType}</Badge>
                        <Badge variant='secondary'>
                          Confirmed{' '}
                          {new Date(event.appointment.confirmationDate).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className='flex gap-2'>
                    <Button variant='outline' size='sm'>
                      Reschedule
                    </Button>
                    <Button variant='outline' size='sm'>
                      Cancel
                    </Button>
                    <Button variant='ghost' size='sm'>
                      Send Reminder
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-gray-500'>No upcoming appointments</div>
          )}
        </CardContent>
      </Card>

      {/* Recent Visits */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Visits</CardTitle>
        </CardHeader>
        <CardContent>
          {recentVisits.length > 0 ? (
            <div className='space-y-4'>
              {recentVisits.map((event) => (
                <div
                  key={event.id}
                  className='flex items-start justify-between p-4 border rounded-lg'>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <Calendar className='w-4 h-4 text-gray-500' />
                      <span className='font-medium'>
                        {new Date(event.start).toLocaleDateString()}
                      </span>
                      <Clock className='w-4 h-4 text-gray-500 ml-2' />
                      <span>
                        {new Date(event.start).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {' ('}
                        {formatDuration(event.start, event.end)}
                        {')'}
                      </span>
                    </div>
                    <div className='text-sm text-gray-600'>{event.appointment.reason}</div>
                    <div className='flex items-center gap-2'>
                      <Badge variant='secondary'>
                        {event.appointment.checkedInDate ? 'Checked-in' : 'No check-in'}
                      </Badge>
                      {event.formCompleted && <Badge variant='outline'>Forms Completed</Badge>}
                      <Badge variant='outline'>{event.appointment.appointmentType}</Badge>
                    </div>
                  </div>
                  <Button variant='outline' size='sm'>
                    View Summary
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-gray-500'>No recent visits</div>
          )}
        </CardContent>
      </Card>

      {/* No-shows */}
      {noShows.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No-shows & Cancellations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {noShows.map((event) => (
                <div
                  key={event.id}
                  className='flex items-start justify-between p-4 border rounded-lg'>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <Calendar className='w-4 h-4 text-gray-500' />
                      <span className='font-medium'>
                        {new Date(event.start).toLocaleDateString()}
                      </span>
                      <Clock className='w-4 h-4 text-gray-500 ml-2' />
                      <span>
                        {new Date(event.start).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className='text-sm text-gray-600'>{event.appointment.reason}</div>
                    <div className='flex items-center gap-2'>
                      <Badge variant='destructive'>Cancelled</Badge>
                      <Badge variant='outline'>{event.appointment.appointmentType}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

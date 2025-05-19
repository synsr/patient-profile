import { Badge } from '@/components/ui/badge';
import { Sparkles, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BaseBadgeProps {
  className?: string;
}

type StatusVariant = {
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  icon: React.ComponentType<{ className?: string }> | null;
  className?: string;
};

export function AIGeneratedBadge({ className }: BaseBadgeProps) {
  return (
    <Badge
      variant='secondary'
      className={cn('gap-1 bg-purple-50 text-purple-800 border-purple-200', className)}>
      <Sparkles className='w-3 h-3' />
      AI-generated
    </Badge>
  );
}

export function UrgentBadge() {
  return (
    <Badge
      variant='outline'
      className='bg-red-50/50 text-red-600 border-red-200 hover:bg-red-100/50 hover:text-red-700'>
      <AlertTriangle className='w-3 h-3 mr-1' />
      Urgent
    </Badge>
  );
}

export function ActionRequiredBadge({ className }: BaseBadgeProps) {
  return (
    <Badge
      variant='secondary'
      className={cn('gap-1 bg-yellow-50 text-yellow-800 border-yellow-200', className)}>
      <AlertTriangle className='w-3 h-3' />
      Action Required
    </Badge>
  );
}

export function StatusBadge({
  status,
  className,
}: BaseBadgeProps & {
  status:
    | 'PAID'
    | 'PARTIALLY_PAID'
    | 'UNPAID'
    | 'SCHEDULED'
    | 'COMPLETED'
    | 'CONFIRMED'
    | 'CANCELLED';
}) {
  const variants: Record<string, StatusVariant> = {
    PAID: {
      variant: 'default',
      icon: CheckCircle,
      className: 'bg-green-50 text-green-800 border-green-200',
    },
    PARTIALLY_PAID: {
      variant: 'outline',
      icon: Clock,
      className: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    },
    UNPAID: {
      variant: 'outline',
      icon: AlertTriangle,
      className: 'bg-orange-50 text-orange-800 border-orange-200',
    },
    SCHEDULED: {
      variant: 'secondary',
      icon: null,
      className: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    COMPLETED: {
      variant: 'secondary',
      icon: CheckCircle,
      className: 'bg-green-50 text-green-800 border-green-200',
    },
    CONFIRMED: {
      variant: 'default',
      icon: CheckCircle,
      className: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    CANCELLED: {
      variant: 'destructive',
      icon: AlertTriangle,
      className: 'bg-red-50 text-red-800 border-red-200',
    },
  };

  const { variant, icon: Icon, className: statusClassName } = variants[status];

  return (
    <Badge variant={variant} className={cn('gap-1', statusClassName, className)}>
      {Icon && <Icon className='w-3 h-3' />}
      {status.replace('_', ' ')}
    </Badge>
  );
}

export function VersionBadge({ version, className }: BaseBadgeProps & { version: number }) {
  return (
    <Badge variant='outline' className={cn('bg-gray-50 text-gray-800 border-gray-200', className)}>
      v{version}
    </Badge>
  );
}

export function LatestBadge({ className }: BaseBadgeProps) {
  return (
    <Badge variant='default' className={cn('bg-blue-50 text-blue-800 border-blue-200', className)}>
      Latest
    </Badge>
  );
}

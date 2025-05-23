import { usePatientCharges } from '@/lib/api/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, CreditCard, FileText, Calendar, Clock, MapPin } from 'lucide-react';
import { StatusBadge } from '@/components/badges';

export function BillingTab({ id }: { id: string }) {
  const { data, isLoading } = usePatientCharges(id);

  if (isLoading) return <Skeleton className='h-96 w-full' />;
  if (!data) return null;

  const charges = data.data;
  const outstandingBalance = charges.reduce((sum, charge) => sum + charge.totalOutstanding, 0);
  const recentCharge = charges.sort(
    (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
  )[0];

  const activePaymentPlan = charges
    .flatMap((charge) => charge.plannedPayments)
    .filter((payment) => payment.status === 'SCHEDULED')
    .sort((a, b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime())[0];

  const handleChargePatient = () => {
    // TODO: Implement charge patient functionality
  };

  return (
    <div className='space-y-8'>
      {/* Actions Section */}
      <div className='flex gap-4'>
        <Button variant='outline'>
          <FileText className='w-4 h-4 mr-2' />
          Generate Statement
        </Button>
        {!activePaymentPlan && (
          <Button variant='outline'>
            <Calendar className='w-4 h-4 mr-2' />
            Set Up Payment Plan
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Outstanding Balance</CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='flex items-center justify-between'>
              <div>
                <div className='text-2xl font-bold'>${outstandingBalance.toFixed(2)}</div>
                <StatusBadge
                  status={
                    recentCharge.status === 'PAID'
                      ? 'PAID'
                      : recentCharge.totalOutstanding === 0
                      ? 'PAID'
                      : recentCharge.totalOutstanding < recentCharge.total
                      ? 'PARTIALLY_PAID'
                      : 'UNPAID'
                  }
                />
              </div>
              <Button onClick={handleChargePatient}>
                <DollarSign className='w-4 h-4 mr-2' />
                Pay Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {recentCharge && (
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Recent Charge</CardTitle>
              <CreditCard className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-sm font-medium'>{recentCharge.description}</div>
              <div className='text-2xl font-bold'>${recentCharge.total.toFixed(2)}</div>
              <StatusBadge status={recentCharge.status === 'PAID' ? 'PAID' : 'UNPAID'} />
            </CardContent>
          </Card>
        )}

        {activePaymentPlan && (
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Next Payment</CardTitle>
              <Calendar className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>${activePaymentPlan.amount.toFixed(2)}</div>
              <div className='text-sm text-muted-foreground'>
                Due {new Date(activePaymentPlan.paymentDate).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Charges */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Charges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {charges.map((charge) => (
              <div
                key={charge.id}
                className='flex items-start justify-between p-4 border rounded-lg'>
                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <Clock className='w-4 h-4 text-gray-500' />
                    <span className='font-medium'>
                      {new Date(charge.createdDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className='text-sm text-gray-600'>{charge.description}</div>
                  <div className='flex items-center gap-2'>
                    <StatusBadge
                      status={
                        charge.status === 'PAID'
                          ? 'PAID'
                          : charge.totalOutstanding === 0
                          ? 'PAID'
                          : charge.totalOutstanding < charge.total
                          ? 'PARTIALLY_PAID'
                          : 'UNPAID'
                      }
                    />
                    {charge.locationName && (
                      <div className='flex items-center gap-1'>
                        <MapPin className='w-4 h-4 text-gray-500' />
                        <span className='text-sm text-gray-500'>{charge.locationName}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className='text-right'>
                  <div className='text-lg font-semibold'>${charge.total.toFixed(2)}</div>
                  {charge.totalOutstanding > 0 && (
                    <div className='text-sm text-red-500'>
                      Outstanding: ${charge.totalOutstanding.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import {
  usePatientData,
  usePatientNotes,
  usePatientEvents,
  usePatientMemos,
} from '@/lib/api/mockData';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PatientHeader } from '@/components/PatientHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  FileText,
  Pill,
  Plus,
  Stethoscope,
  MessageSquare,
  Heart,
  Scale,
  Ruler,
  Pencil,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  CreditCard,
  Bell,
} from 'lucide-react';

export function OverviewTab({ id }: { id: string }) {
  const { data, isLoading, error } = usePatientData(id);
  const { data: notesData } = usePatientNotes(id);
  const { data: events } = usePatientEvents(id);
  const { data: memosData } = usePatientMemos(id);

  if (isLoading) return <Skeleton className='h-96 w-full' />;
  if (error || !data) return <div>Error loading patient data</div>;

  const { patient } = data;
  const latestNote = notesData?.data[0];
  const latestMemo = memosData?.[0];
  const upcomingAppointments = events?.filter(
    (event) => new Date(event.start) > new Date() && event.status === 'CONFIRMED'
  );
  const nextAppointment = upcomingAppointments?.[0];

  // Get active medications
  const activeMedications = patient.medications.filter((med) => med.active);

  // Get latest measurements
  const weight = patient.measurements.find((m) => m.type === 'WEIGHT');
  const height = patient.measurements.find((m) => m.type === 'HEIGHT');
  const latestBP = patient.measurements
    .filter((m) => m.type === 'BLOOD_PRESSURE')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  // Calculate BMI
  const calculateBMI = (weight: number, height: number) => {
    // Convert height from cm to m and weight from kg to kg
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const bmi = weight && height ? calculateBMI(Number(weight.value), Number(height.value)) : null;

  // Get latest alerts and messages
  const latestAlert = {
    type: 'MESSAGE_RECEIVED',
    message: 'Patient reported increased allergy symptoms despite taking medication as prescribed.',
    date: '2023-09-25T14:30:00Z',
    urgent: true,
  };

  // Get payment information
  const outstandingBalance = 135.0; // This would come from your billing data
  const recentPayment = {
    amount: 175.0,
    date: '2023-08-20T14:30:00Z',
    method: 'Visa ending in 4242',
  };

  return (
    <div className='space-y-8'>
      {/* Header with Core Information */}
      <PatientHeader patient={patient} />

      {/* Critical Information Section */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Left Column */}
        <div className='space-y-6'>
          {/* Vital Signs */}
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-lg font-semibold'>Vital Signs</CardTitle>
              <Button variant='outline' size='sm'>
                <Pencil className='w-4 h-4 mr-2' />
                Edit Vitals
              </Button>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 gap-6'>
                {weight && (
                  <div className='flex items-center gap-3'>
                    <div className='h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center'>
                      <Scale className='w-5 h-5 text-blue-600' />
                    </div>
                    <div>
                      <div className='text-sm text-muted-foreground'>Weight</div>
                      <div className='text-lg font-semibold'>
                        {weight.value} {weight.unit}
                      </div>
                    </div>
                  </div>
                )}
                {height && (
                  <div className='flex items-center gap-3'>
                    <div className='h-10 w-10 rounded-full bg-green-100 flex items-center justify-center'>
                      <Ruler className='w-5 h-5 text-green-600' />
                    </div>
                    <div>
                      <div className='text-sm text-muted-foreground'>Height</div>
                      <div className='text-lg font-semibold'>
                        {height.value} {height.unit}
                      </div>
                    </div>
                  </div>
                )}
                {bmi && (
                  <div className='flex items-center gap-3'>
                    <div className='h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center'>
                      <TrendingUp className='w-5 h-5 text-purple-600' />
                    </div>
                    <div>
                      <div className='text-sm text-muted-foreground'>BMI</div>
                      <div className='text-lg font-semibold'>{bmi}</div>
                    </div>
                  </div>
                )}
                {latestBP && (
                  <div className='flex items-center gap-3'>
                    <div className='h-10 w-10 rounded-full bg-red-100 flex items-center justify-center'>
                      <Heart className='w-5 h-5 text-red-600' />
                    </div>
                    <div>
                      <div className='text-sm text-muted-foreground'>Blood Pressure</div>
                      <div className='text-lg font-semibold'>{latestBP.value}</div>
                    </div>
                  </div>
                )}
              </div>
              <div className='text-xs text-muted-foreground mt-4'>
                Last updated:{' '}
                {new Date(
                  weight?.date || height?.date || latestBP?.date || ''
                ).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>

          {/* Medical History */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg font-semibold'>Medical History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div>
                  <div className='font-medium mb-2'>Allergies</div>
                  {patient.allergies.length > 0 ? (
                    <div className='flex flex-wrap gap-2'>
                      {patient.allergies.map((allergy) => (
                        <Badge key={allergy} variant='destructive'>
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className='text-muted-foreground'>No known allergies</div>
                  )}
                </div>
                <div>
                  <div className='font-medium mb-2'>Medical History</div>
                  {patient.medicalHistory.length > 0 ? (
                    <div className='flex flex-wrap gap-2'>
                      {patient.medicalHistory.map((condition) => (
                        <Badge key={condition} variant='secondary'>
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className='text-muted-foreground'>No medical history recorded</div>
                  )}
                </div>
                <div>
                  <div className='font-medium mb-2'>Family History</div>
                  {patient.familyHistory.length > 0 ? (
                    <div className='flex flex-wrap gap-2'>
                      {patient.familyHistory.map((condition) => (
                        <Badge key={condition} variant='outline'>
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className='text-muted-foreground'>No family history recorded</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className='space-y-6'>
          {/* Alerts and Messages */}
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-lg font-semibold'>Alerts & Messages</CardTitle>
              <Button variant='ghost' size='sm'>
                <Bell className='w-4 h-4 mr-2' />
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {latestAlert && (
                  <div className='p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
                    <div className='flex items-start gap-3'>
                      <AlertTriangle className='w-5 h-5 text-yellow-600 mt-0.5' />
                      <div>
                        <div className='flex items-center gap-2'>
                          <span className='text-sm font-medium text-yellow-800'>
                            Urgent Message
                          </span>
                          <Badge variant='destructive'>Urgent</Badge>
                        </div>
                        <p className='text-sm text-yellow-700 mt-1'>{latestAlert.message}</p>
                        <div className='text-xs text-yellow-600 mt-2'>
                          {new Date(latestAlert.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {latestMemo && (
                  <div className='p-4 bg-gray-50 border border-gray-200 rounded-lg'>
                    <div className='flex items-start gap-3'>
                      <MessageSquare className='w-5 h-5 text-gray-600 mt-0.5' />
                      <div>
                        <div className='text-sm font-medium text-gray-800'>Latest Memo</div>
                        <p className='text-sm text-gray-700 mt-1'>{latestMemo.note}</p>
                        <div className='text-xs text-gray-500 mt-2'>
                          {new Date(latestMemo.createdDate).toLocaleDateString()} by{' '}
                          {`${latestMemo.creator.firstName} ${latestMemo.creator.lastName}`}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-lg font-semibold'>Payment Information</CardTitle>
              <Button variant='ghost' size='sm'>
                <DollarSign className='w-4 h-4 mr-2' />
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg'>
                  <div className='flex items-center gap-3'>
                    <div className='h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center'>
                      <DollarSign className='w-5 h-5 text-blue-600' />
                    </div>
                    <div>
                      <div className='text-sm text-muted-foreground'>Outstanding Balance</div>
                      <div className='text-lg font-semibold'>${outstandingBalance.toFixed(2)}</div>
                    </div>
                  </div>
                  <Button variant='outline' size='sm'>
                    Pay Now
                  </Button>
                </div>
                {recentPayment && (
                  <div className='p-4 bg-gray-50 border border-gray-200 rounded-lg'>
                    <div className='flex items-start gap-3'>
                      <CreditCard className='w-5 h-5 text-gray-600 mt-0.5' />
                      <div>
                        <div className='text-sm font-medium text-gray-800'>Recent Payment</div>
                        <div className='text-sm text-gray-700 mt-1'>
                          ${recentPayment.amount.toFixed(2)} via {recentPayment.method}
                        </div>
                        <div className='text-xs text-gray-500 mt-2'>
                          {new Date(recentPayment.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Current Medications */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-lg font-semibold'>Current Medications</CardTitle>
          <Button variant='outline' size='sm'>
            <Plus className='w-4 h-4 mr-2' />
            Add Medication
          </Button>
        </CardHeader>
        <CardContent>
          {activeMedications.length > 0 ? (
            <div className='space-y-4'>
              {activeMedications.map((med) => (
                <div
                  key={med.id}
                  className='flex items-start justify-between p-3 border rounded-lg'>
                  <div className='flex items-start gap-3'>
                    <Pill className='w-5 h-5 text-muted-foreground mt-1' />
                    <div>
                      <div className='font-medium'>{med.name}</div>
                      <div className='text-sm text-muted-foreground'>
                        {med.dosage} • {med.frequency}
                      </div>
                      <div className='text-xs text-muted-foreground mt-1'>
                        Started: {new Date(med.startDate).toLocaleDateString()}
                        {med.endDate && ` • Ends: ${new Date(med.endDate).toLocaleDateString()}`}
                      </div>
                    </div>
                  </div>
                  <Button variant='ghost' size='sm'>
                    Refill
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-muted-foreground'>No active medications</div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Latest Clinical Note */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-lg font-semibold'>Latest Clinical Note</CardTitle>
            <Button variant='ghost' size='sm'>
              <FileText className='w-4 h-4 mr-2' />
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {latestNote ? (
              <div>
                <div className='text-sm text-muted-foreground mb-2'>
                  {new Date(latestNote.createdDate).toLocaleDateString()} by{' '}
                  {latestNote.providerNames.join(', ')}
                </div>
                <div className='font-medium'>{latestNote.summary}</div>
                {latestNote.aiGenerated && (
                  <div className='text-xs text-muted-foreground mt-2 italic'>
                    AI-generated summary
                  </div>
                )}
              </div>
            ) : (
              <div className='text-muted-foreground'>No notes found</div>
            )}
          </CardContent>
        </Card>

        {/* Next Appointment */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-lg font-semibold'>Next Appointment</CardTitle>
            <Button variant='ghost' size='sm'>
              <Calendar className='w-4 h-4 mr-2' />
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {nextAppointment ? (
              <div>
                <div className='flex items-center gap-2 mb-2'>
                  <Clock className='w-4 h-4 text-muted-foreground' />
                  <span className='text-sm text-muted-foreground'>
                    {new Date(nextAppointment.start).toLocaleString()}
                  </span>
                </div>
                <div className='font-medium'>{nextAppointment.title}</div>
                <div className='text-sm text-muted-foreground mt-1'>
                  {nextAppointment.location.name}
                </div>
                <div className='flex items-center gap-2 mt-2'>
                  <Stethoscope className='w-4 h-4 text-muted-foreground' />
                  <span className='text-sm text-muted-foreground'>
                    {nextAppointment.appointment.appointmentType.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ) : (
              <div className='text-muted-foreground'>No upcoming appointments</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import {
  usePatientData,
  usePatientNotes,
  usePatientEvents,
  usePatientMemos,
  usePatientAlerts,
  usePatientCharges,
} from '@/lib/api/mockData';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PatientHeader } from '@/components/PatientHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  FileText,
  MessageSquare,
  Stethoscope,
  AlertTriangle,
  User,
  Pill,
  Plus,
  Heart,
  Scale,
  Ruler,
  Pencil,
  TrendingUp,
  DollarSign,
  CreditCard,
  Bell,
  MapPin,
} from 'lucide-react';
import { getUpcomingAppointments } from '@/lib/utils/appointments';
import { AIGeneratedBadge, UrgentBadge } from '@/components/badges';

const MEASUREMENT_ICONS = {
  weight: {
    icon: Scale,
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-600',
  },
  height: {
    icon: Ruler,
    bgColor: 'bg-green-100',
    textColor: 'text-green-600',
  },
  bmi: {
    icon: TrendingUp,
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-600',
  },
  bloodPressure: {
    icon: Heart,
    bgColor: 'bg-red-100',
    textColor: 'text-red-600',
  },
} as const;

const VIEW_HISTORY_TEXT = 'View Full History';

export function OverviewTab({ id }: { id: string }) {
  const { data, isLoading, error } = usePatientData(id);
  const { data: notesData } = usePatientNotes(id);
  const { data: events } = usePatientEvents(id);
  const { data: memosData } = usePatientMemos(id);
  const { data: alertsData } = usePatientAlerts(id);
  const { data: chargesData } = usePatientCharges(id);

  if (isLoading) return <Skeleton className='h-96 w-full' />;
  if (error || !data) return <div>Error loading patient data</div>;

  const { patient } = data;
  const latestNote = notesData?.data[0];
  const latestMemo = memosData?.[0];

  // Get the most important alert (urgent first, then latest)
  const latestAlert =
    alertsData?.data.find((alert) => alert.tags.some((tag) => tag.name === 'Urgent')) ||
    alertsData?.data[0];

  // Use updated utility for upcoming appointments
  const upcomingAppointments = events ? getUpcomingAppointments(events, patient.id) : [];
  const nextAppointment = upcomingAppointments[0];

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

  // Get payment information from charges data
  const charges = chargesData?.data || [];
  const outstandingBalance = charges.reduce((sum, charge) => sum + charge.totalOutstanding, 0);
  const recentPayment = charges
    .flatMap((charge) => charge.payments)
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())[0];

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
              <CardTitle className='text-lg font-semibold'>Vitals</CardTitle>
              <Button variant='outline' size='sm'>
                <Pencil className='w-4 h-4 mr-2' />
                Edit Vitals
              </Button>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 gap-6'>
                {weight && (
                  <div className='flex items-center gap-3'>
                    <div
                      className={`h-10 w-10 rounded-full ${MEASUREMENT_ICONS.weight.bgColor} flex items-center justify-center`}>
                      <MEASUREMENT_ICONS.weight.icon
                        className={`w-5 h-5 ${MEASUREMENT_ICONS.weight.textColor}`}
                      />
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
                    <div
                      className={`h-10 w-10 rounded-full ${MEASUREMENT_ICONS.height.bgColor} flex items-center justify-center`}>
                      <MEASUREMENT_ICONS.height.icon
                        className={`w-5 h-5 ${MEASUREMENT_ICONS.height.textColor}`}
                      />
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
                    <div
                      className={`h-10 w-10 rounded-full ${MEASUREMENT_ICONS.bmi.bgColor} flex items-center justify-center`}>
                      <MEASUREMENT_ICONS.bmi.icon
                        className={`w-5 h-5 ${MEASUREMENT_ICONS.bmi.textColor}`}
                      />
                    </div>
                    <div>
                      <div className='text-sm text-muted-foreground'>BMI</div>
                      <div className='text-lg font-semibold'>{bmi}</div>
                    </div>
                  </div>
                )}
                {latestBP && (
                  <div className='flex items-center gap-3'>
                    <div
                      className={`h-10 w-10 rounded-full ${MEASUREMENT_ICONS.bloodPressure.bgColor} flex items-center justify-center`}>
                      <MEASUREMENT_ICONS.bloodPressure.icon
                        className={`w-5 h-5 ${MEASUREMENT_ICONS.bloodPressure.textColor}`}
                      />
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
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-lg font-semibold'>Medical History</CardTitle>
              <Button variant='ghost' size='sm'>
                <FileText className='w-4 h-4 mr-2' />
                {VIEW_HISTORY_TEXT}
              </Button>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                <div>
                  <div className='flex items-center gap-2 mb-3'>
                    <AlertTriangle className='w-5 h-5 text-orange-500' />
                    <div className='font-medium'>Allergies</div>
                  </div>
                  {patient.allergies.length > 0 ? (
                    <div className='flex flex-wrap gap-2'>
                      {patient.allergies.map((allergy) => (
                        <Badge
                          key={allergy}
                          variant='secondary'
                          className='bg-orange-50 text-orange-800 border-orange-200 px-4 py-1.5'>
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className='text-muted-foreground'>No known allergies</div>
                  )}
                </div>
                <div>
                  <div className='flex items-center gap-2 mb-3'>
                    <Stethoscope className='w-5 h-5 text-blue-500' />
                    <div className='font-medium'>Medical History</div>
                  </div>
                  {patient.medicalHistory.length > 0 ? (
                    <div className='flex flex-wrap gap-2'>
                      {patient.medicalHistory.map((condition) => (
                        <Badge
                          key={condition}
                          variant='secondary'
                          className='bg-blue-50 text-blue-800 border-blue-200 px-4 py-1.5'>
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className='text-muted-foreground'>No medical history recorded</div>
                  )}
                </div>
                <div>
                  <div className='flex items-center gap-2 mb-3'>
                    <User className='w-5 h-5 text-purple-500' />
                    <div className='font-medium'>Family History</div>
                  </div>
                  {patient.familyHistory.length > 0 ? (
                    <div className='flex flex-wrap gap-2'>
                      {patient.familyHistory.map((condition) => (
                        <Badge key={condition} variant='outline' className='px-3 py-1'>
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
                <div className='border rounded-lg overflow-hidden'>
                  <div className='p-4 border-b bg-gray-50'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <div className='h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center'>
                          <Calendar className='w-5 h-5 text-blue-600' />
                        </div>
                        <div>
                          <div className='font-medium text-gray-900'>{nextAppointment.title}</div>
                          <div className='text-sm text-gray-500'>
                            {new Date(nextAppointment.start).toLocaleString(undefined, {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric',
                            })}
                          </div>
                        </div>
                      </div>
                      <Button variant='outline' size='sm'>
                        Reschedule
                      </Button>
                    </div>
                  </div>
                  <div className='p-4 space-y-3'>
                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                      <Stethoscope className='w-4 h-4' />
                      <span>{nextAppointment.appointment.appointmentType.replace('_', ' ')}</span>
                    </div>
                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                      <MapPin className='w-4 h-4' />
                      <span>{nextAppointment.location.name}</span>
                    </div>
                    <div className='text-sm text-gray-600'>
                      {nextAppointment.appointment.reason}
                    </div>
                  </div>
                </div>
              ) : (
                <div className='text-muted-foreground'>No upcoming appointments</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className='space-y-6'>
          {/* Alerts and Messages */}
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-lg font-semibold'>Notifications</CardTitle>
              <Button variant='ghost' size='sm'>
                <Bell className='w-4 h-4 mr-2' />
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {latestAlert && (
                  <div
                    className={`p-4 ${
                      latestAlert.tags.some((tag) => tag.name === 'Urgent')
                        ? 'bg-white border-red-200'
                        : 'bg-yellow-50 border-yellow-200'
                    } border rounded-lg`}>
                    <div className='flex items-start gap-3'>
                      <AlertTriangle
                        className={`w-5 h-5 ${
                          latestAlert.tags.some((tag) => tag.name === 'Urgent')
                            ? 'text-red-400'
                            : 'text-yellow-600'
                        } mt-0.5`}
                      />
                      <div>
                        <div className='flex items-center gap-2'>
                          <span
                            className={`text-sm font-medium ${
                              latestAlert.tags.some((tag) => tag.name === 'Urgent')
                                ? 'text-gray-800'
                                : 'text-yellow-800'
                            }`}>
                            {latestAlert.type === 'MESSAGE_RECEIVED'
                              ? 'New Message'
                              : latestAlert.type === 'FORM_SUBMITTED'
                              ? 'Form Submitted'
                              : 'Appointment Scheduled'}
                          </span>
                          {latestAlert.tags.some((tag) => tag.name === 'Urgent') && <UrgentBadge />}
                          {latestAlert.actionRequired &&
                            !latestAlert.tags.some((tag) => tag.name === 'Urgent') && (
                              <Badge variant='secondary'>Action Required</Badge>
                            )}
                        </div>
                        <p
                          className={`text-sm ${
                            latestAlert.tags.some((tag) => tag.name === 'Urgent')
                              ? 'text-gray-700'
                              : 'text-yellow-700'
                          } mt-1`}>
                          {latestAlert.type === 'MESSAGE_RECEIVED'
                            ? latestAlert.data.message
                            : latestAlert.type === 'FORM_SUBMITTED'
                            ? `${latestAlert.data.name} Submitted`
                            : `Appointment: ${latestAlert.data.title}`}
                        </p>
                        <div
                          className={`text-xs ${
                            latestAlert.tags.some((tag) => tag.name === 'Urgent')
                              ? 'text-gray-500'
                              : 'text-yellow-600'
                          } mt-2`}>
                          {new Date(latestAlert.createdDate).toLocaleDateString()}
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
                          <span className='font-semibold'>${recentPayment.amount.toFixed(2)}</span>
                          {recentPayment.paymentMethod && (
                            <>
                              {' via '}
                              {recentPayment.paymentMedium === 'CARD'
                                ? `${recentPayment.paymentMethod.brand} ending in ${recentPayment.paymentMethod.last4}`
                                : recentPayment.paymentMedium === 'CASH'
                                ? 'Cash'
                                : recentPayment.paymentMedium === 'CHECK'
                                ? 'Check'
                                : recentPayment.paymentMedium === 'INSURANCE'
                                ? 'Insurance'
                                : recentPayment.paymentMedium}
                            </>
                          )}
                        </div>
                        <div className='text-xs text-gray-500 mt-2'>
                          {new Date(recentPayment.createdDate).toLocaleDateString()}
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

      {/* Current Medications and Recent Activity */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Current Medications */}
        <Card className='md:col-span-2'>
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
                    className='flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors'>
                    <div className='flex items-start gap-4'>
                      <div className='h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center'>
                        <Pill className='w-5 h-5 text-blue-600' />
                      </div>
                      <div className='space-y-1'>
                        <div className='font-medium'>{med.name}</div>
                        <div className='text-sm text-muted-foreground'>
                          {med.dosage} • {med.frequency}
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          Started: {new Date(med.startDate).toLocaleDateString()}
                          {med.endDate && ` • Ends: ${new Date(med.endDate).toLocaleDateString()}`}
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Button variant='ghost' size='sm'>
                        <FileText className='w-4 h-4 mr-2' />
                        Notes
                      </Button>
                      <Button variant='outline' size='sm'>
                        Refill
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-muted-foreground'>No active medications</div>
            )}
          </CardContent>
        </Card>

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
              <div className='space-y-3'>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Calendar className='w-4 h-4' />
                  {new Date(latestNote.createdDate).toLocaleDateString()}
                </div>
                <div className='font-medium'>{latestNote.summary}</div>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Stethoscope className='w-4 h-4' />
                  {latestNote.providerNames.join(', ')}
                </div>
                {latestNote.aiGenerated && <AIGeneratedBadge />}
              </div>
            ) : (
              <div className='text-muted-foreground'>No notes found</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

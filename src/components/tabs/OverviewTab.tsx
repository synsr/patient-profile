import { usePatientData } from '@/lib/api/mockData';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { PatientHeader } from '@/components/PatientHeader';
import { Badge } from '@/components/ui/badge';

export function OverviewTab({ id }: { id: string }) {
  const { data, isLoading, error } = usePatientData(id);

  if (isLoading) return <Skeleton className='h-96 w-full' />;
  if (error || !data) return <div>Error loading patient data</div>;

  const { patient, notes, events } = data;
  const latestNote = notes.data[0];
  const latestEvent = events[0];

  return (
    <div className='space-y-8'>
      {/* Header */}
      <PatientHeader patient={patient} />

      {/* Info Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Medical/Family/Allergy Card */}
        <Card>
          <CardContent>
            <h2 className='text-lg font-semibold mb-2'>Medical & Family History</h2>
            <div className='mb-2'>
              <span className='font-medium'>Allergies: </span>
              {patient.allergies.length ? (
                patient.allergies.map((a) => (
                  <Badge key={a} variant='destructive' className='mr-2 mb-1'>
                    {a}
                  </Badge>
                ))
              ) : (
                <span className='text-gray-500'>None</span>
              )}
            </div>
            <div className='mb-2'>
              <span className='font-medium'>Medical History: </span>
              {patient.medicalHistory.length ? (
                patient.medicalHistory.map((m) => (
                  <Badge key={m} variant='secondary' className='mr-2 mb-1'>
                    {m}
                  </Badge>
                ))
              ) : (
                <span className='text-gray-500'>None</span>
              )}
            </div>
            <div>
              <span className='font-medium'>Family History: </span>
              {patient.familyHistory.length ? (
                patient.familyHistory.map((f) => (
                  <Badge key={f} variant='outline' className='mr-2 mb-1'>
                    {f}
                  </Badge>
                ))
              ) : (
                <span className='text-gray-500'>None</span>
              )}
            </div>
          </CardContent>
        </Card>
        {/* Vitals/Medications Card */}
        <Card>
          <CardContent>
            <h2 className='text-lg font-semibold mb-2'>Vitals & Medications</h2>
            <div className='mb-2'>
              <span className='font-medium'>Vitals: </span>
              {patient.measurements.map((m) => (
                <Badge key={m.id} className='mr-2 mb-1'>
                  {m.type.replace('_', ' ')}: {m.value} {m.unit}
                </Badge>
              ))}
            </div>
            <div>
              <span className='font-medium'>Medications: </span>
              {patient.medications.length ? (
                patient.medications.map((med) => (
                  <Badge key={med.id} variant='secondary' className='mr-2 mb-1'>
                    {med.name} - {med.dosage}
                  </Badge>
                ))
              ) : (
                <span className='text-gray-500'>None</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Latest Clinical Note & Appointment */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardContent>
            <h2 className='text-lg font-semibold mb-2'>Latest Clinical Note</h2>
            {latestNote ? (
              <div>
                <div className='text-sm text-gray-500 mb-1'>
                  {new Date(latestNote.createdDate).toLocaleDateString()} by{' '}
                  {latestNote.providerNames.join(', ')}
                </div>
                <div className='font-medium'>{latestNote.summary}</div>
                <div className='text-xs text-gray-400 mt-2'>
                  {latestNote.aiGenerated && <span className='italic'>AI-generated summary</span>}
                </div>
              </div>
            ) : (
              <div className='text-gray-500'>No notes found</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className='text-lg font-semibold mb-2'>Next Appointment</h2>
            {latestEvent ? (
              <div>
                <div className='text-sm text-gray-500 mb-1'>
                  {new Date(latestEvent.start).toLocaleString()} at {latestEvent.location?.name}
                </div>
                <div className='font-medium'>{latestEvent.title}</div>
                <div className='text-xs text-gray-400 mt-2'>Status: {latestEvent.status}</div>
              </div>
            ) : (
              <div className='text-gray-500'>No upcoming appointments</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

'use client';

import { usePatientData } from '@/lib/api/mockData';
import { PatientSkeleton } from '@/components/PatientSkeleton';
import { PatientHeader } from '@/components/PatientHeader';
import { EventsList } from '@/components/EventsList';
import { NotesList } from '@/components/NotesList';

export function PatientProfile({ id }: { id: string }) {
  const { data, isLoading, error } = usePatientData(id);

  if (isLoading) return <PatientSkeleton />;
  if (error) return <div>Error loading patient data</div>;
  if (!data) return <div>Patient not found</div>;

  const { patient, events, notes } = data;

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <PatientHeader patient={patient} />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
        <div>
          <h2 className='text-xl font-semibold mb-4'>Recent Events</h2>
          <EventsList events={events} />
        </div>

        <div>
          <h2 className='text-xl font-semibold mb-4'>Notes</h2>
          <NotesList notes={notes.data} />
        </div>
      </div>
    </div>
  );
}

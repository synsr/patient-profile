import patientData from './mock/patient.json';
import eventsData from './mock/events.json';
import doctorsNotesData from './mock/doctors_notes.json';
import type { Patient, Event, DoctorsNotesResponse } from '../types';
import { useQuery } from '@tanstack/react-query';

// Simulating API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getPatientData = async (id: string): Promise<Patient> => {
  await delay(500); // Simulate network delay

  if (patientData.id !== id) {
    throw new Error('Patient not found');
  }
  return patientData as Patient;
};

export const getPatientEvents = async (id: string): Promise<Event[]> => {
  await delay(500);
  // Filter events for this patient
  return (eventsData as Event[]).filter((event) =>
    event.attendees.some((attendee) => attendee.user.id === id)
  );
};

export const getPatientNotes = async (id: string): Promise<DoctorsNotesResponse> => {
  await delay(500);
  // Filter notes for this patient
  const filteredNotes = (doctorsNotesData as DoctorsNotesResponse).data.filter(
    (note) => note.patient.id === id
  );
  return {
    data: filteredNotes,
    total: filteredNotes.length,
  };
};

export function usePatientData(id: string) {
  return useQuery({
    queryKey: ['patient-data', id],
    queryFn: async () => {
      const [patient, events] = await Promise.all([getPatientData(id), getPatientEvents(id)]);

      return {
        patient,
        events,
      };
    },
  });
}

export function usePatientNotes(id: string) {
  return useQuery({
    queryKey: ['patient-notes', id],
    queryFn: () => getPatientNotes(id),
  });
}

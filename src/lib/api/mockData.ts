import patientData from './mock/patient.json';
import eventsData from './mock/events.json';
import doctorsNotesData from './mock/doctors_notes.json';
import chargesData from './mock/charges.json';
import paymentMethodsData from './mock/payment_methods.json';
import memosData from './mock/memos.json';
import type {
  Patient,
  Event,
  DoctorsNotesResponse,
  ChargesResponse,
  Attendee,
  DoctorsNote,
  Charge,
  PaymentMethod,
  Memo,
} from '../types';
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
  console.log('Fetching events for patient:', id);
  console.log('All events data:', eventsData);

  // Filter events for this patient
  const filteredEvents = (eventsData as Event[]).filter((event) =>
    event.attendees.some((attendee: Attendee) => attendee.user.id === id)
  );

  console.log('Filtered events:', filteredEvents);
  return filteredEvents;
};

export const getPatientNotes = async (id: string): Promise<DoctorsNotesResponse> => {
  await delay(500);
  // Filter notes for this patient
  const filteredNotes = (doctorsNotesData as DoctorsNotesResponse).data.filter(
    (note: DoctorsNote) => note.patient.id === id
  );
  return {
    data: filteredNotes,
    total: filteredNotes.length,
  };
};

export const getPatientCharges = async (id: string): Promise<ChargesResponse> => {
  await delay(500);
  // Filter charges for this patient
  const filteredCharges = (chargesData as ChargesResponse).data.filter(
    (charge: Charge) => charge.patient.id === id
  );
  return {
    data: filteredCharges,
    total: filteredCharges.length,
  };
};

export const getPatientPaymentMethods = async (id: string): Promise<PaymentMethod[]> => {
  await delay(500);
  return (paymentMethodsData as PaymentMethod[]).filter((method) => method.patientId === id);
};

export const getPatientMemos = async (id: string): Promise<Memo[]> => {
  await delay(500);
  return (memosData as Memo[]).filter((memo) => memo.patient.id === id);
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

export function usePatientEvents(id: string) {
  return useQuery({
    queryKey: ['patient-events', id],
    queryFn: () => getPatientEvents(id),
  });
}

export function usePatientCharges(id: string) {
  return useQuery({
    queryKey: ['patient-charges', id],
    queryFn: async () => {
      const [charges, paymentMethods] = await Promise.all([
        getPatientCharges(id),
        getPatientPaymentMethods(id),
      ]);
      return {
        ...charges,
        paymentMethods,
      };
    },
  });
}

export function usePatientMemos(id: string) {
  return useQuery({
    queryKey: ['patient-memos', id],
    queryFn: () => getPatientMemos(id),
  });
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isVirtual: boolean;
  meetingLink: string | null;
}

export interface Attendee {
  user: User;
  inviteStatus: 'ACCEPTED' | 'DECLINED' | 'PENDING';
}

export interface Appointment {
  id: string;
  eventId: string;
  patientId: string;
  providerId: string;
  reason: string;
  confirmationStatus: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  confirmationDate: string;
  checkedInDate: string | null;
  appointmentType: 'NEW_PATIENT' | 'FOLLOW_UP' | 'ANNUAL_PHYSICAL';
}

export interface Event {
  id: string;
  title: string;
  organizer: User;
  start: string;
  end: string;
  type: 'APPOINTMENT';
  status: 'COMPLETED' | 'CONFIRMED' | 'CANCELLED';
  meetingLink: string | null;
  attendees: Attendee[];
  location: Location;
  formCompleted: boolean;
  appointment: Appointment;
}

export interface Measurement {
  id: string;
  patientId: string;
  type: 'WEIGHT' | 'HEIGHT' | 'BLOOD_PRESSURE';
  value: number | string;
  unit: string;
  date: string;
}

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string | null;
  active: boolean;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  address: string;
  addressLineTwo: string | null;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  addressValid: boolean;
  guardianName: string | null;
  guardianPhoneNumber: string | null;
  maritalStatus: string;
  gender: string;
  employmentStatus: string;
  dateOfBirth: string;
  allergies: string[];
  familyHistory: string[];
  medicalHistory: string[];
  prescriptions: string[];
  goalWeight: number;
  isOnboardingComplete: boolean;
  createdDate: string;
  firebaseUid: string;
  measurements: Measurement[];
  medications: Medication[];
}

export interface DoctorsNote {
  id: string;
  eventId: string;
  parentNoteId: string;
  noteTranscriptId: string | null;
  duration: number | null;
  version: number;
  currentVersion: number;
  content: string;
  summary: string;
  aiGenerated: boolean;
  template: string | null;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    address: string;
    addressLineTwo: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    dateOfBirth: string;
    gender: string;
  };
  createdDate: string;
  providerNames: string[];
}

export interface DoctorsNotesResponse {
  data: DoctorsNote[];
  total: number;
}

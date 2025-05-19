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

export interface PaymentMethod {
  id: string;
  patientId: string;
  brand: string | null;
  last4: string | null;
  expMonth: number | null;
  expYear: number | null;
  accountHolderType: string | null;
  accountNumberLast4: number | null;
  bankName: string | null;
  routingNumber: number | null;
  description: string;
  type: 'CARD' | 'BANK_ACCOUNT';
  isDefault: boolean;
}

export interface Refund {
  id: string;
  amount: number;
  createdDate: string;
  reason?: string;
}

export interface Payment {
  id: string;
  amount: number;
  createdDate: string;
  paymentMethod: PaymentMethod;
  paymentMedium: 'CARD' | 'CASH' | 'CHECK' | 'INSURANCE';
  refunds: Refund[];
}

export interface Adjustment {
  id: string;
  chargeId: string;
  amount: number;
  type: 'DISCOUNT' | 'WRITE_OFF' | 'ADJUSTMENT';
  description: string;
  createdDate: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
  createdDate: string;
  category: string;
}

export interface ChargeItem {
  item_id: string;
  charge_id: string;
  quantity: number;
  item: Item;
}

export interface PlannedPayment {
  id: string;
  amount: number;
  paymentDate: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}

export interface Charge {
  id: string;
  total: number;
  totalOutstanding: number;
  description: string;
  status: 'PARTIALLY_PAID' | 'PAID' | 'UNPAID';
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdDate: string;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  adjustments: Adjustment[];
  payments: Payment[];
  plannedPayments: PlannedPayment[];
  comment: string | null;
  items: ChargeItem[];
  locationId: string | null;
  locationName: string | null;
}

export interface ChargesResponse {
  data: Charge[];
  total: number;
}

export interface Memo {
  id: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  note: string;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdDate: string;
  updatedDate: string;
}

export interface Alert {
  id: string;
  type: 'FORM_SUBMITTED' | 'APPOINTMENT_SCHEDULED' | 'MESSAGE_RECEIVED';
  data: {
    id?: string;
    name?: string;
    title?: string;
    start?: string;
    end?: string;
    message?: string;
    patient?: {
      id: string;
      firstName: string;
      lastName: string;
    };
    organizer?: {
      id: string;
      firstName: string;
      lastName: string;
    };
    appointment?: {
      id: string;
      reason: string;
      confirmationStatus: string;
    };
  };
  createdDate: string;
  actionRequired: boolean;
  resolvedDate: string | null;
  tags: Array<{
    id: string;
    name: string;
  }>;
  assignedProvider: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  resolvingProvider: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
}

export interface AlertsResponse {
  data: Alert[];
  total: number;
}

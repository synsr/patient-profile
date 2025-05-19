import type { Event } from '@/lib/types';

export function getUpcomingAppointments(events: Event[], patientId: string): Event[] {
  return events
    .filter((event) => {
      const isAppointment = event.type === 'APPOINTMENT';
      const isConfirmed = event.status === 'CONFIRMED';
      const isForPatient = event.attendees.some((attendee) => attendee.user.id === patientId);
      return isAppointment && isConfirmed && isForPatient;
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}

export function getRecentVisits(events: Event[], patientId: string): Event[] {
  return events
    .filter((event) => {
      const isAppointment = event.type === 'APPOINTMENT';
      const isCompleted = event.status === 'COMPLETED';
      const isForPatient = event.attendees.some((attendee) => attendee.user.id === patientId);
      return isAppointment && isCompleted && isForPatient;
    })
    .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());
}

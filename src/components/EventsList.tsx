import { Event } from '@/lib/types';

interface EventsListProps {
  events: Event[];
}

export function EventsList({ events }: EventsListProps) {
  if (!events.length) {
    return <p className='text-gray-500'>No events found</p>;
  }

  return (
    <div className='space-y-4'>
      {events.map((event) => (
        <div key={event.id} className='bg-white rounded-lg shadow p-4'>
          <div className='flex justify-between items-start'>
            <div>
              <h3 className='font-medium'>{event.title}</h3>
              <p className='text-sm text-gray-600'>{event.appointment.reason}</p>
            </div>
            <span className='text-sm text-gray-500'>
              {new Date(event.start).toLocaleDateString()}
            </span>
          </div>
          <div className='mt-2'>
            <h4 className='text-sm font-medium text-gray-500'>Attendees</h4>
            <div className='mt-1 flex flex-wrap gap-2'>
              {event.attendees.map((attendee) => (
                <span
                  key={attendee.user.id}
                  className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                  {attendee.user.firstName} {attendee.user.lastName}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

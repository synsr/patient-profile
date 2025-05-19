import {
  usePatientData,
  usePatientNotes,
  usePatientEvents,
  usePatientMemos,
} from '@/lib/api/mockData';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  Stethoscope,
  AlertTriangle,
  User,
  MapPin,
} from 'lucide-react';
import { Event, DoctorsNote, Memo } from '@/lib/types';
import { StatusBadge, AIGeneratedBadge } from '@/components/badges';

const EVENT_ICONS = {
  APPOINTMENT: Calendar,
  NOTE: FileText,
  MEMO: MessageSquare,
} as const;

const METADATA_ICONS = {
  providers: Stethoscope,
  duration: Clock,
  aiGenerated: AlertTriangle,
  creator: MessageSquare,
  location: MapPin,
  appointmentType: User,
} as const;

type TimelineEvent = {
  id: string;
  type: keyof typeof EVENT_ICONS;
  title: string;
  description: string;
  date: string;
  icon: React.ReactNode;
  status?: 'COMPLETED' | 'CONFIRMED' | 'CANCELLED' | 'SCHEDULED';
  metadata?: {
    appointmentType?: string;
    location?: string;
    duration?: string;
    providers?: string[];
    aiGenerated?: boolean;
    creator?: string;
  };
};

function extractKeyEvents(events: Event[], notes: DoctorsNote[], memos: Memo[]): TimelineEvent[] {
  const timelineEvents: TimelineEvent[] = [];

  // Process appointments
  events.forEach((event) => {
    if (event.type === 'APPOINTMENT') {
      // Add the appointment itself
      timelineEvents.push({
        id: event.id,
        type: 'APPOINTMENT',
        title: event.title,
        description: event.appointment.reason,
        date: event.start,
        icon: <EVENT_ICONS.APPOINTMENT className='w-5 h-5 text-blue-600' />,
        status: event.status,
        metadata: {
          appointmentType: event.appointment.appointmentType,
          location: event.location.name,
          duration: `${Math.floor(
            (new Date(event.end).getTime() - new Date(event.start).getTime()) / (1000 * 60)
          )} min`,
        },
      });

      // If there's a clinical note associated with this appointment
      const associatedNote = notes.find((note) => note.eventId === event.id);
      if (associatedNote) {
        timelineEvents.push({
          id: associatedNote.id,
          type: 'NOTE',
          title: 'Clinical Note',
          description: associatedNote.summary,
          date: associatedNote.createdDate,
          icon: <EVENT_ICONS.NOTE className='w-5 h-5 text-purple-600' />,
          metadata: {
            providers: associatedNote.providerNames,
            duration: associatedNote.duration ? `${associatedNote.duration / 60} min` : undefined,
            aiGenerated: associatedNote.aiGenerated,
          },
        });
      }
    }
  });

  // Add relevant memos (those that indicate patient interaction)
  memos.forEach((memo) => {
    // Only include memos that indicate direct patient interaction
    if (
      memo.note.toLowerCase().includes('patient') ||
      memo.note.toLowerCase().includes('called') ||
      memo.note.toLowerCase().includes('scheduled')
    ) {
      timelineEvents.push({
        id: memo.id,
        type: 'MEMO',
        title: 'Note Added',
        description: memo.note,
        date: memo.createdDate,
        icon: <EVENT_ICONS.MEMO className='w-5 h-5 text-green-600' />,
        metadata: {
          creator: `${memo.creator.firstName} ${memo.creator.lastName}`,
        },
      });
    }
  });

  return timelineEvents;
}

export function TimelineTab({ id }: { id: string }) {
  const { data: patientData, isLoading: isLoadingPatient } = usePatientData(id);
  const { data: notesData, isLoading: isLoadingNotes } = usePatientNotes(id);
  const { data: events, isLoading: isLoadingEvents } = usePatientEvents(id);
  const { data: memosData, isLoading: isLoadingMemos } = usePatientMemos(id);

  if (isLoadingPatient || isLoadingNotes || isLoadingEvents || isLoadingMemos) {
    return <Skeleton className='h-96 w-full' />;
  }

  if (!patientData || !notesData || !events || !memosData) {
    return <div>Error loading timeline data</div>;
  }

  const timelineEvents = extractKeyEvents(events, notesData.data, memosData);
  const sortedEvents = timelineEvents.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-2'>
        <Calendar className='w-5 h-5 text-muted-foreground' />
        <h2 className='text-lg font-semibold'>Patient Timeline</h2>
      </div>

      <div className='relative pl-8'>
        {/* Vertical timeline line */}
        <div className='absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200' />

        <div className='space-y-8'>
          {sortedEvents.map((event) => (
            <div key={event.id} className='relative'>
              {/* Timeline dot */}
              <div className='absolute -left-8 w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center'>
                {event.icon}
              </div>

              {/* Event content */}
              <div className='bg-white rounded-lg border p-4'>
                <div className='flex items-center justify-between mb-2'>
                  <div className='flex items-center gap-2'>
                    <span className='font-medium'>{event.title}</span>
                    {event.status && <StatusBadge status={event.status} />}
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    {new Date(event.date).toLocaleString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </div>
                </div>

                <p className='text-sm text-muted-foreground mb-3'>{event.description}</p>

                {/* Metadata */}
                {event.metadata && (
                  <div className='flex flex-wrap gap-2'>
                    {Object.entries(event.metadata)
                      .filter(
                        ([, value]) => value !== false && value !== null && value !== undefined
                      )
                      .map(([key, value]) => (
                        <Badge key={key} variant='outline' className='text-xs'>
                          {key === 'providers' && Array.isArray(value) ? (
                            <div className='flex items-center gap-1'>
                              <METADATA_ICONS.providers className='w-3 h-3' />
                              {value.join(', ')}
                            </div>
                          ) : key === 'duration' ? (
                            <div className='flex items-center gap-1'>
                              <METADATA_ICONS.duration className='w-3 h-3' />
                              {value}
                            </div>
                          ) : key === 'aiGenerated' && value === true ? (
                            <AIGeneratedBadge />
                          ) : key === 'creator' ? (
                            <div className='flex items-center gap-1'>
                              <METADATA_ICONS.creator className='w-3 h-3' />
                              {value}
                            </div>
                          ) : key === 'location' ? (
                            <div className='flex items-center gap-1'>
                              <METADATA_ICONS.location className='w-3 h-3' />
                              {value}
                            </div>
                          ) : key === 'appointmentType' ? (
                            <div className='flex items-center gap-1'>
                              <METADATA_ICONS.appointmentType className='w-3 h-3' />
                              {typeof value === 'string' ? value.replace('_', ' ') : value}
                            </div>
                          ) : (
                            `${key}: ${value}`
                          )}
                        </Badge>
                      ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

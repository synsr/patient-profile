import { usePatientNotes } from '@/lib/api/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Plus, Edit, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function ClinicalNotesTab({ id }: { id: string }) {
  const { data, isLoading, error } = usePatientNotes(id);
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

  if (isLoading) return <Skeleton className='h-96 w-full' />;
  if (error || !data) return <div>Error loading clinical notes</div>;

  const toggleNote = (noteId: string) => {
    const newExpanded = new Set(expandedNotes);
    if (newExpanded.has(noteId)) {
      newExpanded.delete(noteId);
    } else {
      newExpanded.add(noteId);
    }
    setExpandedNotes(newExpanded);
  };

  const sortedNotes = [...data.data].sort(
    (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
  );

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-semibold'>Clinical Notes</h2>
        <Button>
          <Plus className='w-4 h-4 mr-2' />
          New Note
        </Button>
      </div>

      <div className='space-y-4'>
        {sortedNotes.map((note, index) => {
          const isLatest = index === 0;
          const isExpanded = expandedNotes.has(note.id);

          return (
            <Card
              key={note.id}
              className={cn(
                'transition-all duration-200',
                isLatest && 'border-primary/50 shadow-md'
              )}>
              <CardContent className='pt-6'>
                <div className='space-y-4'>
                  {/* Header Section */}
                  <div className='flex justify-between items-start'>
                    <div className='space-y-1'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm text-gray-500'>
                          {new Date(note.createdDate).toLocaleDateString()} by{' '}
                          {note.providerNames.join(', ')}
                        </span>
                        {isLatest && (
                          <Badge variant='default' className='ml-2'>
                            Latest
                          </Badge>
                        )}
                        {note.aiGenerated && (
                          <Badge variant='secondary'>
                            <Sparkles className='w-3 h-3 mr-1' />
                            AI-generated
                          </Badge>
                        )}
                        {note.version > 1 && <Badge variant='outline'>v{note.version}</Badge>}
                      </div>
                      <div className='text-sm text-gray-500'>
                        Duration: {note.duration ? `${note.duration / 60} min` : 'N/A'}
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      {!isLatest && (
                        <Button variant='ghost' size='sm' onClick={() => toggleNote(note.id)}>
                          {isExpanded ? (
                            <ChevronUp className='w-4 h-4' />
                          ) : (
                            <ChevronDown className='w-4 h-4' />
                          )}
                        </Button>
                      )}
                      <Button variant='ghost' size='sm'>
                        <Edit className='w-4 h-4' />
                      </Button>
                    </div>
                  </div>

                  {/* Summary Section - Always visible */}
                  <div className='space-y-2'>
                    <h3 className='font-medium'>Summary</h3>
                    <p className='text-gray-700'>{note.summary}</p>
                  </div>

                  {/* Full Note Section - Collapsible for older notes */}
                  {(isLatest || isExpanded) && (
                    <div className='space-y-2'>
                      <h3 className='font-medium'>Full Note</h3>
                      <p className='text-gray-700 whitespace-pre-wrap'>{note.content}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

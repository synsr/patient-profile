import { usePatientNotes } from '@/lib/api/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export function ClinicalNotesTab({ id }: { id: string }) {
  const { data, isLoading, error } = usePatientNotes(id);

  if (isLoading) return <Skeleton className='h-96 w-full' />;
  if (error || !data) return <div>Error loading clinical notes</div>;

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-semibold'>Clinical Notes</h2>
      <div className='space-y-4'>
        {data.data.map((note) => (
          <Card key={note.id}>
            <CardContent className='pt-6'>
              <div className='space-y-4'>
                <div className='flex justify-between items-start'>
                  <div>
                    <div className='text-sm text-gray-500'>
                      {new Date(note.createdDate).toLocaleDateString()} by{' '}
                      {note.providerNames.join(', ')}
                    </div>
                    {note.aiGenerated && (
                      <Badge variant='secondary' className='mt-1'>
                        AI-generated summary
                      </Badge>
                    )}
                  </div>
                  <div className='text-sm text-gray-500'>
                    Duration: {note.duration ? `${note.duration / 60} min` : 'N/A'}
                  </div>
                </div>
                <div className='space-y-2'>
                  <h3 className='font-medium'>Summary</h3>
                  <p className='text-gray-700'>{note.summary}</p>
                </div>
                <div className='space-y-2'>
                  <h3 className='font-medium'>Full Note</h3>
                  <p className='text-gray-700 whitespace-pre-wrap'>{note.content}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

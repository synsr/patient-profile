import { usePatientMemos } from '@/lib/api/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, Plus, ChevronDown, ChevronUp, Pencil } from 'lucide-react';
import { useState } from 'react';

const INITIAL_DISPLAY_COUNT = 3;

export function MemosTab({ id }: { id: string }) {
  const { data: memos, isLoading } = usePatientMemos(id);
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) return <Skeleton className='h-96 w-full' />;
  if (!memos) return null;

  const sortedMemos = [...memos].sort(
    (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
  );
  const displayedMemos = isExpanded ? sortedMemos : sortedMemos.slice(0, INITIAL_DISPLAY_COUNT);

  const handleAddMemo = () => {
    // TODO: Implement add memo functionality
    // This should open a modal or form to add a new memo
    console.log('Add memo clicked');
  };

  const handleEditMemo = (memoId: string) => {
    // TODO: Implement edit memo functionality
    // This should open a modal or form to edit the selected memo
    console.log('Edit memo clicked', memoId);
  };

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <MessageSquare className='w-5 h-5 text-muted-foreground' />
          <h2 className='text-lg font-semibold'>Memos & Communication History</h2>
        </div>
        <Button onClick={handleAddMemo} size='sm'>
          <Plus className='w-4 h-4 mr-2' />
          Add New Memo
        </Button>
      </div>

      <Card>
        <CardContent className='p-6'>
          <div className='space-y-4'>
            {displayedMemos.map((memo) => (
              <div
                key={memo.id}
                className='flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors'>
                <div className='space-y-2 flex-1'>
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <span>
                      {memo.creator.firstName} {memo.creator.lastName}
                    </span>
                    <span>•</span>
                    <span>{new Date(memo.createdDate).toLocaleDateString()}</span>
                    {memo.updatedDate !== memo.createdDate && (
                      <>
                        <span>•</span>
                        <span className='italic'>edited</span>
                      </>
                    )}
                  </div>
                  <p className='text-sm'>{memo.note}</p>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => handleEditMemo(memo.id)}
                  className='ml-4'>
                  <Pencil className='w-4 h-4' />
                </Button>
              </div>
            ))}

            {memos.length > INITIAL_DISPLAY_COUNT && (
              <Button variant='ghost' className='w-full' onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? (
                  <>
                    <ChevronUp className='w-4 h-4 mr-2' />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className='w-4 h-4 mr-2' />
                    View All ({memos.length} memos)
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

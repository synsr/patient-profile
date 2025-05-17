import { DoctorsNote } from '@/lib/types';

interface NotesListProps {
  notes: DoctorsNote[];
}

export function NotesList({ notes }: NotesListProps) {
  if (!notes.length) {
    return <p className='text-gray-500'>No notes found</p>;
  }

  return (
    <div className='space-y-4'>
      {notes.map((note) => (
        <div key={note.id} className='bg-white rounded-lg shadow p-4'>
          <div className='flex justify-between items-start'>
            <div>
              <h3 className='font-medium'>{note.providerNames.join(', ')}</h3>
              <p className='text-sm text-gray-600 mt-1'>{note.content}</p>
            </div>
            <span className='text-sm text-gray-500'>
              {new Date(note.createdDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

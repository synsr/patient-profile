import { PatientProfile } from '@/components/PatientProfile';

interface PatientPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PatientPage({ params }: PatientPageProps) {
  const { id } = await params;

  return (
    <main className='min-h-screen bg-gray-50'>
      <div className='container mx-auto py-8'>
        <PatientProfile id={id} />
      </div>
    </main>
  );
}

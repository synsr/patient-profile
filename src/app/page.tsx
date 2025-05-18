import Link from 'next/link';
import { getPatientData } from '@/lib/api/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function HomePage() {
  // In a real app, this would fetch multiple patients
  const patient = await getPatientData('pt_5f8a92a3eb28c15dc7a9a3d1');

  return (
    <main className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold text-gray-900 mb-8'>Patients</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <Link href={`/patients/${patient.id}`}>
          <Card className='hover:shadow-lg transition-shadow duration-200'>
            <CardContent>
              <div className='space-y-2'>
                <h2 className='text-xl font-semibold text-gray-900'>
                  {patient.firstName} {patient.lastName}
                </h2>
                <p className='text-gray-600'>{patient.email}</p>
                <p className='text-gray-600'>{patient.phoneNumber}</p>
                <div className='pt-2 flex gap-2'>
                  <Badge variant='secondary'>{patient.gender}</Badge>
                  <Badge variant='outline'>{patient.employmentStatus}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </main>
  );
}

import { PatientPageClient } from '@/components/PatientPageClient';

interface PatientPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PatientPage({ params }: PatientPageProps) {
  const { id } = await params;
  return <PatientPageClient id={id} />;
}

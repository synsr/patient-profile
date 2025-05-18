import { PatientPageClient } from '@/components/PatientPageClient';

interface PatientPageProps {
  params: { id: string };
}

export default async function PatientPage({ params }: PatientPageProps) {
  const { id } = await params;
  return <PatientPageClient id={id} />;
}

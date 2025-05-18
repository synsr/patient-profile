import { PatientPageClient } from '@/components/PatientPageClient';

interface PatientPageProps {
  params: { id: string };
}

export default function PatientPage({ params }: PatientPageProps) {
  return <PatientPageClient id={params.id} />;
}

import { Patient } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Pencil, Mail, Phone, MapPin, Briefcase, User, Calendar } from 'lucide-react';

interface PatientHeaderProps {
  patient: Patient;
}

export function PatientHeader({ patient }: PatientHeaderProps) {
  // Calculate age
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(patient.dateOfBirth);

  return (
    <div className='bg-white rounded-lg shadow'>
      {/* Main Header Section */}
      <div className='p-6 border-b border-gray-100'>
        <div className='flex items-start justify-between'>
          <div className='flex items-center gap-4'>
            <div className='h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center'>
              <span className='text-2xl text-blue-600'>
                {patient.firstName[0]}
                {patient.lastName[0]}
              </span>
            </div>
            <div>
              <h1 className='text-2xl font-bold'>
                {patient.firstName} {patient.lastName}
              </h1>
              <div className='flex items-center gap-3 text-gray-600 mt-1'>
                <div className='flex items-center gap-1'>
                  <Calendar className='w-4 h-4' />
                  <span>{age} years</span>
                </div>
                <span>•</span>
                <div className='flex items-center gap-1'>
                  <User className='w-4 h-4' />
                  <span>{patient.gender}</span>
                </div>
                <span>•</span>
                <span>{patient.maritalStatus}</span>
              </div>
            </div>
          </div>
          <Button variant='outline' size='sm'>
            <Pencil className='w-4 h-4 mr-2' />
            Edit Patient Info
          </Button>
        </div>
      </div>

      {/* Contact Information */}
      <div className='p-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='space-y-2'>
            <div className='flex items-center gap-2 text-gray-600'>
              <Mail className='w-4 h-4 text-gray-400' />
              <span>{patient.email}</span>
            </div>
            <div className='flex items-center gap-2 text-gray-600'>
              <Phone className='w-4 h-4 text-gray-400' />
              <span>{patient.phoneNumber}</span>
            </div>
          </div>

          <div className='space-y-2'>
            <div className='flex items-start gap-2 text-gray-600'>
              <MapPin className='w-4 h-4 text-gray-400 mt-1' />
              <div>
                <p>{patient.address}</p>
                {patient.addressLineTwo && <p>{patient.addressLineTwo}</p>}
                <p>
                  {patient.city}, {patient.state} {patient.zipCode}
                </p>
              </div>
            </div>
          </div>

          <div className='space-y-2'>
            <div className='flex items-center gap-2 text-gray-600'>
              <Briefcase className='w-4 h-4 text-gray-400' />
              <span>{patient.employmentStatus}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

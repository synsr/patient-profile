import { Patient } from '@/lib/types';

interface PatientHeaderProps {
  patient: Patient;
}

export function PatientHeader({ patient }: PatientHeaderProps) {
  return (
    <div className='bg-white rounded-lg shadow p-6'>
      <div className='flex items-center space-x-4'>
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
          <p className='text-gray-600'>
            {patient.dateOfBirth} • {patient.gender}
          </p>
        </div>
      </div>

      <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <h3 className='text-sm font-medium text-gray-500'>Contact Information</h3>
          <p className='mt-1'>{patient.email}</p>
          <p className='mt-1'>{patient.phoneNumber}</p>
        </div>
        <div>
          <h3 className='text-sm font-medium text-gray-500'>Address</h3>
          <p className='mt-1'>
            {patient.address}
            {patient.addressLineTwo && <br />}
            {patient.addressLineTwo}
            <br />
            {patient.city}, {patient.state} {patient.zipCode}
          </p>
        </div>
      </div>
    </div>
  );
}

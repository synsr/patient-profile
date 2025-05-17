export function PatientSkeleton() {
  return (
    <div className='max-w-4xl mx-auto p-6 animate-pulse'>
      {/* Header skeleton */}
      <div className='flex items-center space-x-4 mb-6'>
        <div className='h-16 w-16 bg-gray-200 rounded-full'></div>
        <div className='flex-1'>
          <div className='h-4 bg-gray-200 rounded w-1/4 mb-2'></div>
          <div className='h-4 bg-gray-200 rounded w-1/2'></div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Events skeleton */}
        <div>
          <div className='h-6 bg-gray-200 rounded w-1/3 mb-4'></div>
          <div className='space-y-3'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='h-20 bg-gray-200 rounded'></div>
            ))}
          </div>
        </div>

        {/* Notes skeleton */}
        <div>
          <div className='h-6 bg-gray-200 rounded w-1/3 mb-4'></div>
          <div className='space-y-3'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='h-20 bg-gray-200 rounded'></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

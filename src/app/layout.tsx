import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { QueryProvider } from '@/lib/providers/QueryProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Patient Profile System',
  description: 'A modern patient profile management system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <QueryProvider>
          <nav className='bg-white shadow-sm'>
            <div className='container mx-auto px-4 py-4'>
              <h1 className='text-xl font-semibold text-gray-900'>Patient Profile</h1>
            </div>
          </nav>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}

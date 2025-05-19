'use client';

import { useState } from 'react';
import { SidePanel } from '@/components/SidePanel';
import { OverviewTab } from './tabs/OverviewTab';
import { ClinicalNotesTab } from '@/components/tabs/ClinicalNotesTab';
import { AppointmentsTab } from '@/components/tabs/AppointmentsTab';
import { BillingTab } from '@/components/tabs/BillingTab';
import { MemosTab } from '@/components/tabs/MemosTab';
import { TimelineTab } from '@/components/tabs/TimelineTab';
import { NotificationsTab } from '@/components/tabs/NotificationsTab';

export function PatientPageClient({ id }: { id: string }) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <main className='min-h-screen bg-gray-50'>
      <div className='flex max-w-7xl mx-auto py-8'>
        <SidePanel activeTab={activeTab} onTabChange={setActiveTab} />
        <div className='flex-1 pl-8'>
          {activeTab === 'overview' && <OverviewTab id={id} />}
          {activeTab === 'clinical-notes' && <ClinicalNotesTab id={id} />}
          {activeTab === 'appointments' && <AppointmentsTab id={id} />}
          {activeTab === 'billing' && <BillingTab id={id} />}
          {activeTab === 'memos' && <MemosTab id={id} />}
          {activeTab === 'timeline' && <TimelineTab id={id} />}
          {activeTab === 'notifications' && <NotificationsTab id={id} />}
        </div>
      </div>
    </main>
  );
}

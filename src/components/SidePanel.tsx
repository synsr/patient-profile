import React from 'react';
import { Button } from './ui/button';

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'clinical-notes', label: 'Clinical Notes' },
  { key: 'appointments', label: 'Appointments' },
  { key: 'billing', label: 'Billing' },
  { key: 'memos', label: 'Memos' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'notifications', label: 'Notifications' },
];

interface SidePanelProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function SidePanel({ activeTab, onTabChange }: SidePanelProps) {
  return (
    <nav
      className='sticky top-8 bg-white border border-gray-200 rounded-lg shadow-sm'
      aria-label='Sidebar'>
      <div className='p-4'>
        <ul className='space-y-1'>
          {TABS.map((tab) => (
            <li key={tab.key}>
              <Button
                variant={activeTab === tab.key ? 'secondary' : 'ghost'}
                className='w-full justify-start px-4 py-2 font-medium text-base'
                onClick={() => onTabChange(tab.key)}
                aria-current={activeTab === tab.key ? 'page' : undefined}>
                {tab.label}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

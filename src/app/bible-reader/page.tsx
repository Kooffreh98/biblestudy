import React from 'react';
import AppLayout from '@/components/AppLayout';
import BibleReaderClient from './components/BibleReaderClient';
import OfflineCacheManager from '@/components/OfflineCacheManager';

export default function BibleReaderPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <OfflineCacheManager />
        <BibleReaderClient />
      </div>
    </AppLayout>
  );
}
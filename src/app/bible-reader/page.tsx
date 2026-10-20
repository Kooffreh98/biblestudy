import React, {Suspense} from 'react';
import AppLayout from '@/components/AppLayout';
import BibleReaderClient from './components/BibleReaderClient';
import OfflineCacheManager from '@/components/OfflineCacheManager';

export default function BibleReaderPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <OfflineCacheManager />
        <Suspense fallback={<div className="h-[calc(100vh-8rem)] rounded-xl border border-border bg-card animate-pulse" />}>
          <BibleReaderClient />
        </Suspense>
      </div>
    </AppLayout>
  );
}
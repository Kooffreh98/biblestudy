import React from 'react';
import TopNav from '@/components/TopNav';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNav />
      <main className="flex-1 w-full max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-12 2xl:px-16 py-6">
        {children}
      </main>
      <footer className="border-t border-border bg-card mt-auto">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            BibleStudy — Open Scripture Research Tool · KJV · NIV · Hebrew · Greek
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            No account required · Public domain texts
          </p>
        </div>
      </footer>
    </div>
  );
}
import React from 'react';
import AppLayout from '@/components/AppLayout';
import HeroVerseCard from './components/HeroVerseCard';
import FeatureEntryCards from './components/FeatureEntryCards';
import BibleBookGrid from './components/BibleBookGrid';

export default function HomePage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <HeroVerseCard />
        <FeatureEntryCards />
        <BibleBookGrid />
      </div>
    </AppLayout>
  );
}
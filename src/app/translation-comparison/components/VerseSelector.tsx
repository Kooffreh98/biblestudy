'use client';
import React, { useState } from 'react';

import { type Verse } from '@/lib/bibleData';

interface VerseSelectorProps {
  selectedVerseId: string;
  onSelect: (id: string) => void;
  featuredVerseIds: string[];
  verses: Verse[];
}

export default function VerseSelector({ selectedVerseId, onSelect, featuredVerseIds, verses }: VerseSelectorProps) {
  const [open, setOpen] = useState(false);
  const featuredVerses = featuredVerseIds.map((id) => verses.find((v) => v.id === id)).filter(Boolean) as Verse[];
  const selectedVerse = verses.find((v) => v.id === selectedVerseId);

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0">Featured verses:</span>
        {featuredVerses.map((v) => (
          <button
            key={`vs-btn-${v.id}`}
            onClick={() => onSelect(v.id)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 ${
              selectedVerseId === v.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            {v.book} {v.chapter}:{v.verse}
          </button>
        ))}
      </div>
    </div>
  );
}
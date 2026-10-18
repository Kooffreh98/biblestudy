'use client';
import React from 'react';
import { ChevronLeft, ChevronRight, PanelLeft, PanelRight } from 'lucide-react';
import { type TranslationKey } from '@/lib/bibleData';
import { type BibleBook } from '@/lib/bibleData';

const TRANSLATIONS: { key: TranslationKey; label: string; flag: string }[] = [
  { key: 'KJV', label: 'King James Version', flag: '🇬🇧' },
  { key: 'NIV', label: 'New International Version', flag: '🌐' },
  { key: 'GNV', label: 'Good News Version', flag: '📖' },
  { key: 'RSV', label: 'Revised Standard Version', flag: '📜' },
  { key: 'Hebrew', label: 'Ancient Hebrew', flag: '🔤' },
  { key: 'Greek', label: 'Ancient Greek', flag: 'Α' },
];

interface ReaderHeaderProps {
  book: BibleBook;
  chapter: number;
  totalChapters: number;
  translation: TranslationKey;
  onTranslationChange: (t: TranslationKey) => void;
  onPrev: () => void;
  onNext: () => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  crossRefOpen: boolean;
  onToggleCrossRef: () => void;
}

export default function ReaderHeader({
  book,
  chapter,
  totalChapters,
  translation,
  onTranslationChange,
  onPrev,
  onNext,
  sidebarOpen,
  onToggleSidebar,
  crossRefOpen,
  onToggleCrossRef,
}: ReaderHeaderProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background/80 backdrop-blur-sm shrink-0">
      <button
        onClick={onToggleSidebar}
        className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        title={sidebarOpen ? 'Hide book list' : 'Show book list'}
      >
        <PanelLeft size={16} />
      </button>

      <div className="flex items-center gap-2 flex-1 min-w-0">
        <button onClick={onPrev} className="p-1 rounded text-muted-foreground hover:text-primary hover:bg-muted transition-colors">
          <ChevronLeft size={16} />
        </button>
        <h1 className="text-base font-semibold text-foreground truncate">
          {book?.name} <span className="text-muted-foreground font-normal">Chapter {chapter}</span>
        </h1>
        <button onClick={onNext} className="p-1 rounded text-muted-foreground hover:text-primary hover:bg-muted transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Translation selector */}
      <select
        value={translation}
        onChange={(e) => onTranslationChange(e.target.value as TranslationKey)}
        className="text-xs font-semibold bg-muted border border-border rounded-md px-2 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
      >
        {TRANSLATIONS.map((t) => (
          <option key={`trans-opt-${t.key}`} value={t.key}>
            {t.flag} {t.key}
          </option>
        ))}
      </select>

      <button
        onClick={onToggleCrossRef}
        className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        title={crossRefOpen ? 'Hide cross-references' : 'Show cross-references'}
      >
        <PanelRight size={16} />
      </button>
    </div>
  );
}
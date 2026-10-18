import React from 'react';
import { X } from 'lucide-react';
import { type TranslationKey } from '@/lib/bibleData';

interface SearchFiltersProps {
  selectedTranslation: TranslationKey | 'All';
  selectedTestament: 'All' | 'OT' | 'NT';
  onTranslationChange: (v: TranslationKey | 'All') => void;
  onTestamentChange: (v: 'All' | 'OT' | 'NT') => void;
  onClose: () => void;
}

const TRANSLATIONS: (TranslationKey | 'All')[] = ['All', 'KJV', 'NIV', 'GNV', 'RSV', 'Hebrew', 'Greek'];

export default function SearchFilters({ selectedTranslation, selectedTestament, onTranslationChange, onTestamentChange, onClose }: SearchFiltersProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Filter Results</h3>
        <button onClick={onClose} className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <X size={15} />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Translation
          </label>
          <div className="flex flex-wrap gap-2">
            {TRANSLATIONS.map((t) => (
              <button
                key={`filter-trans-${t}`}
                onClick={() => onTranslationChange(t)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 ${
                  selectedTranslation === t
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Testament
          </label>
          <div className="flex gap-2">
            {(['All', 'OT', 'NT'] as const).map((t) => (
              <button
                key={`filter-testament-${t}`}
                onClick={() => onTestamentChange(t)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 ${
                  selectedTestament === t
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                {t === 'All' ? 'All' : t === 'OT' ? 'Old Testament' : 'New Testament'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
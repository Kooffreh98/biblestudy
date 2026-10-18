'use client';
import React, { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { type TranslationKey } from '@/lib/bibleData';

interface DiffItem {
  kjvWord: string;
  nivWord: string;
  note: string;
}

interface TranslationCardProps {
  translation: TranslationKey;
  text: string;
  verseRef: string;
  note: string;
  diffs: DiffItem[];
  highlightSide: 'kjv' | 'niv' | null;
}

const TRANSLATION_META: Record<TranslationKey, { label: string; subtitle: string; colorClass: string; headerClass: string; year: string }> = {
  KJV: {
    label: 'King James Version',
    subtitle: 'Formal equivalence · 1611 AD',
    colorClass: 'border-blue-200',
    headerClass: 'bg-blue-50 border-blue-200',
    year: '1611',
  },
  NIV: {
    label: 'New International Version',
    subtitle: 'Dynamic equivalence · 2011 AD',
    colorClass: 'border-emerald-200',
    headerClass: 'bg-emerald-50 border-emerald-200',
    year: '2011',
  },
  GNV: {
    label: 'Good News Version',
    subtitle: 'Common language · 1976 AD',
    colorClass: 'border-amber-200',
    headerClass: 'bg-amber-50 border-amber-200',
    year: '1976',
  },
  RSV: {
    label: 'Revised Standard Version',
    subtitle: 'Formal equivalence · 1952 AD',
    colorClass: 'border-teal-200',
    headerClass: 'bg-teal-50 border-teal-200',
    year: '1952',
  },
  Hebrew: {
    label: 'Ancient Hebrew',
    subtitle: 'Masoretic Text / Delitzsch NT',
    colorClass: 'border-rose-200',
    headerClass: 'bg-rose-50 border-rose-200',
    year: '~500 BC',
  },
  Greek: {
    label: 'Ancient Greek',
    subtitle: 'LXX / Nestle-Aland 28',
    colorClass: 'border-violet-200',
    headerClass: 'bg-violet-50 border-violet-200',
    year: '~250 BC',
  },
};

function renderTextWithDiffs(text: string, diffs: DiffItem[], side: 'kjv' | 'niv'): React.ReactNode {
  if (!diffs.length) return text;
  let result = text;
  const parts: React.ReactNode[] = [];
  let remaining = text;

  for (const diff of diffs) {
    const word = side === 'kjv' ? diff.kjvWord : diff.nivWord;
    const idx = remaining.indexOf(word);
    if (idx === -1) continue;
    parts.push(remaining.slice(0, idx));
    parts.push(
      <span key={`diff-${word}`} className="diff-highlight">
        {word}
      </span>
    );
    remaining = remaining.slice(idx + word.length);
  }
  parts.push(remaining);
  return parts;
}

export default function TranslationCard({ translation, text, verseRef, note, diffs, highlightSide }: TranslationCardProps) {
  const [copied, setCopied] = useState(false);
  const [noteExpanded, setNoteExpanded] = useState(false);
  const meta = TRANSLATION_META[translation];
  const isRTL = translation === 'Hebrew';
  const isGreek = translation === 'Greek';

  const handleCopy = () => {
    navigator.clipboard.writeText(`"${text}" — ${verseRef} (${translation})`).then(() => {
      setCopied(true);
      toast.success(`Copied ${verseRef} in ${translation}`);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const displayText = highlightSide && diffs.length
    ? renderTextWithDiffs(text, diffs, highlightSide)
    : text;

  return (
    <div className={`bg-card border ${meta.colorClass} rounded-xl overflow-hidden flex flex-col shadow-sm`}>
      {/* Header */}
      <div className={`px-4 py-3 border-b ${meta.headerClass} flex items-center justify-between`}>
        <div>
          <p className="text-xs font-bold text-foreground">{meta.label}</p>
          <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{meta.subtitle}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-muted-foreground bg-white/70 px-1.5 py-0.5 rounded border border-border">
            {meta.year}
          </span>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-white/70 transition-colors"
            title="Copy verse"
          >
            {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
          </button>
        </div>
      </div>

      {/* Verse text */}
      <div className={`flex-1 px-4 py-4 ${isRTL ? 'text-right' : ''}`}>
        <p className={`leading-relaxed text-foreground ${
          isRTL ? 'hebrew-text text-lg' : isGreek ? 'greek-text' : 'verse-text'
        }`}>
          {displayText}
        </p>
        <p className="text-xs text-muted-foreground font-mono mt-3">{verseRef}</p>
      </div>

      {/* Translator note */}
      <div className="border-t border-border px-4 py-3 bg-muted/30">
        <button
          onClick={() => setNoteExpanded((v) => !v)}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
            Translator Note
          </span>
          <ExternalLink size={11} className={`text-muted-foreground transition-transform ${noteExpanded ? 'rotate-90' : ''}`} />
        </button>
        {noteExpanded && (
          <p className="text-xs text-muted-foreground leading-relaxed mt-2 fade-in">
            {note}
          </p>
        )}
      </div>
    </div>
  );
}
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Copy, GitCompare, BookOpen, Check } from 'lucide-react';
import { toast } from 'sonner';
import { type TranslationKey } from '@/lib/bibleData';

interface SearchResult {
  id: string;
  book: string;
  bookId: string;
  chapter: number;
  verse: number;
  translation: TranslationKey;
  text: string;
  relevance: number;
  theme: string;
}

const TRANSLATION_COLORS: Record<TranslationKey, string> = {
  KJV: 'bg-blue-100 text-blue-700',
  NIV: 'bg-emerald-100 text-emerald-700',
  Hebrew: 'bg-rose-100 text-rose-700',
  Greek: 'bg-violet-100 text-violet-700',
};

function highlightQuery(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={`hl-${i}`} className="result-highlight not-italic font-medium text-foreground bg-transparent">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function SearchResultCard({ result, query }: { result: SearchResult; query: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`"${result.text}" — ${result.book} ${result.chapter}:${result.verse} (${result.translation})`).then(() => {
      setCopied(true);
      toast.success(`Copied ${result.book} ${result.chapter}:${result.verse}`);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="group bg-card border border-border rounded-xl p-4 hover:border-primary/30 hover:shadow-sm transition-all duration-150 fade-in">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-2">
            <span className="text-sm font-semibold text-primary font-mono">
              {result.book} {result.chapter}:{result.verse}
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded strongs-badge ${TRANSLATION_COLORS[result.translation]}`}>
              {result.translation}
            </span>
            <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
              {result.theme}
            </span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            {highlightQuery(result.text, query)}
          </p>
        </div>

        {/* Relevance bar */}
        <div className="shrink-0 flex flex-col items-end gap-1">
          <span className="text-xs font-mono font-semibold text-accent">{result.relevance}%</span>
          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full gradient-accent"
              style={{ width: `${result.relevance}%` }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground">relevance</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <Link
          href={`/bible-reader?book=${result.bookId}&chapter=${result.chapter}`}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded hover:bg-muted"
        >
          <BookOpen size={11} />
          Read in context
        </Link>
        <Link
          href={`/translation-comparison?book=${result.bookId}&chapter=${result.chapter}&verse=${result.verse}`}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded hover:bg-muted"
        >
          <GitCompare size={11} />
          Compare translations
        </Link>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded hover:bg-muted ml-auto"
        >
          {copied ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
          {copied ? 'Copied' : 'Copy verse'}
        </button>
      </div>
    </div>
  );
}
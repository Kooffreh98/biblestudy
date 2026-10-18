import React from 'react';
import Link from 'next/link';
import { Hash } from 'lucide-react';

interface ConcordanceEntry {
  word: string;
  strongsH: string;
  strongsG: string;
  hebrewRoot: string;
  hebrewTranslit: string;
  greekRoot: string;
  greekTranslit: string;
  partOfSpeech: string;
  totalOccurrences: number;
  otOccurrences: number;
  ntOccurrences: number;
  definition: string;
  relatedWords: string[];
}

export default function ConcordanceWordPanel({ entry }: { entry: ConcordanceEntry }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="gradient-primary px-4 py-4">
        <h2 className="text-2xl font-bold text-primary-foreground capitalize">{entry.word}</h2>
        <p className="text-xs text-primary-foreground/70 mt-0.5">{entry.partOfSpeech}</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Occurrence stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center bg-muted rounded-lg py-2">
            <p className="text-lg font-bold text-foreground font-mono">{entry.totalOccurrences}</p>
            <p className="text-[10px] text-muted-foreground font-medium">Total</p>
          </div>
          <div className="text-center bg-blue-50 rounded-lg py-2">
            <p className="text-lg font-bold text-blue-700 font-mono">{entry.otOccurrences}</p>
            <p className="text-[10px] text-blue-600 font-medium">OT</p>
          </div>
          <div className="text-center bg-amber-50 rounded-lg py-2">
            <p className="text-lg font-bold text-amber-700 font-mono">{entry.ntOccurrences}</p>
            <p className="text-[10px] text-amber-600 font-medium">NT</p>
          </div>
        </div>

        {/* Strong's numbers */}
        <div className="space-y-2">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Strong&apos;s Numbers</p>
          <div className="flex gap-2">
            <span className="strongs-badge bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md flex items-center gap-1">
              <Hash size={10} />
              {entry.strongsH}
            </span>
            <span className="strongs-badge bg-violet-50 text-violet-700 px-2.5 py-1 rounded-md flex items-center gap-1">
              <Hash size={10} />
              {entry.strongsG}
            </span>
          </div>
        </div>

        {/* Hebrew root */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Hebrew Root</p>
          <div className="flex items-center justify-between bg-rose-50 rounded-lg px-3 py-2">
            <span className="text-xl text-rose-800 font-medium hebrew-text">{entry.hebrewRoot}</span>
            <span className="text-xs text-rose-600 font-mono italic">{entry.hebrewTranslit}</span>
          </div>
        </div>

        {/* Greek root */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Greek Root</p>
          <div className="flex items-center justify-between bg-violet-50 rounded-lg px-3 py-2">
            <span className="text-xl text-violet-800 font-medium greek-text">{entry.greekRoot}</span>
            <span className="text-xs text-violet-600 font-mono italic">{entry.greekTranslit}</span>
          </div>
        </div>

        {/* Definition */}
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Definition</p>
          <p className="text-xs text-foreground leading-relaxed">{entry.definition}</p>
        </div>

        {/* Related words */}
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Related Words</p>
          <div className="flex flex-wrap gap-1.5">
            {entry.relatedWords.map((w) => (
              <Link
                key={`related-${w}`}
                href={`/concordance?word=${w}`}
                className="text-xs text-primary bg-primary/5 hover:bg-primary/10 px-2 py-0.5 rounded transition-colors"
              >
                {w}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
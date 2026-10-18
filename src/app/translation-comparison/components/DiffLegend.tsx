import React from 'react';
import { Info } from 'lucide-react';

interface DiffItem {
  kjvWord: string;
  nivWord: string;
  note: string;
}

export default function DiffLegend({ diffs }: { diffs: DiffItem[] }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 fade-in">
      <div className="flex items-center gap-2 mb-3">
        <Info size={14} className="text-amber-700" />
        <h3 className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
          KJV vs NIV — Translation Differences ({diffs.length} in this verse)
        </h3>
      </div>
      <div className="space-y-2">
        {diffs.map((diff, i) => (
          <div key={`diff-item-${i}`} className="flex flex-col sm:flex-row sm:items-start gap-2 text-xs">
            <div className="flex items-center gap-2 shrink-0">
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">{diff.kjvWord}</span>
              <span className="text-muted-foreground">→</span>
              <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-medium">{diff.nivWord}</span>
            </div>
            <p className="text-amber-700 leading-relaxed">{diff.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
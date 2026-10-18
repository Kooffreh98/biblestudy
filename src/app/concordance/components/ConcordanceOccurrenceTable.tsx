'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, GitCompare, ChevronUp, ChevronDown } from 'lucide-react';

interface Occurrence {
  id: string;
  book: string;
  bookId: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
}

function highlightWord(text: string, word: string): React.ReactNode {
  if (!word) return text;
  const regex = new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={`occ-hl-${i}`} className="result-highlight not-italic font-semibold text-accent bg-transparent">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function ConcordanceOccurrenceTable({ occurrences, word }: { occurrences: Occurrence[]; word: string }) {
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<'book' | 'chapter' | 'verse'>('book');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const perPage = 8;

  const sorted = [...occurrences].sort((a, b) => {
    let cmp = 0;
    if (sortField === 'book') cmp = a.book.localeCompare(b.book);
    else if (sortField === 'chapter') cmp = a.chapter - b.chapter;
    else cmp = a.verse - b.verse;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const totalPages = Math.ceil(sorted.length / perPage);
  const pageItems = sorted.slice((page - 1) * perPage, page * perPage);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('asc'); }
  };

  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field) return <ChevronUp size={11} className="text-muted-foreground/40" />;
    return sortDir === 'asc'
      ? <ChevronUp size={11} className="text-primary" />
      : <ChevronDown size={11} className="text-primary" />;
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">
          All Occurrences
          <span className="ml-2 text-xs font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">
            {occurrences.length} verses
          </span>
        </h3>
        <p className="text-xs text-muted-foreground">
          Page {page} of {totalPages}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-2.5 text-left">
                <button
                  onClick={() => toggleSort('book')}
                  className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                >
                  Book <SortIcon field="book" />
                </button>
              </th>
              <th className="px-3 py-2.5 text-left">
                <button
                  onClick={() => toggleSort('chapter')}
                  className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                >
                  Ch <SortIcon field="chapter" />
                </button>
              </th>
              <th className="px-3 py-2.5 text-left">
                <button
                  onClick={() => toggleSort('verse')}
                  className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                >
                  Vs <SortIcon field="verse" />
                </button>
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Verse Text
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Trans.
              </th>
              <th className="px-3 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((occ, idx) => (
              <tr
                key={occ.id}
                className={`border-b border-border last:border-0 hover:bg-muted/40 transition-colors ${
                  idx % 2 === 0 ? '' : 'bg-muted/20'
                }`}
              >
                <td className="px-4 py-2.5">
                  <span className="text-xs font-semibold text-foreground">{occ.book}</span>
                </td>
                <td className="px-3 py-2.5">
                  <span className="text-xs font-mono text-muted-foreground">{occ.chapter}</span>
                </td>
                <td className="px-3 py-2.5">
                  <span className="text-xs font-mono text-muted-foreground">{occ.verse}</span>
                </td>
                <td className="px-4 py-2.5 max-w-md">
                  <p className="text-xs text-foreground leading-relaxed line-clamp-2">
                    {highlightWord(occ.text, word)}
                  </p>
                </td>
                <td className="px-3 py-2.5">
                  <span className="strongs-badge text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                    {occ.translation}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/bible-reader?book=${occ.bookId}&chapter=${occ.chapter}`}
                      className="p-1.5 rounded text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                      title="Read in context"
                    >
                      <BookOpen size={13} />
                    </Link>
                    <Link
                      href={`/translation-comparison?book=${occ.bookId}&chapter=${occ.chapter}&verse=${occ.verse}`}
                      className="p-1.5 rounded text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                      title="Compare translations"
                    >
                      <GitCompare size={13} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
        <p className="text-xs text-muted-foreground">
          Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, occurrences.length)} of {occurrences.length}
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-2.5 py-1 text-xs rounded border border-border text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={`pg-${p}`}
              onClick={() => setPage(p)}
              className={`w-7 h-7 text-xs rounded font-mono transition-colors ${
                page === p
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground border border-border'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-2.5 py-1 text-xs rounded border border-border text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
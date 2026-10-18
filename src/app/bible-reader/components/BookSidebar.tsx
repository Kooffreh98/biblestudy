'use client';
import React, { useState } from 'react';
import { BIBLE_BOOKS } from '@/lib/bibleData';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface BookSidebarProps {
  selectedBook: string;
  selectedChapter: number;
  onSelectBook: (id: string) => void;
  onSelectChapter: (ch: number) => void;
}

export default function BookSidebar({ selectedBook, selectedChapter, onSelectBook, onSelectChapter }: BookSidebarProps) {
  const [testament, setTestament] = useState<'OT' | 'NT'>('NT');
  const [expandedBook, setExpandedBook] = useState<string | null>('joh');

  const books = BIBLE_BOOKS.filter((b) => b.testament === testament);

  return (
    <div className="h-full flex flex-col bg-background/50">
      {/* Testament toggle */}
      <div className="flex gap-1 p-2 border-b border-border shrink-0">
        {(['OT', 'NT'] as const).map((t) => (
          <button
            key={`sidebar-tab-${t}`}
            onClick={() => setTestament(t)}
            className={`flex-1 py-1 text-xs font-semibold rounded transition-all duration-150 ${
              testament === t ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            {t === 'OT' ? 'OT' : 'NT'}
          </button>
        ))}
      </div>

      {/* Book list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin py-1">
        {books.map((book) => {
          const isSelected = book.id === selectedBook;
          const isExpanded = expandedBook === book.id;
          return (
            <div key={`sidebar-book-${book.id}`}>
              <button
                onClick={() => {
                  setExpandedBook(isExpanded ? null : book.id);
                  onSelectBook(book.id);
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-left text-xs transition-all duration-100 ${
                  isSelected
                    ? 'bg-primary/10 text-primary font-semibold' :'text-foreground hover:bg-muted font-medium'
                }`}
              >
                <span className="truncate">{book.name}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-muted-foreground text-[10px] font-mono">{book.chapters}</span>
                  {isExpanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                </div>
              </button>

              {/* Chapter list */}
              {isExpanded && (
                <div className="px-3 pb-2 grid grid-cols-5 gap-1">
                  {Array.from({ length: book.chapters }, (_, i) => i + 1).map((ch) => (
                    <button
                      key={`ch-${book.id}-${ch}`}
                      onClick={() => { onSelectBook(book.id); onSelectChapter(ch); }}
                      className={`py-0.5 text-[10px] rounded text-center font-mono transition-all duration-100 ${
                        isSelected && selectedChapter === ch
                          ? 'bg-primary text-primary-foreground font-semibold'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
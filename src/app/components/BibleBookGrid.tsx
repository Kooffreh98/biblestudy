'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { BIBLE_BOOKS, GENRE_COLORS } from '@/lib/bibleData';
import { BookOpen } from 'lucide-react';

const OT_GENRES = ['Law', 'History', 'Wisdom', 'Major Prophets', 'Minor Prophets'];
const NT_GENRES = ['Gospels', 'History', 'Epistles', 'Prophecy'];

export default function BibleBookGrid() {
  const [testament, setTestament] = useState<'OT' | 'NT'>('OT');
  const [activeGenre, setActiveGenre] = useState<string>('All');

  const books = useMemo(() => BIBLE_BOOKS.filter((b) => b.testament === testament), [testament]);
  const genres = testament === 'OT' ? OT_GENRES : NT_GENRES;
  const filtered = useMemo(
    () => (activeGenre === 'All' ? books : books.filter((b) => b.genre === activeGenre)),
    [books, activeGenre]
  );

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Browse the Bible</h2>
        <span className="text-xs text-muted-foreground font-mono">{filtered.length} books</span>
      </div>

      {/* Testament tabs */}
      <div className="flex gap-2 mb-4">
        {(['OT', 'NT'] as const).map((t) => (
          <button
            key={`testament-${t}`}
            onClick={() => { setTestament(t); setActiveGenre('All'); }}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 ${
              testament === t
                ? 'gradient-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            {t === 'OT' ? 'Old Testament' : 'New Testament'}
          </button>
        ))}
      </div>

      {/* Genre filter chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          key="genre-all"
          onClick={() => setActiveGenre('All')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 ${
            activeGenre === 'All' ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:bg-secondary'
          }`}
        >
          All Genres
        </button>
        {genres.map((g) => (
          <button
            key={`genre-${g}`}
            onClick={() => setActiveGenre(g)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 ${
              activeGenre === g
                ? 'bg-accent text-accent-foreground'
                : 'bg-muted text-muted-foreground hover:bg-secondary'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Book grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-2.5">
        {filtered.map((book) => (
          <Link
            key={`book-${book.id}`}
            href={`/bible-reader?book=${book.id}&chapter=1`}
            className="group flex flex-col gap-1.5 p-3 rounded-lg bg-card border border-border hover:border-primary/40 hover:bg-primary/5 transition-all duration-150 card-hover"
          >
            <div className="flex items-start justify-between">
              <BookOpen size={13} className="text-muted-foreground group-hover:text-primary transition-colors mt-0.5" />
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${GENRE_COLORS[book.genre] || 'bg-muted text-muted-foreground'}`}>
                {book.abbrev}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
                {book.name}
              </p>
              <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                {book.chapters} ch · {book.verses} v
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
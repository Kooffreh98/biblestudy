'use client';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight, Languages } from 'lucide-react';
import { BIBLE_BOOKS } from '@/lib/bibleData';
import { getOrGenerateChapter } from '@/lib/bibleOfflineCache';

// ---------------------------------------------------------------------------
// Deterministic daily hash — same result for everyone on the same calendar
// date, changes automatically at midnight.
// ---------------------------------------------------------------------------
function dailyHash(extra = 0): number {
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate() +
    extra;
  return ((seed * 2654435761 + extra * 1234567) >>> 0);
}

// Pick a random verse reference driven purely by today's date.
// Works across all 66 books and every chapter/verse within them.
function getDailyVerse() {
  // Step 1 — pick a book (weighted by verse count so longer books appear more often).
  const totalVerses = BIBLE_BOOKS.reduce((sum, b) => sum + b.verses, 0);
  const bookTarget = dailyHash(0) % totalVerses;
  let cumulative = 0;
  let chosenBook = BIBLE_BOOKS[0];
  for (const book of BIBLE_BOOKS) {
    cumulative += book.verses;
    if (bookTarget < cumulative) { chosenBook = book; break; }
  }

  // Step 2 — pick a chapter within that book.
  const chapter = (dailyHash(1) % chosenBook.chapters) + 1;

  // Step 3 — pick a verse number. We use the book's average verses-per-chapter
  // as a safe upper bound since per-chapter counts aren't stored individually.
  const avgVersesPerChapter = Math.round(chosenBook.verses / chosenBook.chapters);
  const verseCount = Math.max(avgVersesPerChapter, 1);
  const verse = (dailyHash(2) % verseCount) + 1;

  return { book: chosenBook, chapter, verse };
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function HeroVerseCard() {
  const { bookObj, chapter, verse, dateLabel, verseText } = useMemo(() => {
    const { book, chapter, verse } = getDailyVerse();

    // Load the chapter from the offline cache and pull the specific verse text.
    let text = `${book.name} ${chapter}:${verse}`;
    try {
      const verses = getOrGenerateChapter(book.id, chapter, 'KJV');
      const found = Array.isArray(verses) && verses.find((v) => v.verse === verse);
      if (found && found.text) text = found.text;
    } catch {
      // fallback: show reference only
    }

    return {
      bookObj: book,
      chapter,
      verse,
      verseText: text,
      dateLabel: formatDate(new Date()),
    };
  }, []);

  const ref = `${bookObj.name} ${chapter}:${verse}`;

  return (
    <div className="relative overflow-hidden rounded-xl gradient-primary text-primary-foreground p-8 md:p-10">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />

      <div className="relative z-10 max-w-3xl">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 bg-white/15 text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
            <BookOpen size={12} />
            Verse of the Day
          </span>
          <span className="text-xs text-primary-foreground/60 font-mono">{dateLabel}</span>
        </div>

        <blockquote className="text-hero-xl font-semibold leading-relaxed mb-3 text-primary-foreground">
          &ldquo;{verseText}&rdquo;
        </blockquote>

        <p className="text-primary-foreground/80 font-medium mb-6">
          — {ref}
          <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded font-mono">KJV</span>
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/bible-reader?book=${bookObj.id}&chapter=${chapter}&verse=${verse}`}
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-accent/90 transition-all duration-150 active:scale-95"
          >
            <BookOpen size={14} />
            Read Chapter
            <ArrowRight size={13} />
          </Link>
          <Link
            href={`/translation-comparison?book=${bookObj.id}&chapter=${chapter}&verse=${verse}`}
            className="inline-flex items-center gap-2 bg-white/15 text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/25 transition-all duration-150 active:scale-95"
          >
            <Languages size={14} />
            Compare Translations
          </Link>
        </div>
      </div>
    </div>
  );
}

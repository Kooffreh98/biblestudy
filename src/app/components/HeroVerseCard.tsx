import React from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight, Languages } from 'lucide-react';

// Verse of the day — backend integration point: GET /api/verse-of-day
const VERSE_OF_DAY = {
  ref: 'Isaiah 40:31',
  book: 'Isaiah',
  chapter: 40,
  verse: 31,
  bookId: 'isa',
  text: 'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.',
  translation: 'KJV',
};

export default function HeroVerseCard() {
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
          <span className="text-xs text-primary-foreground/60 font-mono">October 4, 2026</span>
        </div>

        <blockquote className="text-hero-xl font-semibold leading-relaxed mb-3 text-primary-foreground">
          &ldquo;{VERSE_OF_DAY?.text}&rdquo;
        </blockquote>

        <p className="text-primary-foreground/80 font-medium mb-6">
          — {VERSE_OF_DAY?.ref}
          <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded font-mono">
            {VERSE_OF_DAY?.translation}
          </span>
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/bible-reader?book=${VERSE_OF_DAY?.bookId}&chapter=${VERSE_OF_DAY?.chapter}`}
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-accent/90 transition-all duration-150 active:scale-95"
          >
            <BookOpen size={14} />
            Read Chapter
            <ArrowRight size={13} />
          </Link>
          <Link
            href={`/translation-comparison?book=${VERSE_OF_DAY?.bookId}&chapter=${VERSE_OF_DAY?.chapter}&verse=${VERSE_OF_DAY?.verse}`}
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
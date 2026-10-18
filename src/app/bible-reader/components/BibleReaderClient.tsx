'use client';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { BIBLE_BOOKS, CROSS_REFERENCES, type TranslationKey } from '@/lib/bibleData';
import { getOrGenerateChapter, type CachedVerse } from '@/lib/bibleOfflineCache';
import BookSidebar from './BookSidebar';
import ReadingPane from './ReadingPane';
import CrossRefPanel from './CrossRefPanel';
import ReaderHeader from './ReaderHeader';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Returns true when the viewport is at least `minWidth` pixels wide.
function useMinWidth(minWidth: number): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= minWidth : true
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia(`(min-width: ${minWidth}px)`);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [minWidth]);

  return matches;
}

export default function BibleReaderClient() {
  const isTablet = useMinWidth(768);   // md — show sidebar
  const isDesktop = useMinWidth(1024); // lg — show cross-ref panel

  const [selectedBook, setSelectedBook] = useState('joh');
  const [selectedChapter, setSelectedChapter] = useState(3);
  const [translation, setTranslation] = useState<TranslationKey>('KJV');
  const [selectedVerse, setSelectedVerse] = useState<number | null>(16);
  const [verses, setVerses] = useState<CachedVerse[]>([]);

  // Sidebar and cross-ref panel: default open only when the screen is wide enough,
  // and automatically collapse/expand as the viewport changes.
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [crossRefOpen, setCrossRefOpen] = useState(true);

  // Sync panel visibility whenever the breakpoints change.
  useEffect(() => { setSidebarOpen(isTablet); }, [isTablet]);
  useEffect(() => { setCrossRefOpen(isDesktop); }, [isDesktop]);

  const book = useMemo(() => BIBLE_BOOKS.find((b) => b.id === selectedBook)!, [selectedBook]);
  const totalChapters = book?.chapters || 1;

  // Load verses whenever book / chapter / translation changes.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        const loaded = getOrGenerateChapter(selectedBook, selectedChapter, translation);
        setVerses(Array.isArray(loaded) ? loaded : []);
      } catch (error) {
        console.error('Failed to load Bible chapter:', error);
        setVerses([]);
      }
    });
    return () => cancelAnimationFrame(id);
  }, [selectedBook, selectedChapter, translation]);

  const goToPrevChapter = useCallback(() => {
    if (selectedChapter > 1) {
      setSelectedChapter((c) => c - 1);
      setSelectedVerse(null);
    } else {
      const idx = BIBLE_BOOKS.findIndex((b) => b.id === selectedBook);
      if (idx > 0) {
        const prev = BIBLE_BOOKS[idx - 1];
        setSelectedBook(prev.id);
        setSelectedChapter(prev.chapters);
        setSelectedVerse(null);
      }
    }
  }, [selectedBook, selectedChapter]);

  const goToNextChapter = useCallback(() => {
    if (selectedChapter < totalChapters) {
      setSelectedChapter((c) => c + 1);
      setSelectedVerse(null);
    } else {
      const idx = BIBLE_BOOKS.findIndex((b) => b.id === selectedBook);
      if (idx < BIBLE_BOOKS.length - 1) {
        const next = BIBLE_BOOKS[idx + 1];
        setSelectedBook(next.id);
        setSelectedChapter(1);
        setSelectedVerse(null);
      }
    }
  }, [selectedBook, selectedChapter, totalChapters]);

  const crossRefKey = selectedVerse ? `${selectedBook}-${selectedChapter}-${selectedVerse}` : null;
  const crossRefs = useMemo(
    () => (crossRefKey ? (CROSS_REFERENCES[crossRefKey] || []) : []),
    [crossRefKey]
  );

  const handleSelectBook = useCallback((id: string) => {
    setSelectedBook(id);
    setSelectedChapter(1);
    setSelectedVerse(null);
    // On mobile, close the sidebar after picking a book so the reading area is visible.
    if (!isTablet) setSidebarOpen(false);
  }, [isTablet]);

  const handleSelectChapter = useCallback((ch: number) => {
    setSelectedChapter(ch);
    setSelectedVerse(null);
    // Same: close sidebar on mobile after picking a chapter.
    if (!isTablet) setSidebarOpen(false);
  }, [isTablet]);

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-0 rounded-xl overflow-hidden border border-border bg-card shadow-sm relative">
      {/* ── Left sidebar ──────────────────────────────────────────────── */}
      {/* On mobile the sidebar overlays the content rather than pushing it. */}
      <div
        className={`
          transition-all duration-300 ease-in-out border-r border-border overflow-hidden
          ${sidebarOpen ? 'w-56 xl:w-64' : 'w-0'}
          ${!isTablet && sidebarOpen
            ? 'absolute inset-y-0 left-0 z-30 shadow-xl bg-card'
            : 'relative'}
        `}
      >
        <BookSidebar
          selectedBook={selectedBook}
          selectedChapter={selectedChapter}
          onSelectBook={handleSelectBook}
          onSelectChapter={handleSelectChapter}
        />
      </div>

      {/* Tap-away backdrop on mobile when sidebar is open */}
      {!isTablet && sidebarOpen && (
        <div
          className="absolute inset-0 z-20 bg-black/30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main reading area ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        <ReaderHeader
          book={book}
          chapter={selectedChapter}
          totalChapters={totalChapters}
          translation={translation}
          onTranslationChange={setTranslation}
          onPrev={goToPrevChapter}
          onNext={goToNextChapter}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          crossRefOpen={crossRefOpen}
          onToggleCrossRef={() => setCrossRefOpen((v) => !v)}
        />
        <ReadingPane
          verses={verses}
          translation={translation}
          selectedVerse={selectedVerse}
          onSelectVerse={setSelectedVerse}
          bookName={book?.name || ''}
          bookId={selectedBook}
          chapter={selectedChapter}
        />
        {/* Chapter nav footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-background/50">
          <button
            onClick={goToPrevChapter}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-md hover:bg-muted"
          >
            <ChevronLeft size={15} />
            <span className="hidden sm:inline">Previous Chapter</span>
            <span className="sm:hidden">Prev</span>
          </button>
          <span className="text-xs text-muted-foreground font-mono">
            {book?.name} {selectedChapter} / {totalChapters}
          </span>
          <button
            onClick={goToNextChapter}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-md hover:bg-muted"
          >
            <span className="hidden sm:inline">Next Chapter</span>
            <span className="sm:hidden">Next</span>
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* ── Right cross-reference panel ────────────────────────────────── */}
      <div
        className={`
          transition-all duration-300 ease-in-out border-l border-border overflow-hidden
          ${crossRefOpen ? 'w-64 xl:w-72' : 'w-0'}
        `}
      >
        <CrossRefPanel
          selectedVerse={selectedVerse}
          crossRefs={crossRefs}
          bookName={book?.name || ''}
          chapter={selectedChapter}
        />
      </div>
    </div>
  );
}

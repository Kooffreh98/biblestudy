'use client';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const isTablet = useMinWidth(768);   // md — show sidebar
  const isDesktop = useMinWidth(1024); // lg — show cross-ref panel

  // Read initial values from URL query params; fall back to John 3:16.
  const initBook = useMemo(() => {
    const b = searchParams.get('book');
    return b && BIBLE_BOOKS.some((bk) => bk.id === b) ? b : 'joh';
  }, [searchParams]);

  const initChapter = useMemo(() => {
    const c = parseInt(searchParams.get('chapter') || '', 10);
    return Number.isFinite(c) && c >= 1 ? c : (initBook === 'joh' ? 3 : 1);
  }, [searchParams, initBook]);

  const initVerse = useMemo(() => {
    const v = parseInt(searchParams.get('verse') || '', 10);
    return Number.isFinite(v) && v >= 1 ? v : (initBook === 'joh' ? 16 : null);
  }, [searchParams, initBook]);

  const initTranslation = useMemo(() => {
    const t = searchParams.get('translation') as TranslationKey | null;
    const valid: TranslationKey[] = ['KJV', 'NIV', 'Hebrew', 'Greek', 'GNV', 'RSV'];
    return t && valid.includes(t) ? t : 'KJV';
  }, [searchParams]);

  const [selectedBook, setSelectedBook] = useState(initBook);
  const [selectedChapter, setSelectedChapter] = useState(initChapter);
  const [translation, setTranslation] = useState<TranslationKey>(initTranslation);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(initVerse);
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

  // When the URL changes (e.g. cross-reference link or browser back/forward),
  // sync the reader state to the new params.
  useEffect(() => {
    const b = searchParams.get('book');
    const c = parseInt(searchParams.get('chapter') || '', 10);
    const v = parseInt(searchParams.get('verse') || '', 10);
    const t = searchParams.get('translation') as TranslationKey | null;

    if (b && BIBLE_BOOKS.some((bk) => bk.id === b)) setSelectedBook(b);
    if (Number.isFinite(c) && c >= 1) setSelectedChapter(c);
    setSelectedVerse(Number.isFinite(v) && v >= 1 ? v : null);

    const valid: TranslationKey[] = ['KJV', 'NIV', 'Hebrew', 'Greek', 'GNV', 'RSV'];
    if (t && valid.includes(t)) setTranslation(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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

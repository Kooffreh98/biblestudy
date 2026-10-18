'use client';
import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Copy, Check, Heart, Highlighter, X } from 'lucide-react';
import { type TranslationKey } from '@/lib/bibleData';
import { toast } from 'sonner';
import {
  isFavorited, getFavoriteId, addFavorite, removeFavorite,
  getVerseHighlight, addHighlight, removeHighlight,
  HIGHLIGHT_COLORS, type HighlightColor,
} from '@/lib/studyStorage';

interface ReadingPaneProps {
  verses: { verse: number; text: string }[];
  translation: TranslationKey;
  selectedVerse: number | null;
  onSelectVerse: (v: number) => void;
  bookName: string;
  bookId: string;
  chapter: number;
}

// Memoized individual verse row to prevent full list re-renders
interface VerseRowProps {
  v: { verse: number; text: string };
  isSelected: boolean;
  isFav: boolean;
  hlColor: HighlightColor | null;
  isRTL: boolean;
  isGreek: boolean;
  copiedVerse: number | null;
  highlightPickerVerse: number | null;
  bookId: string;
  bookName: string;
  chapter: number;
  translation: TranslationKey;
  onSelect: (v: number) => void;
  onCopy: (verse: number, text: string) => void;
  onToggleFavorite: (verse: number, text: string) => void;
  onHighlight: (verse: number, text: string, color: HighlightColor) => void;
  onTogglePicker: (verse: number) => void;
  onRemoveHighlight: (verse: number) => void;
}

const VerseRow = memo(function VerseRow({
  v, isSelected, isFav, hlColor, isRTL, isGreek,
  copiedVerse, highlightPickerVerse,
  bookId, bookName, chapter, translation,
  onSelect, onCopy, onToggleFavorite, onHighlight, onTogglePicker, onRemoveHighlight,
}: VerseRowProps) {
  const hlDef = hlColor ? HIGHLIGHT_COLORS.find((c) => c.key === hlColor) : null;

  return (
    <div
      onClick={() => { onSelect(v.verse); }}
      className={`group relative px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 ${
        hlDef
          ? `${hlDef.bg} border ${hlDef.border}`
          : isSelected
          ? 'bg-accent/10 border border-accent/30' :'hover:bg-muted/50'
      }`}
    >
      <p className={`verse-text ${isRTL ? 'hebrew-text' : isGreek ? 'greek-text' : ''} ${hlDef ? hlDef.text : ''}`}>
        <sup className="verse-number">{v.verse}</sup>
        {v.text}
      </p>

      {/* Hover actions */}
      <div className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} hidden group-hover:flex items-center gap-1`}>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(v.verse, v.text); }}
          className={`p-1 rounded bg-card border border-border transition-colors ${
            isFav ? 'text-red-500 border-red-200' : 'text-muted-foreground hover:text-red-500 hover:border-red-200'
          }`}
          title={isFav ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart size={11} className={isFav ? 'fill-current' : ''} />
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onTogglePicker(v.verse); }}
          className={`p-1 rounded bg-card border border-border transition-colors ${
            hlColor ? 'text-amber-600 border-amber-200' : 'text-muted-foreground hover:text-amber-600 hover:border-amber-200'
          }`}
          title="Highlight verse"
        >
          <Highlighter size={11} />
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onCopy(v.verse, v.text); }}
          className="p-1 rounded bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
          title="Copy verse"
        >
          {copiedVerse === v.verse ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
        </button>
      </div>

      {/* Highlight color picker */}
      {highlightPickerVerse === v.verse && (
        <div
          className={`absolute top-8 ${isRTL ? 'left-2' : 'right-2'} z-20 bg-card border border-border rounded-xl shadow-lg p-3 flex flex-col gap-2 slide-up`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-foreground">Highlight colour</span>
            <button onClick={() => onTogglePicker(v.verse)} className="text-muted-foreground hover:text-foreground transition-colors">
              <X size={12} />
            </button>
          </div>
          <div className="flex gap-2">
            {HIGHLIGHT_COLORS.map((c) => (
              <button
                key={c.key}
                onClick={() => onHighlight(v.verse, v.text, c.key)}
                title={c.label}
                className={`w-6 h-6 rounded-full border-2 transition-all duration-150 ${c.bg} ${
                  hlColor === c.key ? `${c.border} ring-2 ring-offset-1 ring-current scale-110` : 'border-border hover:scale-110'
                }`}
              />
            ))}
          </div>
          {hlColor && (
            <button
              onClick={() => onRemoveHighlight(v.verse)}
              className="text-xs text-muted-foreground hover:text-red-500 transition-colors text-left mt-1"
            >
              Remove highlight
            </button>
          )}
        </div>
      )}
    </div>
  );
});

const ReadingPane = memo(function ReadingPane({
  verses, translation, selectedVerse, onSelectVerse, bookName, bookId, chapter,
}: ReadingPaneProps) {
  const safeVerses = Array.isArray(verses) ? verses : [];
  const [copiedVerse, setCopiedVerse] = useState<number | null>(null);
  const [highlightPickerVerse, setHighlightPickerVerse] = useState<number | null>(null);
  const [savedState, setSavedState] = useState<Record<number, { fav: boolean; highlight: HighlightColor | null }>>({});

  const isRTL = translation === 'Hebrew';
  const isGreek = translation === 'Greek';

  // Stable cache key — only re-read localStorage when book/chapter/translation changes
  const stateKey = `${bookId}-${chapter}-${translation}`;

  const refreshSavedState = useCallback(() => {
    const state: Record<number, { fav: boolean; highlight: HighlightColor | null }> = {};
    // Read verse numbers from current verses snapshot without depending on the array reference
    const verseNums = (Array.isArray(safeVerses) ? safeVerses : []).map(
      (v) => v.verse
    );
    verseNums.forEach((verseNum) => {
      const hl = getVerseHighlight(bookId, chapter, verseNum, translation);
      state[verseNum] = {
        fav: isFavorited(bookId, chapter, verseNum, translation),
        highlight: hl ? hl.color : null,
      };
    });
    setSavedState(state);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateKey]); // Only re-run when book/chapter/translation changes, not on every verses array change

  useEffect(() => {
    refreshSavedState();
  }, [refreshSavedState]);

  const handleCopy = useCallback((verse: number, text: string) => {
    const ref = `${bookName} ${chapter}:${verse} (${translation})`;
    navigator.clipboard.writeText(`"${text}" — ${ref}`).then(() => {
      setCopiedVerse(verse);
      toast.success(`Copied ${bookName} ${chapter}:${verse}`);
      setTimeout(() => setCopiedVerse(null), 2000);
    });
  }, [bookName, chapter, translation]);

  const handleToggleFavorite = useCallback((verse: number, text: string) => {
    const favId = getFavoriteId(bookId, chapter, verse, translation);
    if (favId) {
      removeFavorite(favId);
      toast.success('Removed from favorites');
    } else {
      addFavorite({ book: bookName, bookId, chapter, verse, text, translation });
      toast.success('Saved to favorites');
    }
    refreshSavedState();
  }, [bookId, bookName, chapter, translation, refreshSavedState]);

  const handleHighlight = useCallback((verse: number, text: string, color: HighlightColor) => {
    const existing = getVerseHighlight(bookId, chapter, verse, translation);
    if (existing && existing.color === color) {
      removeHighlight(existing.id);
      toast.success('Highlight removed');
    } else {
      addHighlight({ book: bookName, bookId, chapter, verse, text, translation, color });
      toast.success('Verse highlighted');
    }
    setHighlightPickerVerse(null);
    refreshSavedState();
  }, [bookId, bookName, chapter, translation, refreshSavedState]);

  const handleRemoveHighlight = useCallback((verse: number) => {
    const hl = getVerseHighlight(bookId, chapter, verse, translation);
    if (hl) {
      removeHighlight(hl.id);
      refreshSavedState();
    }
    setHighlightPickerVerse(null);
    toast.success('Highlight removed');
  }, [bookId, chapter, translation, refreshSavedState]);

  const handleTogglePicker = useCallback((verse: number) => {
    setHighlightPickerVerse((prev) => (prev === verse ? null : verse));
  }, []);

  const handleSelectVerse = useCallback((verse: number) => {
    onSelectVerse(verse);
    setHighlightPickerVerse(null);
  }, [onSelectVerse]);

  return (
    <div className={`flex-1 overflow-y-auto scrollbar-thin px-6 md:px-10 xl:px-16 py-8 ${isRTL ? 'text-right' : ''}`}>
      <div className={`max-w-2xl ${isRTL ? 'mr-0 ml-auto' : 'mx-auto'}`}>
        {/* Translation note */}
        <div className="mb-6 flex items-center gap-2">
          <span className="text-xs font-semibold font-mono bg-muted px-2 py-1 rounded text-muted-foreground">
            {translation}
          </span>
          {isRTL && (
            <span className="text-xs text-muted-foreground">Hebrew · Right-to-left reading</span>
          )}
          {isGreek && (
            <span className="text-xs text-muted-foreground">Greek · Koine</span>
          )}
        </div>

        {/* Verses */}
        <div className="space-y-0.5">
          {(Array.isArray(safeVerses) ? safeVerses : []).map((v) => {
            const vs = savedState[v.verse];
            return (
              <VerseRow
                key={`verse-${v.verse}`}
                v={v}
                isSelected={selectedVerse === v.verse}
                isFav={vs?.fav ?? false}
                hlColor={vs?.highlight ?? null}
                isRTL={isRTL}
                isGreek={isGreek}
                copiedVerse={copiedVerse}
                highlightPickerVerse={highlightPickerVerse}
                bookId={bookId}
                bookName={bookName}
                chapter={chapter}
                translation={translation}
                onSelect={handleSelectVerse}
                onCopy={handleCopy}
                onToggleFavorite={handleToggleFavorite}
                onHighlight={handleHighlight}
                onTogglePicker={handleTogglePicker}
                onRemoveHighlight={handleRemoveHighlight}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default ReadingPane;
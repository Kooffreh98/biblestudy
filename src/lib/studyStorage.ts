import { type TranslationKey } from './bibleData';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FavoriteVerse {
  id: string;
  book: string;
  bookId: string;
  chapter: number;
  verse: number;
  text: string;
  translation: TranslationKey;
  savedAt: number;
  tags: string[];
  note: string;
}

export interface StudyNote {
  id: string;
  title: string;
  content: string;
  references: { book: string; bookId: string; chapter: number; verse: number; translation: TranslationKey }[];
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export type HighlightColor = 'yellow' | 'green' | 'blue' | 'pink' | 'purple' | 'orange';

export interface HighlightedVerse {
  id: string;
  book: string;
  bookId: string;
  chapter: number;
  verse: number;
  text: string;
  translation: TranslationKey;
  color: HighlightColor;
  highlightedAt: number;
  note: string;
}

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const KEYS = {
  favorites: 'bs_favorites',
  notes: 'bs_notes',
  highlights: 'bs_highlights',
} as const;

// ─── Generic helpers ──────────────────────────────────────────────────────────

function load<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function save<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // storage full or unavailable
  }
}

// ─── Favorites ────────────────────────────────────────────────────────────────

export function getFavorites(): FavoriteVerse[] {
  return load<FavoriteVerse>(KEYS.favorites).sort((a, b) => b.savedAt - a.savedAt);
}

export function addFavorite(fav: Omit<FavoriteVerse, 'id' | 'savedAt' | 'tags' | 'note'>): FavoriteVerse {
  const all = load<FavoriteVerse>(KEYS.favorites);
  const entry: FavoriteVerse = { ...fav, id: `fav-${Date.now()}`, savedAt: Date.now(), tags: [], note: '' };
  save(KEYS.favorites, [entry, ...all]);
  return entry;
}

export function updateFavorite(id: string, patch: Partial<Pick<FavoriteVerse, 'note' | 'tags'>>): void {
  const all = load<FavoriteVerse>(KEYS.favorites);
  save(KEYS.favorites, all.map((f) => (f.id === id ? { ...f, ...patch } : f)));
}

export function removeFavorite(id: string): void {
  save(KEYS.favorites, load<FavoriteVerse>(KEYS.favorites).filter((f) => f.id !== id));
}

export function isFavorited(bookId: string, chapter: number, verse: number, translation: TranslationKey): boolean {
  return load<FavoriteVerse>(KEYS.favorites).some(
    (f) => f.bookId === bookId && f.chapter === chapter && f.verse === verse && f.translation === translation
  );
}

export function getFavoriteId(bookId: string, chapter: number, verse: number, translation: TranslationKey): string | null {
  return load<FavoriteVerse>(KEYS.favorites).find(
    (f) => f.bookId === bookId && f.chapter === chapter && f.verse === verse && f.translation === translation
  )?.id ?? null;
}

// ─── Study Notes ──────────────────────────────────────────────────────────────

export function getNotes(): StudyNote[] {
  return load<StudyNote>(KEYS.notes).sort((a, b) => b.updatedAt - a.updatedAt);
}

export function addNote(partial: Pick<StudyNote, 'title' | 'content' | 'tags' | 'references'>): StudyNote {
  const all = load<StudyNote>(KEYS.notes);
  const now = Date.now();
  const entry: StudyNote = { ...partial, id: `note-${now}`, createdAt: now, updatedAt: now };
  save(KEYS.notes, [entry, ...all]);
  return entry;
}

export function updateNote(id: string, patch: Partial<Pick<StudyNote, 'title' | 'content' | 'tags' | 'references'>>): void {
  const all = load<StudyNote>(KEYS.notes);
  save(KEYS.notes, all.map((n) => (n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n)));
}

export function removeNote(id: string): void {
  save(KEYS.notes, load<StudyNote>(KEYS.notes).filter((n) => n.id !== id));
}

// ─── Highlights ───────────────────────────────────────────────────────────────

export function getHighlights(): HighlightedVerse[] {
  return load<HighlightedVerse>(KEYS.highlights).sort((a, b) => b.highlightedAt - a.highlightedAt);
}

export function addHighlight(h: Omit<HighlightedVerse, 'id' | 'highlightedAt' | 'note'>): HighlightedVerse {
  const all = load<HighlightedVerse>(KEYS.highlights);
  // Remove existing highlight for same verse+translation if any
  const filtered = all.filter(
    (x) => !(x.bookId === h.bookId && x.chapter === h.chapter && x.verse === h.verse && x.translation === h.translation)
  );
  const entry: HighlightedVerse = { ...h, id: `hl-${Date.now()}`, highlightedAt: Date.now(), note: '' };
  save(KEYS.highlights, [entry, ...filtered]);
  return entry;
}

export function updateHighlight(id: string, patch: Partial<Pick<HighlightedVerse, 'color' | 'note'>>): void {
  const all = load<HighlightedVerse>(KEYS.highlights);
  save(KEYS.highlights, all.map((h) => (h.id === id ? { ...h, ...patch } : h)));
}

export function removeHighlight(id: string): void {
  save(KEYS.highlights, load<HighlightedVerse>(KEYS.highlights).filter((h) => h.id !== id));
}

export function getVerseHighlight(bookId: string, chapter: number, verse: number, translation: TranslationKey): HighlightedVerse | null {
  return load<HighlightedVerse>(KEYS.highlights).find(
    (h) => h.bookId === bookId && h.chapter === chapter && h.verse === verse && h.translation === translation
  ) ?? null;
}

// ─── Color config ─────────────────────────────────────────────────────────────

export const HIGHLIGHT_COLORS: { key: HighlightColor; label: string; bg: string; border: string; text: string }[] = [
  { key: 'yellow', label: 'Gold',   bg: 'bg-yellow-100',  border: 'border-yellow-400', text: 'text-yellow-800' },
  { key: 'green',  label: 'Sage',   bg: 'bg-green-100',   border: 'border-green-400',  text: 'text-green-800'  },
  { key: 'blue',   label: 'Sky',    bg: 'bg-blue-100',    border: 'border-blue-400',   text: 'text-blue-800'   },
  { key: 'pink',   label: 'Rose',   bg: 'bg-pink-100',    border: 'border-pink-400',   text: 'text-pink-800'   },
  { key: 'purple', label: 'Violet', bg: 'bg-purple-100',  border: 'border-purple-400', text: 'text-purple-800' },
  { key: 'orange', label: 'Amber',  bg: 'bg-orange-100',  border: 'border-orange-400', text: 'text-orange-800' },
];

export function getHighlightStyle(color: HighlightColor): string {
  const c = HIGHLIGHT_COLORS.find((x) => x.key === color);
  return c ? `${c.bg} ${c.border}` : '';
}

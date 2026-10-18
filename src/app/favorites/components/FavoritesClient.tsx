'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Heart, StickyNote, Trash2, Edit3, Check, X, Tag, BookOpen,
  Plus, Search, Filter, ChevronDown, ExternalLink,
} from 'lucide-react';
import {
  getFavorites, removeFavorite, updateFavorite,
  getNotes, addNote, updateNote, removeNote,
  type FavoriteVerse, type StudyNote,
} from '@/lib/studyStorage';

type Tab = 'favorites' | 'notes';

const ALL_TRANSLATIONS = ['KJV', 'NIV', 'GNV', 'RSV', 'Hebrew', 'Greek'] as const;

export default function FavoritesClient() {
  const [tab, setTab] = useState<Tab>('favorites');
  const [favorites, setFavorites] = useState<FavoriteVerse[]>([]);
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [search, setSearch] = useState('');
  const [filterTranslation, setFilterTranslation] = useState<string>('all');

  // Editing states
  const [editingFavId, setEditingFavId] = useState<string | null>(null);
  const [editFavNote, setEditFavNote] = useState('');
  const [editFavTag, setEditFavTag] = useState('');

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editNoteTitle, setEditNoteTitle] = useState('');
  const [editNoteContent, setEditNoteContent] = useState('');
  const [editNoteTag, setEditNoteTag] = useState('');

  const [showNewNote, setShowNewNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const reload = useCallback(() => {
    setFavorites(getFavorites());
    setNotes(getNotes());
  }, []);

  useEffect(() => { reload(); }, [reload]);

  // ── Favorites helpers ──────────────────────────────────────────────────────

  const handleDeleteFav = (id: string) => { removeFavorite(id); reload(); };

  const startEditFav = (fav: FavoriteVerse) => {
    setEditingFavId(fav.id);
    setEditFavNote(fav.note);
    setEditFavTag('');
  };

  const saveEditFav = (id: string, tags: string[]) => {
    updateFavorite(id, { note: editFavNote, tags });
    setEditingFavId(null);
    reload();
  };

  const addTagToFav = (fav: FavoriteVerse) => {
    const t = editFavTag.trim();
    if (!t || fav.tags.includes(t)) return;
    updateFavorite(fav.id, { tags: [...fav.tags, t] });
    setEditFavTag('');
    reload();
  };

  const removeTagFromFav = (fav: FavoriteVerse, tag: string) => {
    updateFavorite(fav.id, { tags: fav.tags.filter((x) => x !== tag) });
    reload();
  };

  // ── Notes helpers ──────────────────────────────────────────────────────────

  const handleDeleteNote = (id: string) => { removeNote(id); reload(); };

  const startEditNote = (note: StudyNote) => {
    setEditingNoteId(note.id);
    setEditNoteTitle(note.title);
    setEditNoteContent(note.content);
    setEditNoteTag('');
  };

  const saveEditNote = (note: StudyNote) => {
    updateNote(note.id, { title: editNoteTitle, content: editNoteContent, tags: note.tags });
    setEditingNoteId(null);
    reload();
  };

  const handleCreateNote = () => {
    if (!newNoteTitle.trim() && !newNoteContent.trim()) return;
    addNote({ title: newNoteTitle || 'Untitled Note', content: newNoteContent, tags: [], references: [] });
    setNewNoteTitle('');
    setNewNoteContent('');
    setShowNewNote(false);
    reload();
  };

  // ── Filtering ──────────────────────────────────────────────────────────────

  const filteredFavs = favorites.filter((f) => {
    const matchSearch = search === '' ||
      `${f.book} ${f.chapter}:${f.verse} ${f.text} ${f.note} ${f.tags.join(' ')}`.toLowerCase().includes(search.toLowerCase());
    const matchTrans = filterTranslation === 'all' || f.translation === filterTranslation;
    return matchSearch && matchTrans;
  });

  const filteredNotes = notes.filter((n) => {
    return search === '' ||
      `${n.title} ${n.content} ${n.tags.join(' ')}`.toLowerCase().includes(search.toLowerCase());
  });

  const formatDate = (ts: number) => new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="max-w-4xl mx-auto space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Favorites & Notes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {favorites.length} saved verse{favorites.length !== 1 ? 's' : ''} · {notes.length} study note{notes.length !== 1 ? 's' : ''}
          </p>
        </div>
        {tab === 'notes' && (
          <button
            onClick={() => setShowNewNote(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={15} /> New Note
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        {(['favorites', 'notes'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 capitalize ${
              tab === t ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t === 'favorites' ? <Heart size={14} /> : <StickyNote size={14} />}
            {t}
          </button>
        ))}
      </div>

      {/* Search & Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={tab === 'favorites' ? 'Search verses, notes, tags…' : 'Search notes…'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
          />
        </div>
        {tab === 'favorites' && (
          <div className="relative">
            <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <select
              value={filterTranslation}
              onChange={(e) => setFilterTranslation(e.target.value)}
              className="pl-8 pr-8 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground appearance-none cursor-pointer"
            >
              <option value="all">All Translations</option>
              {ALL_TRANSLATIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
        )}
      </div>

      {/* New Note form */}
      {showNewNote && tab === 'notes' && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-3 slide-up">
          <h3 className="text-sm font-semibold text-foreground">New Study Note</h3>
          <input
            type="text"
            placeholder="Title…"
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
          />
          <textarea
            placeholder="Write your study notes, reflections, or observations…"
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            rows={5}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground resize-none"
          />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowNewNote(false)} className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
            <button onClick={handleCreateNote} className="px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">Save Note</button>
          </div>
        </div>
      )}

      {/* ── FAVORITES TAB ── */}
      {tab === 'favorites' && (
        <div className="space-y-3">
          {filteredFavs.length === 0 ? (
            <EmptyState
              icon={<Heart size={32} className="text-muted-foreground/40" />}
              title={favorites.length === 0 ? 'No saved verses yet' : 'No results found'}
              desc={favorites.length === 0 ? 'Open the Bible Reader and tap the bookmark icon on any verse to save it here.' : 'Try a different search or filter.'}
              action={favorites.length === 0 ? <Link href="/bible-reader" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"><BookOpen size={14} /> Open Bible Reader</Link> : null}
            />
          ) : (
            filteredFavs.map((fav) => (
              <div key={fav.id} className="bg-card border border-border rounded-xl p-5 space-y-3 card-hover">
                {/* Verse header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">{fav.translation}</span>
                    <span className="text-sm font-semibold text-foreground">{fav.book} {fav.chapter}:{fav.verse}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(fav.savedAt)}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Link
                      href={`/bible-reader`}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                      title="Open in reader"
                    >
                      <ExternalLink size={13} />
                    </Link>
                    <button onClick={() => startEditFav(fav)} className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors" title="Edit note">
                      <Edit3 size={13} />
                    </button>
                    <button onClick={() => handleDeleteFav(fav.id)} className="p-1.5 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors" title="Remove">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Verse text */}
                <p className="verse-text text-foreground/90 leading-relaxed border-l-2 border-accent/40 pl-3">
                  {fav.text}
                </p>

                {/* Tags */}
                {fav.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {fav.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                        <Tag size={9} />
                        {tag}
                        {editingFavId === fav.id && (
                          <button onClick={() => removeTagFromFav(fav, tag)} className="ml-0.5 hover:text-red-500 transition-colors">
                            <X size={9} />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                )}

                {/* Edit panel */}
                {editingFavId === fav.id && (
                  <div className="space-y-2 pt-2 border-t border-border slide-up">
                    <textarea
                      value={editFavNote}
                      onChange={(e) => setEditFavNote(e.target.value)}
                      placeholder="Add a personal note…"
                      rows={3}
                      className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground resize-none"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editFavTag}
                        onChange={(e) => setEditFavTag(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTagToFav(fav); } }}
                        placeholder="Add tag…"
                        className="flex-1 px-3 py-1.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                      />
                      <button onClick={() => addTagToFav(fav)} className="px-3 py-1.5 text-sm bg-muted rounded-lg hover:bg-secondary transition-colors text-foreground">
                        <Plus size={13} />
                      </button>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setEditingFavId(null)} className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"><X size={12} /> Cancel</button>
                      <button onClick={() => saveEditFav(fav.id, fav.tags)} className="px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-1"><Check size={12} /> Save</button>
                    </div>
                  </div>
                )}

                {/* Saved note preview */}
                {fav.note && editingFavId !== fav.id && (
                  <p className="text-sm text-muted-foreground italic bg-muted/50 rounded-lg px-3 py-2">
                    {fav.note}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* ── NOTES TAB ── */}
      {tab === 'notes' && (
        <div className="space-y-3">
          {filteredNotes.length === 0 ? (
            <EmptyState
              icon={<StickyNote size={32} className="text-muted-foreground/40" />}
              title={notes.length === 0 ? 'No study notes yet' : 'No results found'}
              desc={notes.length === 0 ? 'Create a note to capture your reflections, sermon outlines, or research.' : 'Try a different search.'}
              action={notes.length === 0 ? <button onClick={() => setShowNewNote(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"><Plus size={14} /> Create First Note</button> : null}
            />
          ) : (
            filteredNotes.map((note) => (
              <div key={note.id} className="bg-card border border-border rounded-xl p-5 space-y-3 card-hover">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {editingNoteId === note.id ? (
                      <input
                        type="text"
                        value={editNoteTitle}
                        onChange={(e) => setEditNoteTitle(e.target.value)}
                        className="text-base font-semibold bg-background border border-border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring text-foreground w-full"
                      />
                    ) : (
                      <h3 className="text-base font-semibold text-foreground">{note.title}</h3>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Updated {formatDate(note.updatedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {editingNoteId === note.id ? (
                      <>
                        <button onClick={() => setEditingNoteId(null)} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"><X size={13} /></button>
                        <button onClick={() => saveEditNote(note)} className="p-1.5 rounded-md text-primary hover:bg-primary/10 transition-colors"><Check size={13} /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEditNote(note)} className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors"><Edit3 size={13} /></button>
                        <button onClick={() => handleDeleteNote(note.id)} className="p-1.5 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={13} /></button>
                      </>
                    )}
                  </div>
                </div>

                {editingNoteId === note.id ? (
                  <textarea
                    value={editNoteContent}
                    onChange={(e) => setEditNoteContent(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground resize-none"
                  />
                ) : (
                  <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap line-clamp-4">
                    {note.content || <span className="text-muted-foreground italic">No content</span>}
                  </p>
                )}

                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {note.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                        <Tag size={9} />{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon, title, desc, action }: { icon: React.ReactNode; title: string; desc: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      {icon}
      <div>
        <p className="text-base font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">{desc}</p>
      </div>
      {action}
    </div>
  );
}

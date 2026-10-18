'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Highlighter, Trash2, Edit3, Check, X, BookOpen, Search, Filter, ChevronDown, ExternalLink, StickyNote } from 'lucide-react';
import {
  getHighlights, removeHighlight, updateHighlight,
  HIGHLIGHT_COLORS, type HighlightedVerse, type HighlightColor,
} from '@/lib/studyStorage';

const COLOR_FILTER_OPTIONS = [{ key: 'all', label: 'All Colors' }, ...HIGHLIGHT_COLORS.map((c) => ({ key: c.key, label: c.label }))];
const ALL_TRANSLATIONS = ['KJV', 'NIV', 'Hebrew', 'Greek'] as const;

export default function HighlightsClient() {
  const [highlights, setHighlights] = useState<HighlightedVerse[]>([]);
  const [search, setSearch] = useState('');
  const [filterColor, setFilterColor] = useState<string>('all');
  const [filterTranslation, setFilterTranslation] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState('');
  const [editColor, setEditColor] = useState<HighlightColor>('yellow');

  const reload = useCallback(() => setHighlights(getHighlights()), []);
  useEffect(() => { reload(); }, [reload]);

  const handleDelete = (id: string) => { removeHighlight(id); reload(); };

  const startEdit = (h: HighlightedVerse) => {
    setEditingId(h.id);
    setEditNote(h.note);
    setEditColor(h.color);
  };

  const saveEdit = (id: string) => {
    updateHighlight(id, { note: editNote, color: editColor });
    setEditingId(null);
    reload();
  };

  const filtered = useMemo(() => highlights.filter((h) => {
    const matchSearch = search === '' ||
      `${h.book} ${h.chapter}:${h.verse} ${h.text} ${h.note}`.toLowerCase().includes(search.toLowerCase());
    const matchColor = filterColor === 'all' || h.color === filterColor;
    const matchTrans = filterTranslation === 'all' || h.translation === filterTranslation;
    return matchSearch && matchColor && matchTrans;
  }), [highlights, search, filterColor, filterTranslation]);

  // Group by color for summary
  const colorCounts = useMemo(() => HIGHLIGHT_COLORS.map((c) => ({
    ...c,
    count: highlights.filter((h) => h.color === c.key).length,
  })).filter((c) => c.count > 0), [highlights]);

  const formatDate = useCallback((ts: number) => {
    const d = new Date(ts);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Highlights</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {highlights.length} highlighted verse{highlights.length !== 1 ? 's' : ''} across all translations
        </p>
      </div>

      {/* Color summary chips */}
      {colorCounts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {colorCounts.map((c) => (
            <button
              key={c.key}
              onClick={() => setFilterColor(filterColor === c.key ? 'all' : c.key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
                filterColor === c.key
                  ? `${c.bg} ${c.border} ${c.text} ring-2 ring-offset-1 ring-current`
                  : `${c.bg} ${c.border} ${c.text} opacity-70 hover:opacity-100`
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${c.bg.replace('bg-', 'bg-').replace('-100', '-400')}`} />
              {c.label}
              <span className="font-mono">{c.count}</span>
            </button>
          ))}
        </div>
      )}

      {/* Search & Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search highlighted verses…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
          />
        </div>
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
      </div>

      {/* Highlights list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <Highlighter size={32} className="text-muted-foreground/40" />
          <div>
            <p className="text-base font-semibold text-foreground">
              {highlights.length === 0 ? 'No highlights yet' : 'No results found'}
            </p>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
              {highlights.length === 0
                ? 'Open the Bible Reader and use the highlight button on any verse to add colour-coded highlights.' :'Try a different search or filter.'}
            </p>
          </div>
          {highlights.length === 0 && (
            <Link
              href="/bible-reader"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <BookOpen size={14} /> Open Bible Reader
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((h) => {
            const colorDef = HIGHLIGHT_COLORS.find((c) => c.key === h.color)!;
            return (
              <div
                key={h.id}
                className={`border rounded-xl p-5 space-y-3 transition-all duration-150 ${colorDef.bg} ${colorDef.border} border-l-4`}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-semibold font-mono px-2 py-0.5 rounded bg-white/60 ${colorDef.text}`}>
                      {h.translation}
                    </span>
                    <span className={`text-sm font-semibold ${colorDef.text}`}>{h.book} {h.chapter}:{h.verse}</span>
                    <span className={`text-xs opacity-70 ${colorDef.text}`}>{formatDate(h.highlightedAt)}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-white/50 ${colorDef.text}`}>
                      {colorDef.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Link href="/bible-reader" className={`p-1.5 rounded-md hover:bg-white/40 transition-colors ${colorDef.text}`} title="Open in reader">
                      <ExternalLink size={13} />
                    </Link>
                    <button onClick={() => startEdit(h)} className={`p-1.5 rounded-md hover:bg-white/40 transition-colors ${colorDef.text}`} title="Edit">
                      <Edit3 size={13} />
                    </button>
                    <button onClick={() => handleDelete(h.id)} className="p-1.5 rounded-md hover:bg-red-100 text-red-500 transition-colors" title="Remove">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Verse text */}
                <p className={`verse-text leading-relaxed ${colorDef.text}`}>
                  <sup className="verse-number">{h.verse}</sup>
                  {h.text}
                </p>

                {/* Edit panel */}
                {editingId === h.id && (
                  <div className="space-y-3 pt-2 border-t border-white/40 slide-up">
                    {/* Color picker */}
                    <div>
                      <p className="text-xs font-medium text-foreground/70 mb-2">Change colour</p>
                      <div className="flex gap-2 flex-wrap">
                        {HIGHLIGHT_COLORS.map((c) => (
                          <button
                            key={c.key}
                            onClick={() => setEditColor(c.key)}
                            title={c.label}
                            className={`w-7 h-7 rounded-full border-2 transition-all duration-150 ${c.bg} ${
                              editColor === c.key ? `${c.border} ring-2 ring-offset-1 ring-current scale-110` : 'border-white/60 hover:scale-105'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <textarea
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      placeholder="Add a note about this highlight…"
                      rows={2}
                      className="w-full px-3 py-2 text-sm bg-white/60 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground resize-none"
                    />
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setEditingId(null)} className="px-3 py-1.5 text-sm text-foreground/60 hover:text-foreground transition-colors flex items-center gap-1"><X size={12} /> Cancel</button>
                      <button onClick={() => saveEdit(h.id)} className="px-4 py-1.5 text-sm bg-white/70 rounded-lg hover:bg-white/90 transition-colors font-medium flex items-center gap-1 text-foreground"><Check size={12} /> Save</button>
                    </div>
                  </div>
                )}

                {/* Note preview */}
                {h.note && editingId !== h.id && (
                  <div className={`flex items-start gap-2 text-sm italic bg-white/40 rounded-lg px-3 py-2 ${colorDef.text}`}>
                    <StickyNote size={12} className="mt-0.5 shrink-0" />
                    {h.note}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

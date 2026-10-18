'use client';
import React, { useState, useCallback } from 'react';
import { Search, Sparkles, Filter } from 'lucide-react';
import { BIBLE_BOOKS, type TranslationKey } from '@/lib/bibleData';
import SearchResultCard from './SearchResultCard';
import SearchFilters from './SearchFilters';
import SearchDistributionChart from './SearchDistributionChart';

// Mock search results — backend integration point: POST /api/search { query, translation, testament, book }
const MOCK_RESULTS = [
  { id: 'sr-001', book: 'John', bookId: 'joh', chapter: 3, verse: 16, translation: 'KJV' as TranslationKey, text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.', relevance: 98, theme: 'Love · Salvation' },
  { id: 'sr-002', book: 'Romans', bookId: 'rom', chapter: 5, verse: 8, translation: 'NIV' as TranslationKey, text: 'But God demonstrates his own love for us in this: While we were still sinners, Christ died for us.', relevance: 95, theme: 'Love · Grace' },
  { id: 'sr-003', book: 'John', bookId: 'joh', chapter: 15, verse: 13, translation: 'KJV' as TranslationKey, text: 'Greater love hath no man than this, that a man lay down his life for his friends.', relevance: 91, theme: 'Love · Sacrifice' },
  { id: 'sr-004', book: '1 John', bookId: '1jo', chapter: 4, verse: 8, translation: 'NIV' as TranslationKey, text: 'Whoever does not love does not know God, because God is love.', relevance: 89, theme: 'Love · Character of God' },
  { id: 'sr-005', book: 'Deuteronomy', bookId: 'deu', chapter: 6, verse: 5, translation: 'KJV' as TranslationKey, text: 'And thou shalt love the LORD thy God with all thine heart, and with all thy soul, and with all thy might.', relevance: 87, theme: 'Love · Commandment' },
  { id: 'sr-006', book: '1 Corinthians', bookId: '1co', chapter: 13, verse: 4, translation: 'NIV' as TranslationKey, text: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud.', relevance: 85, theme: 'Love · Character' },
  { id: 'sr-007', book: 'Jeremiah', bookId: 'jer', chapter: 31, verse: 3, translation: 'KJV' as TranslationKey, text: 'The LORD hath appeared of old unto me, saying, Yea, I have loved thee with an everlasting love: therefore with lovingkindness have I drawn thee.', relevance: 83, theme: 'Love · Covenant' },
  { id: 'sr-008', book: 'Ephesians', bookId: 'eph', chapter: 3, verse: 17, translation: 'NIV' as TranslationKey, text: 'And I pray that you, being rooted and established in love, may have power, together with all the Lord\'s holy people, to grasp how wide and long and high and deep is the love of Christ.', relevance: 80, theme: 'Love · Prayer' },
  { id: 'sr-009', book: 'Psalms', bookId: 'psa', chapter: 136, verse: 1, translation: 'KJV' as TranslationKey, text: 'O give thanks unto the LORD; for he is good: for his mercy endureth for ever.', relevance: 77, theme: 'Love · Praise' },
  { id: 'sr-010', book: 'Zephaniah', bookId: 'zep', chapter: 3, verse: 17, translation: 'NIV' as TranslationKey, text: 'The Lord your God is with you, the Mighty Warrior who saves. He will take great delight in you; in his love he will no longer rebuke you, but will rejoice over you with singing.', relevance: 74, theme: 'Love · Promise' },
  { id: 'sr-011', book: 'Song of Solomon', bookId: 'sng', chapter: 8, verse: 7, translation: 'KJV' as TranslationKey, text: 'Many waters cannot quench love, neither can the floods drown it: if a man would give all the substance of his house for love, it would utterly be contemned.', relevance: 71, theme: 'Love · Poetry' },
  { id: 'sr-012', book: 'Galatians', bookId: 'gal', chapter: 5, verse: 22, translation: 'NIV' as TranslationKey, text: 'But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control. Against such things there is no law.', relevance: 68, theme: 'Love · Fruit of Spirit' },
];

const DISTRIBUTION_DATA = [
  { name: 'Law', count: 24, testament: 'OT' },
  { name: 'History', count: 38, testament: 'OT' },
  { name: 'Wisdom', count: 67, testament: 'OT' },
  { name: 'Maj. Prophets', count: 41, testament: 'OT' },
  { name: 'Min. Prophets', count: 19, testament: 'OT' },
  { name: 'Gospels', count: 89, testament: 'NT' },
  { name: 'Acts', count: 12, testament: 'NT' },
  { name: 'Epistles', count: 103, testament: 'NT' },
  { name: 'Prophecy', count: 22, testament: 'NT' },
];

export default function SearchClient() {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('love');
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedTranslation, setSelectedTranslation] = useState<TranslationKey | 'All'>('All');
  const [selectedTestament, setSelectedTestament] = useState<'All' | 'OT' | 'NT'>('All');
  const [results, setResults] = useState(MOCK_RESULTS);

  const handleSearch = useCallback(() => {
    if (!query.trim()) return;
    setLoading(true);
    // Backend integration point: POST /api/search { query, translation, testament }
    setTimeout(() => {
      setSubmittedQuery(query);
      setResults(MOCK_RESULTS);
      setLoading(false);
    }, 600);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const filteredResults = results.filter((r) => {
    if (selectedTranslation !== 'All' && r.translation !== selectedTranslation) return false;
    const book = BIBLE_BOOKS.find((b) => b.id === r.bookId);
    if (selectedTestament !== 'All' && book?.testament !== selectedTestament) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground mb-1">Scripture Search</h1>
        <p className="text-sm text-muted-foreground">
          Semantic search across KJV, NIV, Hebrew, and Greek — find verses by keyword, theme, or concept.
        </p>
      </div>

      {/* Search bar */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Search for "faith", "redemption", "the kingdom of God"…'
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-3 gradient-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-all duration-150 active:scale-95 disabled:opacity-60"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <Sparkles size={15} />
          )}
          Search
        </button>
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className={`flex items-center gap-1.5 px-4 py-3 rounded-xl border font-semibold text-sm transition-all duration-150 ${
            filtersOpen ? 'bg-primary/10 border-primary/40 text-primary' : 'bg-card border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
          }`}
        >
          <Filter size={15} />
          Filters
          {(selectedTranslation !== 'All' || selectedTestament !== 'All') && (
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          )}
        </button>
      </div>

      {/* Filters panel */}
      {filtersOpen && (
        <SearchFilters
          selectedTranslation={selectedTranslation}
          selectedTestament={selectedTestament}
          onTranslationChange={setSelectedTranslation}
          onTestamentChange={setSelectedTestament}
          onClose={() => setFiltersOpen(false)}
        />
      )}

      {/* Results section */}
      {submittedQuery && (
        <>
          {/* Distribution chart */}
          <SearchDistributionChart data={DISTRIBUTION_DATA} query={submittedQuery} />

          {/* Results header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-foreground">
                Results for &ldquo;{submittedQuery}&rdquo;
              </h2>
              <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">
                {filteredResults.length} verses
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Sorted by relevance</span>
              <Sparkles size={13} className="text-accent" />
            </div>
          </div>

          {/* Result cards */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={`skeleton-result-${i}`} className="h-28 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search size={36} className="text-muted-foreground/30 mb-3" />
              <p className="text-base font-semibold text-foreground mb-1">No verses found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters or searching with different keywords.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredResults.map((result) => (
                <SearchResultCard key={result.id} result={result} query={submittedQuery} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Empty state when no search submitted */}
      {!submittedQuery && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Sparkles size={40} className="text-muted-foreground/25 mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">Search All of Scripture</h2>
          <p className="text-sm text-muted-foreground max-w-md">
            Enter a word, phrase, or topic above. The AI-powered search finds semantically related verses across all 66 books and 4 translations.
          </p>
        </div>
      )}
    </div>
  );
}
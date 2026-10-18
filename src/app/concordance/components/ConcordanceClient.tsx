'use client';
import React, { useState } from 'react';
import { AlignLeft, Search } from 'lucide-react';
import ConcordanceWordPanel from './ConcordanceWordPanel';
import ConcordanceFrequencyChart from './ConcordanceFrequencyChart';
import ConcordanceOccurrenceTable from './ConcordanceOccurrenceTable';

// Mock concordance entry — backend integration point: GET /api/concordance?word={word}
const MOCK_CONCORDANCE = {
  word: 'love',
  strongsH: 'H157',
  strongsG: 'G26',
  hebrewRoot: 'אָהַב',
  hebrewTranslit: 'ʾāhab',
  greekRoot: 'ἀγάπη',
  greekTranslit: 'agapē',
  partOfSpeech: 'Verb / Noun',
  totalOccurrences: 714,
  otOccurrences: 312,
  ntOccurrences: 402,
  definition: 'To have a deep, enduring affection; to hold dear. In the NT, ἀγάπη denotes selfless, sacrificial love — the highest form of love — as opposed to φιλέω (philéō, brotherly affection) or ἔρως (erōs, romantic love).',
  relatedWords: ['grace', 'mercy', 'kindness', 'charity', 'beloved'],
};

const FREQUENCY_DATA = [
  { book: 'Gen', count: 12 }, { book: 'Deu', count: 22 }, { book: 'Psa', count: 87 },
  { book: 'Pro', count: 31 }, { book: 'Sng', count: 29 }, { book: 'Isa', count: 18 },
  { book: 'Jer', count: 14 }, { book: 'Hos', count: 11 }, { book: 'Mat', count: 23 },
  { book: 'Mar', count: 16 }, { book: 'Luk', count: 28 }, { book: 'Joh', count: 57 },
  { book: 'Rom', count: 31 }, { book: '1Co', count: 27 }, { book: 'Eph', count: 19 },
  { book: '1Jo', count: 46 }, { book: 'Rev', count: 8 },
];

const OCCURRENCES = [
  { id: 'occ-001', book: 'Genesis', bookId: 'gen', chapter: 29, verse: 20, text: 'And Jacob served seven years for Rachel; and they seemed unto him but a few days, for the love he had to her.', translation: 'KJV' },
  { id: 'occ-002', book: 'Deuteronomy', bookId: 'deu', chapter: 6, verse: 5, text: 'And thou shalt love the LORD thy God with all thine heart, and with all thy soul, and with all thy might.', translation: 'KJV' },
  { id: 'occ-003', book: 'Psalms', bookId: 'psa', chapter: 136, verse: 1, text: 'O give thanks unto the LORD; for he is good: for his mercy endureth for ever.', translation: 'KJV' },
  { id: 'occ-004', book: 'Proverbs', bookId: 'pro', chapter: 10, verse: 12, text: 'Hatred stirreth up strifes: but love covereth all sins.', translation: 'KJV' },
  { id: 'occ-005', book: 'Song of Solomon', bookId: 'sng', chapter: 8, verse: 7, text: 'Many waters cannot quench love, neither can the floods drown it.', translation: 'KJV' },
  { id: 'occ-006', book: 'Jeremiah', bookId: 'jer', chapter: 31, verse: 3, text: 'The LORD hath appeared of old unto me, saying, Yea, I have loved thee with an everlasting love.', translation: 'KJV' },
  { id: 'occ-007', book: 'John', bookId: 'joh', chapter: 3, verse: 16, text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.', translation: 'KJV' },
  { id: 'occ-008', book: 'John', bookId: 'joh', chapter: 13, verse: 34, text: 'A new commandment I give unto you, That ye love one another; as I have loved you, that ye also love one another.', translation: 'KJV' },
  { id: 'occ-009', book: 'Romans', bookId: 'rom', chapter: 8, verse: 38, text: 'For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come, shall be able to separate us from the love of God.', translation: 'KJV' },
  { id: 'occ-010', book: '1 Corinthians', bookId: '1co', chapter: 13, verse: 13, text: 'And now abideth faith, hope, charity, these three; but the greatest of these is charity.', translation: 'KJV' },
  { id: 'occ-011', book: 'Ephesians', bookId: 'eph', chapter: 5, verse: 25, text: 'Husbands, love your wives, even as Christ also loved the church, and gave himself for it.', translation: 'KJV' },
  { id: 'occ-012', book: '1 John', bookId: '1jo', chapter: 4, verse: 8, text: 'He that loveth not knoweth not God; for God is love.', translation: 'KJV' },
];

export default function ConcordanceClient() {
  const [searchWord, setSearchWord] = useState('');
  const [activeWord, setActiveWord] = useState('love');
  const [loading, setLoading] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(MOCK_CONCORDANCE);
  const [occurrences, setOccurrences] = useState(OCCURRENCES);
  const [frequencyData, setFrequencyData] = useState(FREQUENCY_DATA);

  const handleSearch = () => {
    if (!searchWord?.trim()) return;
    setLoading(true);
    // Backend integration point: GET /api/concordance?word={searchWord}
    setTimeout(() => {
      setActiveWord(searchWord);
      setCurrentEntry({ ...MOCK_CONCORDANCE, word: searchWord });
      setLoading(false);
    }, 500);
  };

  const popularWords = ['love', 'faith', 'grace', 'mercy', 'truth', 'light', 'peace', 'joy', 'righteousness', 'salvation'];

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground mb-1">Full Concordance</h1>
        <p className="text-sm text-muted-foreground">
          Trace any word through every occurrence in the Bible with Strong&apos;s numbers, Hebrew/Greek roots, and frequency analysis.
        </p>
      </div>

      {/* Search bar */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <AlignLeft size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchWord}
            onChange={(e) => setSearchWord(e?.target?.value)}
            onKeyDown={(e) => e?.key === 'Enter' && handleSearch()}
            placeholder='Enter a word: "faith", "grace", "ἀγάπη", "אָהַב"…'
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
            <Search size={15} />
          )}
          Look Up
        </button>
      </div>

      {/* Popular words */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-muted-foreground self-center">Popular:</span>
        {popularWords?.map((w) => (
          <button
            key={`popular-${w}`}
            onClick={() => { setSearchWord(w); setActiveWord(w); setCurrentEntry({ ...MOCK_CONCORDANCE, word: w }); }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 ${
              activeWord === w
                ? 'bg-accent text-accent-foreground'
                : 'bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            {w}
          </button>
        ))}
      </div>

      {/* Main content */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="h-64 bg-muted rounded-xl animate-pulse" />
          <div className="lg:col-span-2 h-64 bg-muted rounded-xl animate-pulse" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {/* Word info panel */}
            <div className="lg:col-span-1">
              <ConcordanceWordPanel entry={currentEntry} />
            </div>
            {/* Frequency chart */}
            <div className="lg:col-span-2 xl:col-span-3">
              <ConcordanceFrequencyChart data={frequencyData} word={activeWord} />
            </div>
          </div>

          {/* Occurrence table */}
          <ConcordanceOccurrenceTable occurrences={occurrences} word={activeWord} />
        </>
      )}
    </div>
  );
}
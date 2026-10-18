'use client';
import React, { useState } from 'react';
import { GitCompare, ChevronLeft, ChevronRight, BookOpen, Info } from 'lucide-react';
import { SAMPLE_VERSES, type TranslationKey } from '@/lib/bibleData';
import TranslationCard from './TranslationCard';
import VerseSelector from './VerseSelector';
import DiffLegend from './DiffLegend';

const FEATURED_VERSE_IDS = ['gen-1-1', 'psa-23-1', 'joh-3-16', 'rom-8-28', 'pro-3-5', 'isa-40-31', 'mat-5-3', 'phi-4-13'];

// Word-level diff between KJV and NIV for key verses
const KJV_NIV_DIFFS: Record<string, { kjvWord: string; nivWord: string; note: string }[]> = {
  'joh-3-16': [
    { kjvWord: 'only begotten Son', nivWord: 'one and only Son', note: 'μονογενῆ (monogenē) — unique/only; KJV tradition adds "begotten" from Latin unigenitus' },
    { kjvWord: 'whosoever believeth', nivWord: 'whoever believes', note: 'πᾶς ὁ πιστεύων — KJV uses archaic subjunctive; NIV modernizes' },
    { kjvWord: 'everlasting life', nivWord: 'eternal life', note: 'ζωὴν αἰώνιον — both are valid renderings of aiōnion; "eternal" is more common in modern translations' },
  ],
  'gen-1-1': [
    { kjvWord: 'the heaven', nivWord: 'the heavens', note: 'הַשָּׁמַיִם (haššāmayim) — Hebrew dual/plural; NIV reflects the plural more accurately' },
  ],
  'psa-23-1': [
    { kjvWord: 'I shall not want', nivWord: 'I lack nothing', note: 'לֹא אֶחְסָר — KJV is more literal; NIV renders the meaning more dynamically' },
  ],
  'rom-8-28': [
    { kjvWord: 'all things work together for good', nivWord: 'in all things God works for the good', note: 'συνεργεῖ εἰς ἀγαθόν — NIV makes God the explicit subject; KJV leaves subject ambiguous' },
  ],
  'pro-3-5': [
    { kjvWord: 'thine heart', nivWord: 'your heart', note: 'לִבֶּךָ — KJV uses archaic second-person possessive; NIV modernizes' },
    { kjvWord: 'thine own understanding', nivWord: 'your own understanding', note: 'בִּינָתְךָ — same archaic/modern distinction' },
  ],
};

const TRANSLATOR_NOTES: Record<TranslationKey, Record<string, string>> = {
  KJV: {
    'joh-3-16': 'Translated 1611 by the King James Bible Committee under King James I. "Only begotten" follows the Latin Vulgate\'s unigenitus. Uses formal equivalence — word-for-word rendering.',
    'gen-1-1': 'The opening verse sets the creation narrative. "Heaven" (singular) follows the Hebrew construct; some manuscripts read heavens (plural).',
    'psa-23-1': 'The Shepherd Psalm. "Want" here means "lack" — an archaic usage preserved from Middle English.',
    'rom-8-28': 'A disputed verse — some manuscripts have "God" as explicit subject; others leave it implied. KJV reflects the ambiguous tradition.',
    'default': 'King James Version (1611) — formal equivalence translation commissioned by King James I of England.',
  },
  NIV: {
    'joh-3-16': 'NIV (2011 revision) uses dynamic equivalence — meaning-for-meaning. "One and only" is a more precise rendering of monogenē than "only begotten."',
    'gen-1-1': 'NIV renders the Hebrew plural šāmayim as "heavens" — reflecting the grammatical number more accurately than KJV\'s singular.',
    'psa-23-1': '"I lack nothing" is a dynamic rendering that captures the meaning of the Hebrew more naturally for modern readers.',
    'rom-8-28': 'NIV 2011 revision clarified God as explicit subject based on the best Greek manuscripts (P46, Sinaiticus, Vaticanus).',
    'default': 'New International Version (2011) — dynamic equivalence translation by Biblica. Widely used in evangelical Protestant churches.',
  },
  GNV: {
    'joh-3-16': 'Good News Version (Today\'s English Version) renders the text in plain, everyday language. "Only-begotten Son" preserves the traditional phrasing while remaining accessible.',
    'gen-1-1': 'The GNV follows the Hebrew closely while using contemporary English vocabulary for broad accessibility.',
    'psa-23-1': 'The GNV preserves the familiar "I shall not want" phrasing, balancing traditional language with readability.',
    'rom-8-28': 'The GNV emphasizes the communal aspect — "them that love God" — reflecting the covenant community context.',
    'default': 'Good News Version (1976, rev. 1992) — also known as Today\'s English Version (TEV). Uses common language for broad accessibility, published by the American Bible Society.',
  },
  RSV: {
    'joh-3-16': 'The RSV (1952) uses "only Son" rather than "only begotten Son," reflecting updated scholarship on monogenē. A scholarly revision of the KJV tradition.',
    'gen-1-1': 'RSV renders "heavens" (plural) following the Hebrew grammatical number, aligning with modern scholarship.',
    'psa-23-1': '"I shall not want" — the RSV retains the classic phrasing while modernizing other archaic KJV language.',
    'rom-8-28': 'RSV makes "God" the explicit subject — "God works for good" — based on the best available Greek manuscripts.',
    'default': 'Revised Standard Version (1952, NT 1946) — a scholarly revision of the KJV/ASV tradition. Widely used in mainline Protestant and Catholic churches.',
  },
  Hebrew: {
    'joh-3-16': 'This is a back-translation into Hebrew (Modern Hebrew Bible / Delitzsch NT). The verse does not appear in the Hebrew Bible; this rendering is from the Hebrew New Testament tradition.',
    'gen-1-1': 'The Masoretic Text — the authoritative Hebrew text established by Jewish scholars (Masoretes) between the 6th and 10th centuries AD. Includes cantillation marks (tropes) and vowel points.',
    'psa-23-1': 'From the Masoretic Text of the Psalms. יְהוָה (YHWH) — the divine name, traditionally pronounced Adonai (Lord) in Jewish reading.',
    'default': 'Ancient Hebrew — Masoretic Text (MT) for the Old Testament. Hebrew New Testament translations follow the Delitzsch / UBS Hebrew NT tradition.',
  },
  Greek: {
    'joh-3-16': 'From the Greek New Testament (Nestle-Aland 28th edition). μονογενῆ (monogenē) — "unique" or "only of its kind." The article τὸν (ton) before υἱὸν emphasizes the specific, definite Son.',
    'gen-1-1': 'From the Septuagint (LXX) — the Greek translation of the Hebrew scriptures, completed ca. 3rd–1st century BC. Used by the early church and frequently quoted in the NT.',
    'psa-23-1': 'Septuagint (LXX) rendering. Κύριος (Kyrios — Lord) renders the Hebrew YHWH throughout the LXX, a convention adopted by NT authors.',
    'default': 'Ancient Greek — Septuagint (LXX) for the Old Testament; Nestle-Aland 28th edition Greek New Testament (NA28) for the New Testament.',
  },
};

export default function TranslationComparisonClient() {
  const [selectedVerseId, setSelectedVerseId] = useState('joh-3-16');
  const [showDiffs, setShowDiffs] = useState(true);

  const currentIdx = FEATURED_VERSE_IDS.indexOf(selectedVerseId);
  const verse = SAMPLE_VERSES.find((v) => v.id === selectedVerseId);

  const goToPrev = () => {
    if (currentIdx > 0) setSelectedVerseId(FEATURED_VERSE_IDS[currentIdx - 1]);
  };
  const goToNext = () => {
    if (currentIdx < FEATURED_VERSE_IDS.length - 1) setSelectedVerseId(FEATURED_VERSE_IDS[currentIdx + 1]);
  };

  const diffs = KJV_NIV_DIFFS[selectedVerseId] || [];

  const getNote = (translation: TranslationKey) => {
    const notes = TRANSLATOR_NOTES[translation];
    return notes[selectedVerseId] || notes['default'];
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-1">Translation Comparison</h1>
          <p className="text-sm text-muted-foreground">
            View any verse side-by-side in KJV, NIV, Ancient Hebrew, and Ancient Greek with word-level analysis.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground cursor-pointer select-none">
            <div
              onClick={() => setShowDiffs((v) => !v)}
              className={`relative w-9 h-5 rounded-full transition-colors duration-200 cursor-pointer ${
                showDiffs ? 'bg-primary' : 'bg-muted border border-border'
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                  showDiffs ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </div>
            Highlight KJV/NIV differences
          </label>
        </div>
      </div>

      {/* Verse selector */}
      <VerseSelector
        selectedVerseId={selectedVerseId}
        onSelect={setSelectedVerseId}
        featuredVerseIds={FEATURED_VERSE_IDS}
        verses={SAMPLE_VERSES}
      />

      {/* Navigation */}
      {verse && (
        <div className="flex items-center justify-between">
          <button
            onClick={goToPrev}
            disabled={currentIdx === 0}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-md hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={15} />
            Previous verse
          </button>
          <div className="text-center">
            <p className="text-base font-semibold text-foreground">
              {verse.book} {verse.chapter}:{verse.verse}
            </p>
            <p className="text-xs text-muted-foreground">
              {currentIdx + 1} of {FEATURED_VERSE_IDS.length} featured verses
            </p>
          </div>
          <button
            onClick={goToNext}
            disabled={currentIdx === FEATURED_VERSE_IDS.length - 1}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-md hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next verse
            <ChevronRight size={15} />
          </button>
        </div>
      )}

      {/* Diff legend */}
      {showDiffs && diffs.length > 0 && (
        <DiffLegend diffs={diffs} />
      )}

      {/* Translation cards grid */}
      {verse ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
          {(['KJV', 'NIV', 'GNV', 'RSV', 'Hebrew', 'Greek'] as TranslationKey[]).map((translation) => (
            <TranslationCard
              key={`tc-${translation}`}
              translation={translation}
              text={verse.text[translation]}
              verseRef={`${verse.book} ${verse.chapter}:${verse.verse}`}
              note={getNote(translation)}
              diffs={showDiffs && (translation === 'KJV' || translation === 'NIV') ? diffs : []}
              highlightSide={translation === 'KJV' ? 'kjv' : translation === 'NIV' ? 'niv' : null}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <GitCompare size={36} className="text-muted-foreground/30 mb-3" />
          <p className="text-base font-semibold text-foreground mb-1">Select a verse to compare</p>
          <p className="text-sm text-muted-foreground">Choose from the featured verses above or enter a reference.</p>
        </div>
      )}

      {/* Quick links to adjacent tools */}
      {verse && (
        <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
          <span className="text-xs text-muted-foreground self-center">Continue studying:</span>
          <a
            href={`/bible-reader?book=${verse.bookAbbrev.toLowerCase()}&chapter=${verse.chapter}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
          >
            <BookOpen size={12} />
            Read full chapter
          </a>
          <a
            href={`/concordance?word=${verse.text.KJV.split(' ')[3] || 'love'}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-accent bg-accent/5 hover:bg-accent/10 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Info size={12} />
            Look up key word
          </a>
        </div>
      )}
    </div>
  );
}
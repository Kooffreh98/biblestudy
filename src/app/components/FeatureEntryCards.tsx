import React from 'react';
import Link from 'next/link';
import { BookOpen, Search, AlignLeft, GitCompare, Globe, BookMarked, ArrowRight } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const features = [
  {
    id: 'feature-read',
    icon: BookOpen,
    title: 'Bible Reader',
    description: 'Read any book, chapter, and verse with cross-references and commentary notes.',
    href: '/bible-reader',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    iconBg: 'bg-blue-100',
    cta: 'Start Reading',
  },
  {
    id: 'feature-search',
    icon: Search,
    title: 'AI-Powered Search',
    description: 'Find verses by keyword, theme, or concept using semantic search across all translations.',
    href: '/search',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    iconBg: 'bg-indigo-100',
    cta: 'Search Scripture',
  },
  {
    id: 'feature-concordance',
    icon: AlignLeft,
    title: 'Full Concordance',
    description: 'Trace any word through every occurrence in the Bible with Strong\'s numbers and original language roots.',
    href: '/concordance',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    iconBg: 'bg-amber-100',
    cta: 'Explore Words',
  },
  {
    id: 'feature-compare',
    icon: GitCompare,
    title: 'Translation Comparison',
    description: 'View KJV, NIV, Ancient Hebrew, and Ancient Greek side-by-side with word-level differences highlighted.',
    href: '/translation-comparison',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconBg: 'bg-emerald-100',
    cta: 'Compare Now',
  },
  {
    id: 'feature-hebrew',
    icon: Globe,
    title: 'Ancient Hebrew',
    description: 'Access the Masoretic Text with full Hebrew script, cantillation marks, and transliteration.',
    href: '/bible-reader?translation=Hebrew',
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    iconBg: 'bg-rose-100',
    cta: 'Read Hebrew',
  },
  {
    id: 'feature-greek',
    icon: BookMarked,
    title: 'Ancient Greek',
    description: 'Read the Septuagint (OT) and Greek New Testament with morphological parsing and lexicon links.',
    href: '/bible-reader?translation=Greek',
    color: 'bg-violet-50 text-violet-700 border-violet-200',
    iconBg: 'bg-violet-100',
    cta: 'Read Greek',
  },
];

export default function FeatureEntryCards() {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Study Tools</h2>
        <span className="text-xs text-muted-foreground">Free · No account required</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
        {features?.map((f) => {
          const Icon = f?.icon;
          return (
            <Link
              key={f?.id}
              href={f?.href}
              className={`group flex flex-col gap-3 p-5 rounded-xl border card-hover bg-card ${f?.color?.includes('border') ? '' : 'border-border'}`}
              style={{ borderColor: undefined }}
            >
              <div className={`w-9 h-9 rounded-lg ${f?.iconBg} flex items-center justify-center`}>
                <Icon size={18} className={f?.color?.split(' ')?.[1]} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground mb-1">{f?.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f?.description}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all duration-150">
                {f?.cta} <ArrowRight size={11} />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
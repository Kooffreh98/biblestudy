import React from 'react';
import Link from 'next/link';
import { ExternalLink, BookOpen, Info } from 'lucide-react';

interface CrossRefPanelProps {
  selectedVerse: number | null;
  crossRefs: string[];
  bookName: string;
  chapter: number;
}

const COMMENTARY_NOTES: Record<string, string> = {
  '16': 'Often called the "Gospel in miniature," this verse encapsulates the core message of redemption. The phrase "only begotten" (μονογενῆ in Greek) emphasizes the unique divine sonship of Christ.',
  '3': 'The phrase "born again" (γεγεννηθῇ ἄνωθεν) carries a dual meaning in Greek: "born from above" and "born anew," a wordplay central to the conversation with Nicodemus.',
  '17': 'Contrasts with a common misreading — the mission of Christ was restorative, not judicial. The word "condemn" (κρίνω) here means to render a formal verdict of judgment.',
  '30': 'A pivotal statement of Johannine theology on the relationship between John the Baptist and Jesus. The verb "decrease" (ἐλαττοῦσθαι) implies a gradual diminishing of role, not personhood.',
};

export default function CrossRefPanel({ selectedVerse, crossRefs, bookName, chapter }: CrossRefPanelProps) {
  const commentaryNote = selectedVerse ? COMMENTARY_NOTES[String(selectedVerse)] : null;

  return (
    <div className="h-full flex flex-col bg-background/50">
      <div className="px-4 py-3 border-b border-border shrink-0">
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
          Cross-References
        </h3>
        {selectedVerse && (
          <p className="text-xs text-muted-foreground mt-0.5 font-mono">
            {bookName} {chapter}:{selectedVerse}
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-4">
        {!selectedVerse ? (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <BookOpen size={24} className="text-muted-foreground/40 mb-2" />
            <p className="text-xs text-muted-foreground">
              Click any verse to see cross-references
            </p>
          </div>
        ) : (
          <>
            {/* Cross references */}
            {crossRefs.length > 0 ? (
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                  Parallel Passages
                </p>
                <div className="space-y-1">
                  {crossRefs.map((ref) => (
                    <Link
                      key={`xref-${ref}`}
                      href="/bible-reader"
                      className="flex items-center justify-between px-2.5 py-2 rounded-md bg-muted hover:bg-secondary hover:text-primary transition-colors text-xs font-medium text-foreground group"
                    >
                      <span>{ref}</span>
                      <ExternalLink size={10} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">No cross-references indexed for this verse.</p>
            )}

            {/* Commentary note */}
            {commentaryNote && (
              <div className="rounded-lg bg-accent/5 border border-accent/20 p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <Info size={12} className="text-accent" />
                  <p className="text-[10px] font-semibold text-accent uppercase tracking-widest">
                    Study Note
                  </p>
                </div>
                <p className="text-xs text-foreground leading-relaxed">{commentaryNote}</p>
              </div>
            )}

            {/* Translation comparison link */}
            <Link
              href={`/translation-comparison?chapter=${chapter}&verse=${selectedVerse}`}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-primary/20 bg-primary/5 text-primary text-xs font-semibold hover:bg-primary/10 transition-colors"
            >
              <ExternalLink size={12} />
              Compare in 4 translations
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
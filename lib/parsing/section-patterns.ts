import type { Section } from '../db/schema';

type SectionType = Section['type'];

// Ordered by specificity — more specific patterns first, so "Opening Hymn"
// matches hymn before a looser "opening" pattern could steal it.
export const SECTION_TYPE_PATTERNS: { type: SectionType; pattern: RegExp }[] = [
  { type: 'hymn', pattern: /\b(opening|closing|processional|recessional|entrance|offertory|communion)?\s*hymn\b/i },
  { type: 'psalm', pattern: /\bpsalm\b/i },
  { type: 'creed', pattern: /\b(apostles'?|nicene)\s*creed\b/i },
  { type: 'collect', pattern: /\bcollect\b/i },
  { type: 'reading', pattern: /\b(old testament|new testament|epistle|gospel|first lesson|second lesson|first reading|second reading)\b/i },
  { type: 'sermon', pattern: /\b(sermon|homily|message)\b/i },
  { type: 'benediction', pattern: /\b(benediction|blessing)\b/i },
  { type: 'welcome', pattern: /\b(welcome|call to worship|opening remarks|processional)\b/i },
];

export function matchSectionType(label: string): SectionType | null {
  for (const { type, pattern } of SECTION_TYPE_PATTERNS) {
    if (pattern.test(label)) return type;
  }
  return null;
}

// Matches "Isaiah 6:1-8", "1 Corinthians 13:4-7", "John 15:1"
const BIBLE_REF_PATTERN = /([1-3]?\s?[A-Za-z]+)\s+(\d+):(\d+)(?:-(\d+))?/;

export interface ParsedBibleRef {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
}

export function extractBibleReference(text: string): ParsedBibleRef | null {
  const match = text.match(BIBLE_REF_PATTERN);
  if (!match) return null;
  return {
    book: match[1].trim(),
    chapter: parseInt(match[2], 10),
    verseStart: parseInt(match[3], 10),
    verseEnd: match[4] ? parseInt(match[4], 10) : undefined,
  };
}

// Matches a standalone hymn number: "245", "Hymn 245", "Hymn No. 245"
const HYMN_NUMBER_PATTERN = /\b(\d{1,3})\b/;

export function extractHymnNumber(text: string): number | null {
  const match = text.match(HYMN_NUMBER_PATTERN);
  return match ? parseInt(match[1], 10) : null;
}
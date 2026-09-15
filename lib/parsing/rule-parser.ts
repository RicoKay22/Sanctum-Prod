import type { Section } from '../db/schema';
import { matchSectionType, extractBibleReference, extractHymnNumber } from './section-patterns';

export interface ParsedLine {
  section: Omit<Section, 'id' | 'programId' | 'order'>;
  confidence: number; // 1 = clean match, 0.5 = type matched but value unclear, 0 = unmatched
}

// Splits a programme line on its first colon, if present — this covers the
// common "Label: Value" shape seen in most church programmes (Part C1).
function splitLabelValue(line: string): { label: string; value: string } | null {
  const idx = line.indexOf(':');
  if (idx === -1) return null;
  return { label: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() };
}

export function parseLine(rawLine: string): ParsedLine | null {
  const line = rawLine.trim();
  if (!line) return null;

  const split = splitLabelValue(line);
  const label = split?.label ?? line;
  const value = split?.value ?? '';

  const type = matchSectionType(label);

  if (!type) {
    return {
      section: { type: 'other', title: line, resolved: false },
      confidence: 0,
    };
  }

  if (type === 'reading' || type === 'psalm') {
    const ref = extractBibleReference(value || line);
    return {
      section: {
        type,
        title: label,
        reference: ref ? `${ref.book} ${ref.chapter}:${ref.verseStart}${ref.verseEnd ? '-' + ref.verseEnd : ''}` : undefined,
        resolved: false,
      },
      confidence: ref ? 1 : 0.5,
    };
  }

  if (type === 'hymn') {
    const number = extractHymnNumber(value || line);
    return {
      section: {
        type,
        title: label,
        reference: number ? String(number) : undefined,
        resolved: false,
      },
      confidence: number ? 1 : 0.5,
    };
  }

  // creed, collect, sermon, benediction, welcome — value (if any) is the title/topic
  return {
    section: { type, title: value || label, resolved: false },
    confidence: 1,
  };
}

export function parseLines(rawText: string): ParsedLine[] {
  return rawText
    .split('\n')
    .map(parseLine)
    .filter((l): l is ParsedLine => l !== null);
}
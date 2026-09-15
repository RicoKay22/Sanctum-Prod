import type { Section } from '../db/schema';
import { matchSectionType, extractBibleReference, extractHymnNumber } from './section-patterns';

export interface ParsedLine {
  section: Omit<Section, 'id' | 'programId' | 'order'>;
  confidence: number;
}

function splitLabelValue(line: string): { label: string; value: string } | null {
  const idx = line.indexOf(':');
  if (idx === -1) return null;
  return { label: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() };
}

// Strips leading list markers: "12.", "a.", "iv.", "-", "•" — common in
// numbered/lettered/roman-numeral church programme sub-lists.
function stripListMarker(line: string): string {
  return line.replace(/^\s*(?:\d+\.|\(?[a-z]\)\.?|\(?[ivxlcdm]+\)\.?|[-–•])\s+/i, '').trim();
}

export function parseLines(rawText: string): ParsedLine[] {
  const rawLines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
  const results: ParsedLine[] = [];
  let i = 0;

  while (i < rawLines.length) {
    const line = stripListMarker(rawLines[i]);
    const split = splitLabelValue(line);
    const label = split?.label ?? line;
    const value = split?.value ?? '';
    const type = matchSectionType(label);

    if (!type) {
      results.push({ section: { type: 'other', title: line, resolved: false }, confidence: 0 });
      i++;
      continue;
    }

    if (type === 'reading' || type === 'psalm') {
      let ref = extractBibleReference(value || line);
      let consumedNext = false;
      if (!ref && i + 1 < rawLines.length) {
        const nextRef = extractBibleReference(stripListMarker(rawLines[i + 1]));
        if (nextRef) { ref = nextRef; consumedNext = true; }
      }
      results.push({
        section: {
          type,
          title: label,
          reference: ref ? `${ref.book} ${ref.chapter}:${ref.verseStart}${ref.verseEnd ? '-' + ref.verseEnd : ''}` : undefined,
          resolved: false,
        },
        confidence: ref ? 1 : 0.5,
      });
      i += consumedNext ? 2 : 1;
      continue;
    }

    if (type === 'hymn') {
      const number = extractHymnNumber(value || line);
      results.push({
        section: { type, title: label, reference: number ? String(number) : undefined, resolved: false },
        confidence: number ? 1 : 0.5,
      });
      i++;
      continue;
    }

    // creed / collect / sermon / benediction / welcome — absorb one
    // immediate description line if it doesn't look like its own new item.
    let title = value || label;
    let consumed = 1;
    if (!value && i + 1 < rawLines.length) {
      const nextRaw = rawLines[i + 1];
      const nextStripped = stripListMarker(nextRaw);
      const looksLikeNewItem = /^\d+\./.test(nextRaw);
      if (!looksLikeNewItem && !matchSectionType(nextStripped)) {
        title = nextStripped;
        consumed = 2;
      }
    }
    results.push({ section: { type, title, resolved: false }, confidence: 1 });
    i += consumed;
  }

  return results;
}
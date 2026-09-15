import type { Program, Section } from '../db/schema';
import { parseLines } from './rule-parser';

export interface ParseResult {
  sections: Section[];
  needsReview: number; // count of sections with confidence 0 — surfaced by Pre-Flight later (Part C4)
}

// Rule-based only for now. Low-confidence lines are kept as type 'other' /
// resolved: false rather than dropped, so nothing from the original
// programme silently disappears — Pre-Flight (Phase 7) surfaces these for
// manual fixing. An AI fallback slots in here in Round 2 without changing
// this function's signature.
export function parseServiceText(programId: Program['id'], rawText: string): ParseResult {
  const parsed = parseLines(rawText);

  const sections: Section[] = parsed.map((p, index) => ({
    id: crypto.randomUUID(),
    programId,
    order: index,
    ...p.section,
  }));

  const needsReview = parsed.filter((p) => p.confidence === 0).length;

  return { sections, needsReview };
}
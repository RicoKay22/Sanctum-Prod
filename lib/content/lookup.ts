import { db, type ContentItem } from '../db/schema';

// Offline-first lookup. Online fallback + save-to-library wiring comes
// in a later Phase 3 round (Part D's hybrid sourcing flow).

export async function lookupBible(
  key: string,
  translation: string
): Promise<ContentItem | undefined> {
  return db.contentLibrary.where({ type: 'bible', key, translation }).first();
}

export async function lookupHymnByNumber(
  hymnalEditionId: string,
  number: number
): Promise<ContentItem | undefined> {
  const numbering = await db.hymnNumbering
    .where('[hymnalEditionId+number]')
    .equals([hymnalEditionId, number])
    .first();

  if (!numbering) return undefined;
  return db.contentLibrary.get(numbering.contentId);
}

export async function lookupByKey(
  type: ContentItem['type'],
  key: string
): Promise<ContentItem | undefined> {
  return db.contentLibrary.where({ type, key }).first();
}
import { db, type ContentItem } from '../db/schema';
import { saveToLibrary } from './save-to-library';
import { referenceToKey, referenceToDisplay, referenceToApiPath, type BibleReference } from './bible-reference';

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

// Offline-first, online-fallback Bible resolution. Bundled/previously-fetched
// verses resolve instantly and never touch the network.
export async function resolveBibleVerse(
  ref: BibleReference,
  translation: 'KJV' | 'WEB'
): Promise<{ item: ContentItem; wasFetched: boolean } | undefined> {
  const key = referenceToKey(ref);

  const local = await lookupBible(key, translation);
  if (local) return { item: local, wasFetched: false };

  try {
    const res = await fetch(
      `https://bible-api.com/${referenceToApiPath(ref)}?translation=${translation.toLowerCase()}`
    );
    if (!res.ok) return undefined;

    const data = await res.json();
    if (!data?.text) return undefined;

    const saved = await saveToLibrary({
      type: 'bible',
      key,
      translation,
      title: referenceToDisplay(ref),
      body: data.text.trim(),
      source: 'fetched',
    });

    return { item: saved, wasFetched: true };
  } catch {
    // Offline or API unreachable — caller shows "not found" per Pre-Flight rules.
    return undefined;
  }
}
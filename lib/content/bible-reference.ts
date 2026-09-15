export interface BibleReference {
  book: string;       // 'John'
  chapter: number;    // 3
  verseStart: number; // 16
  verseEnd?: number;  // optional, for ranges like 16-18
}

export function referenceToKey(ref: BibleReference): string {
  const range = ref.verseEnd ? `${ref.verseStart}-${ref.verseEnd}` : `${ref.verseStart}`;
  return `${ref.book}-${ref.chapter}-${range}`
    .toLowerCase()
    .replace(/\s+/g, '-');
}

export function referenceToDisplay(ref: BibleReference): string {
  const range = ref.verseEnd ? `${ref.verseStart}-${ref.verseEnd}` : `${ref.verseStart}`;
  return `${ref.book} ${ref.chapter}:${range}`;
}

export function referenceToApiPath(ref: BibleReference): string {
  const range = ref.verseEnd ? `${ref.verseStart}-${ref.verseEnd}` : `${ref.verseStart}`;
  return `${ref.book.replace(/\s+/g, '+')}+${ref.chapter}:${range}`;
}
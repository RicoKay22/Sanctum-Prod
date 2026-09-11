import Dexie, { type Table } from 'dexie';

// Local mirror of a Sunday's programme. Kept in sync with Supabase's
// `programs` table when online; usable entirely offline when not.
export interface Program {
  id: string;
  workspaceId: string;
  title: string;
  serviceDate: string; // ISO date
  status: 'draft' | 'ready' | 'generated';
  createdAt: string;
  expiresAt: string; // createdAt + 30 days — Master Doc temp storage rule
}

// One order-of-service item within a Program (a hymn, a reading, a
// collect, etc.) — the unit the Service Intelligence Engine produces.
export interface Section {
  id: string;
  programId: string;
  order: number;
  type: 'welcome' | 'hymn' | 'reading' | 'psalm' | 'creed' | 'collect' | 'sermon' | 'benediction' | 'other';
  title: string;
  reference?: string; // e.g. "Romans 12:1-2" or hymn number "245"
  resolvedContentId?: string; // FK into contentLibrary once looked up
  resolved: boolean; // drives the Pre-Flight warning list
}

// Local mirror of the shared Bible/hymnal/collects/creed library.
export interface ContentItem {
  id: string;
  type: 'bible' | 'hymn' | 'collect' | 'creed';
  key: string; // e.g. "romans-12-1-2" or "hymn-245"
  title: string;
  body: string;
  source: 'bundled' | 'fetched'; // hybrid sourcing per Part D
  updatedAt: string;
}

// A generated .pptx, cached locally for the 30-day window before purge.
export interface Deck {
  id: string;
  programId: string;
  fileBlob: Blob;
  sizeBytes: number;
  createdAt: string;
  expiresAt: string;
}

class SanctumDB extends Dexie {
  programs!: Table<Program, string>;
  sections!: Table<Section, string>;
  contentLibrary!: Table<ContentItem, string>;
  decks!: Table<Deck, string>;

  constructor() {
    super('SanctumDB');
    this.version(1).stores({
      programs: 'id, workspaceId, serviceDate, expiresAt',
      sections: 'id, programId, order, resolved',
      contentLibrary: 'id, type, key',
      decks: 'id, programId, expiresAt',
    });
  }
}

export const db = new SanctumDB();

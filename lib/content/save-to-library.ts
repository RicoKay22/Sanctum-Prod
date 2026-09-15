import { createClient } from '../supabase/client';
import { db, type ContentItem } from '../db/schema';

type NewContentItem = Omit<ContentItem, 'id' | 'updatedAt'>;

// Saves a resolved item to both Supabase (shared, for every church using
// Sanctum) and the local Dexie mirror (instant offline reuse this session).
// RLS already permits this — insert is allowed where source = 'fetched'.
export async function saveToLibrary(item: NewContentItem): Promise<ContentItem> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('content_library')
    .upsert(
      {
        type: item.type,
        key: item.key,
        translation: item.translation ?? null,
        title: item.title,
        body: item.body,
        source: item.source,
      },
      { onConflict: 'type,key,translation' }
    )
    .select()
    .single();

  if (error) throw error;

  const saved: ContentItem = {
    id: data.id,
     type: data.type as ContentItem['type'],
    key: data.key,
    translation: data.translation ?? undefined,
    title: data.title,
    body: data.body,
    source: data.source as ContentItem['source'],
    updatedAt: data.updated_at,
  };

  await db.contentLibrary.put(saved);
  return saved;
}
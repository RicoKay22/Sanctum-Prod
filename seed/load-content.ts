// One-time seed loader. Run with: npx tsx seed/load-content.ts
// Requires SUPABASE_SERVICE_ROLE_KEY in .env.local (server-side only, never expose to client).

import { config } from 'dotenv';
config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import contentSeed from './content-library.seed.json';
import hymnalEditionsSeed from './hymnal-editions.seed.json';
import hymnNumberingSeed from './hymn-numbering.seed.json';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function run() {
  console.log('Seeding content_library...');
  const { data: content, error: contentErr } = await supabase
    .from('content_library')
    .upsert(contentSeed, { onConflict: 'type,key,translation' })
    .select();
  if (contentErr) throw contentErr;
  console.log(`  ${content?.length ?? 0} rows upserted.`);

  console.log('Seeding hymnal_editions...');
  const { data: editions, error: editionsErr } = await supabase
    .from('hymnal_editions')
    .upsert(hymnalEditionsSeed, { onConflict: 'name' })
    .select();
  if (editionsErr) throw editionsErr;
  console.log(`  ${editions?.length ?? 0} rows upserted.`);

  console.log('Seeding hymn_numbering...');
  for (const row of hymnNumberingSeed) {
    const edition = editions?.find((e) => e.name === row.hymnalName);
    const contentItem = content?.find((c) => c.key === row.contentKey);
    if (!edition || !contentItem) {
      console.warn(`  Skipped: ${row.hymnalName} #${row.number} — missing reference.`);
      continue;
    }
    const { error } = await supabase
      .from('hymn_numbering')
      .upsert(
        { hymnal_edition_id: edition.id, number: row.number, content_id: contentItem.id },
        { onConflict: 'hymnal_edition_id,number' }
      );
    if (error) throw error;
  }
  console.log('Done.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
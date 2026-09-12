import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../db/types';

// Used in Client Components — runs in the browser. Returns a fresh client
// bound to cookies, so its session stays in sync with the server-side
// clients in server.ts and proxy.ts, per Supabase's current SSR pattern.
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

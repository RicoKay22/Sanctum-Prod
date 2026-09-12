import { createBrowserClient } from '@supabase/ssr';

// Used in Client Components — runs in the browser. Returns a fresh client
// bound to cookies, so its session stays in sync with the server-side
// clients in server.ts and proxy.ts, per Supabase's current SSR pattern.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

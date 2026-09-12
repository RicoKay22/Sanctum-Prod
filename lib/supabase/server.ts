import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '../db/types';

// Used in Server Components, Server Actions, and Route Handlers — runs
// only on the server. `setAll` is wrapped in try/catch because Server
// Components can't write cookies (a Next.js restriction) — that's safe
// to ignore here because the Proxy (lib/supabase/proxy.ts) already
// refreshes the session on every request before this ever runs.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — see comment above.
          }
        },
      },
    }
  );
}

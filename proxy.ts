import { type NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/proxy';

// Next.js 16 renamed "Middleware" to "Proxy" — this runs on every matched
// request before it reaches a route, keeping the Supabase session cookie
// fresh. Using a relative import here since no `@/*` path alias is
// configured in tsconfig.json yet (deliberately deferred, not an oversight).
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

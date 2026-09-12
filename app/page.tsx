import { redirect } from 'next/navigation';
import { createClient } from '../lib/supabase/server';

// The static design-system mockup that used to live here served its
// purpose in Phase 1 (visually confirming the token system worked) but
// has no place as the real entry point. Signed-in users should never see
// a marketing/demo page instead of their own dashboard, and signed-out
// users should be sent straight to sign in — not left guessing that
// /login exists.
export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (data?.claims) {
    redirect('/dashboard');
  }

  redirect('/login');
}

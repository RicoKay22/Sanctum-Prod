import { type EmailOtpType } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { type NextRequest } from 'next/server';
import { createClient } from '../../../lib/supabase/server';

// Handles the actual link a user clicks in a password-reset (or other
// email-confirmation) email. Uses verifyOtp() with a token_hash rather
// than exchangeCodeForSession() with a code — the code+PKCE flow depends
// on a "code verifier" cookie from the same browser session that
// requested the email, which is routinely absent when the link is
// opened in a different tab. token_hash has no such dependency.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/dashboard';

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      redirect(next);
    }
  }

  redirect('/login?error=' + encodeURIComponent('That link is invalid or has expired'));
}

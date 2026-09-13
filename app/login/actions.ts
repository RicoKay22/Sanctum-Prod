'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createClient } from '../../lib/supabase/server';
import { isPasswordLeaked, MIN_PASSWORD_LENGTH } from '../../lib/validation/password';

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect('/dashboard');
}

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (password.length < MIN_PASSWORD_LENGTH) {
    redirect(
      `/login?error=${encodeURIComponent(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`)}`
    );
  }

  if (await isPasswordLeaked(password)) {
    redirect(
      `/login?error=${encodeURIComponent('That password has appeared in a known data breach. Please choose a different one.')}`
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect('/login?message=Check your email to confirm your account');
}

export async function resetPassword(formData: FormData) {
  const email = formData.get('email') as string;
  const supabase = await createClient();

  // Derive the current origin from request headers rather than a
  // hardcoded env var — works automatically across localhost, every
  // Vercel preview URL, and production without extra configuration.
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') ?? (host?.includes('localhost') ? 'http' : 'https');
  const redirectTo = `${protocol}://${host}/reset-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect('/login?message=Check your email for a password reset link');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

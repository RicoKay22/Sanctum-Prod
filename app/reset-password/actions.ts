'use server';

import { redirect } from 'next/navigation';
import { createClient } from '../../lib/supabase/server';
import { isPasswordLeaked, MIN_PASSWORD_LENGTH } from '../../lib/validation/password';

export async function updatePassword(formData: FormData) {
  const password = formData.get('password') as string;

  if (password.length < MIN_PASSWORD_LENGTH) {
    redirect(
      `/reset-password?error=${encodeURIComponent(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`)}`
    );
  }

  if (await isPasswordLeaked(password)) {
    redirect(
      `/reset-password?error=${encodeURIComponent('That password has appeared in a known data breach. Please choose a different one.')}`
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/reset-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect('/dashboard');
}

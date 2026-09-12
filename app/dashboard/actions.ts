'use server';

import { redirect } from 'next/navigation';
import { createClient } from '../../lib/supabase/server';

export async function createWorkspace(formData: FormData) {
  const name = formData.get('name') as string;
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getClaims();
  const userId = userData?.claims?.sub;

  if (!userId) {
    redirect('/login');
  }

  // Single atomic operation — see create_workspace_with_admin() in the
  // SQL. This replaces the old two-step insert (workspace, then
  // membership), which hit a real RLS ordering problem: Supabase's
  // .insert().select() reads the new row back immediately, and that
  // read is gated by the SELECT policy — which requires membership
  // that doesn't exist yet at that point. The RPC does both inserts
  // server-side under one transaction, sidestepping the issue entirely.
  const { error } = await supabase.rpc('create_workspace_with_admin', {
    _name: name,
  });

  if (error) {
    redirect(`/dashboard?error=${encodeURIComponent(error.message)}`);
  }

  redirect('/dashboard');
}

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

  const { data: workspace, error: workspaceError } = await supabase
    .from('workspaces')
    .insert({ name })
    .select()
    .single();

  if (workspaceError || !workspace) {
    redirect(
      `/dashboard?error=${encodeURIComponent(workspaceError?.message ?? 'Could not create workspace')}`
    );
  }

  const { error: memberError } = await supabase
    .from('workspace_members')
    .insert({ workspace_id: workspace.id, user_id: userId, role: 'admin' });

  if (memberError) {
    redirect(`/dashboard?error=${encodeURIComponent(memberError.message)}`);
  }

  redirect('/dashboard');
}

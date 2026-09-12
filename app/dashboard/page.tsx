import { createClient } from '../../lib/supabase/server';
import { createWorkspace } from './actions';
import { signOut } from '../login/actions';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getClaims();
  const userId = userData?.claims?.sub;
  const email = userData?.claims?.email as string | undefined;

  // NOTE: `workspaces(name)` is Supabase's embedded-relation syntax, off
  // the workspace_members -> workspaces foreign key from Round 1's SQL.
  // Correctly typed via the `Database` generic in lib/supabase/server.ts —
  // requires lib/db/types.ts to exist (generated via `supabase gen types
  // typescript`). If this file is missing, this query falls back to `any`
  // and TypeScript won't catch typos here — regenerate it, don't re-add a cast.
  const { data: memberships } = await supabase
    .from('workspace_members')
    .select('workspace_id, role, workspaces(name)')
    .eq('user_id', userId);

  const workspace = memberships?.[0];

  if (!workspace) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="w-full max-w-sm">
          <h1 className="mb-1 font-serif text-2xl text-text-primary">Welcome, {email}</h1>
          <p className="mb-6 font-sans text-sm text-text-muted">
            Create your church&apos;s workspace to get started.
          </p>

          {params.error && (
            <p className="mb-4 rounded-sm bg-surface p-3 font-sans text-sm text-primary">
              {params.error}
            </p>
          )}

          <form className="flex flex-col gap-3 font-sans text-sm">
            <input
              name="name"
              type="text"
              placeholder="Church or workspace name"
              required
              className="rounded-sm border border-text-muted/30 bg-surface px-3 py-2 text-text-primary outline-none focus:border-primary"
            />
            <button
              formAction={createWorkspace}
              className="rounded-sm bg-primary px-4 py-2 text-background"
            >
              Create workspace
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-text-primary">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl">{workspace.workspaces?.name}</h1>
            <p className="font-sans text-sm text-text-muted">
              Signed in as {email} · {workspace.role}
            </p>
          </div>
          <form action={signOut}>
            <button className="font-sans text-sm text-text-muted underline">Sign out</button>
          </form>
        </header>

        <p className="font-sans text-sm text-text-muted">
          Sunday programme builder coming in Phase 3–5.
        </p>
      </div>
    </main>
  );
}

import { createClient } from '../../lib/supabase/server';
import { createWorkspace } from './actions';
import { signOut } from '../login/actions';
import { AuthCard } from '../../components/AuthCard';
import { SubmitButton } from '../../components/SubmitButton';
import { ThemeToggle } from '../../components/ThemeToggle';

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

  const { data: memberships } = await supabase
    .from('workspace_members')
    .select('workspace_id, role, workspaces(name)')
    .eq('user_id', userId);

  const workspace = memberships?.[0];

  if (!workspace) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-background px-6">
        <div className="absolute right-6 top-6">
          <ThemeToggle />
        </div>

        <AuthCard>
          <h1 className="mb-1 font-serif text-2xl text-text-primary">Welcome, {email}</h1>
          <p className="mb-6 font-sans text-sm text-text-muted">
            Create your church&apos;s workspace to get started.
          </p>

          {params.error && (
            <p className="mb-4 rounded-sm bg-background p-3 font-sans text-sm text-primary">
              {params.error}
            </p>
          )}

          <form className="flex flex-col gap-3 font-sans text-sm">
            <input
              name="name"
              type="text"
              placeholder="Church or workspace name"
              required
              className="rounded-sm border border-text-muted/30 bg-background px-3 py-2 text-text-primary outline-none transition-colors duration-200 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/40"
            />
            <SubmitButton
              formAction={createWorkspace}
              pendingText="Creating…"
              className="rounded-sm bg-primary px-4 py-2 text-background"
            >
              Create workspace
            </SubmitButton>
          </form>
        </AuthCard>
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
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <form action={signOut}>
              <button className="font-sans text-sm text-text-muted underline decoration-text-muted/40 transition-colors duration-200 hover:text-accent">
                Sign out
              </button>
            </form>
          </div>
        </header>

        <p className="animate-fade-in font-sans text-sm text-text-muted">
          Sunday programme builder coming in Phase 3–5.
        </p>
      </div>
    </main>
  );
}

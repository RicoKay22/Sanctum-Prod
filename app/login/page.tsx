import { signIn, signUp } from './actions';
import { AuthCard } from '../../components/AuthCard';
import { SubmitButton } from '../../components/SubmitButton';
import { ThemeToggle } from '../../components/ThemeToggle';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-6">
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>

      <AuthCard>
        <h1 className="mb-1 font-serif text-2xl text-text-primary">Sanctum</h1>
        <p className="mb-6 font-sans text-sm text-text-muted">Sign in to your church workspace</p>

        {params.message && (
          <p className="mb-4 rounded-sm bg-background p-3 font-sans text-sm text-text-primary">
            {params.message}
          </p>
        )}
        {params.error && (
          <p className="mb-4 rounded-sm bg-background p-3 font-sans text-sm text-primary">
            {params.error}
          </p>
        )}

        <form className="flex flex-col gap-3 font-sans text-sm">
          <input
            name="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            required
            className="rounded-sm border border-text-muted/30 bg-background px-3 py-2 text-text-primary outline-none transition-colors duration-200 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/40"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            required
            minLength={8}
            className="rounded-sm border border-text-muted/30 bg-background px-3 py-2 text-text-primary outline-none transition-colors duration-200 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/40"
          />

          <div className="flex justify-end">
            <a
              href="/forgot-password"
              className="font-sans text-xs text-text-muted underline decoration-text-muted/40 transition-colors duration-200 hover:text-accent"
            >
              Forgot password?
            </a>
          </div>

          <SubmitButton
            formAction={signIn}
            pendingText="Signing in…"
            className="rounded-sm bg-primary px-4 py-2 text-background"
          >
            Sign in
          </SubmitButton>
          <SubmitButton
            formAction={signUp}
            pendingText="Creating account…"
            className="rounded-sm border border-primary px-4 py-2 text-primary"
          >
            Create an account
          </SubmitButton>
        </form>
      </AuthCard>
    </main>
  );
}

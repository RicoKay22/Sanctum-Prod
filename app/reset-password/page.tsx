import { updatePassword } from './actions';
import { AuthCard } from '../../components/AuthCard';
import { SubmitButton } from '../../components/SubmitButton';

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <AuthCard>
        <h1 className="mb-1 font-serif text-2xl text-text-primary">Set a new password</h1>
        <p className="mb-6 font-sans text-sm text-text-muted">
          Choose a new password — at least 8 characters.
        </p>

        {params.error && (
          <p className="mb-4 rounded-sm bg-background p-3 font-sans text-sm text-primary">
            {params.error}
          </p>
        )}

        <form className="flex flex-col gap-3 font-sans text-sm">
          <input
            name="password"
            type="password"
            placeholder="New password"
            autoComplete="new-password"
            required
            minLength={8}
            className="rounded-sm border border-text-muted/30 bg-background px-3 py-2 text-text-primary outline-none transition-colors duration-200 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/40"
          />
          <SubmitButton
            formAction={updatePassword}
            pendingText="Updating…"
            className="rounded-sm bg-primary px-4 py-2 text-background"
          >
            Update password
          </SubmitButton>
        </form>
      </AuthCard>
    </main>
  );
}

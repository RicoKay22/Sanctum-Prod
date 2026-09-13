import { resetPassword } from '../login/actions';
import { AuthCard } from '../../components/AuthCard';
import { SubmitButton } from '../../components/SubmitButton';

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <AuthCard>
        <h1 className="mb-1 font-serif text-2xl text-text-primary">Reset your password</h1>
        <p className="mb-6 font-sans text-sm text-text-muted">
          Enter your email and we&apos;ll send you a reset link.
        </p>

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
          <SubmitButton
            formAction={resetPassword}
            pendingText="Sending…"
            className="rounded-sm bg-primary px-4 py-2 text-background"
          >
            Send reset link
          </SubmitButton>
        </form>

        <a
          href="/login"
          className="mt-4 inline-block font-sans text-xs text-text-muted underline decoration-text-muted/40 transition-colors duration-200 hover:text-accent"
        >
          Back to sign in
        </a>
      </AuthCard>
    </main>
  );
}

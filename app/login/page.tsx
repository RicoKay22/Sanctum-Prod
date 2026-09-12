import { signIn, signUp } from './actions';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 font-serif text-2xl text-text-primary">Sanctum</h1>
        <p className="mb-6 font-sans text-sm text-text-muted">
          Sign in to your church workspace
        </p>

        {params.message && (
          <p className="mb-4 rounded-sm bg-surface p-3 font-sans text-sm text-text-primary">
            {params.message}
          </p>
        )}
        {params.error && (
          <p className="mb-4 rounded-sm bg-surface p-3 font-sans text-sm text-primary">
            {params.error}
          </p>
        )}

        <form className="flex flex-col gap-3 font-sans text-sm">
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="rounded-sm border border-text-muted/30 bg-surface px-3 py-2 text-text-primary outline-none focus:border-primary"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            minLength={6}
            className="rounded-sm border border-text-muted/30 bg-surface px-3 py-2 text-text-primary outline-none focus:border-primary"
          />

          <button formAction={signIn} className="rounded-sm bg-primary px-4 py-2 text-background">
            Sign in
          </button>
          <button
            formAction={signUp}
            className="rounded-sm border border-primary px-4 py-2 text-primary"
          >
            Create an account
          </button>
        </form>
      </div>
    </main>
  );
}

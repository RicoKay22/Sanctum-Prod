export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fade-in w-full max-w-sm rounded-md border border-text-muted/20 bg-surface p-8 shadow-lg shadow-black/5">
      {children}
    </div>
  );
}

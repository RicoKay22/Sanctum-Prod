'use client';

import { useFormStatus } from 'react-dom';

// Login has two submit buttons in one form (sign in / create account).
// useFormStatus's `action` field lets us tell precisely which one is
// actually pending, rather than both showing a loading state at once.
export function SubmitButton({
  formAction,
  children,
  pendingText,
  className,
}: {
  formAction: (formData: FormData) => void | Promise<void>;
  children: React.ReactNode;
  pendingText: string;
  className?: string;
}) {
  const { pending, action } = useFormStatus();
  const isThisPending = pending && action === formAction;

  return (
    <button
      type="submit"
      formAction={formAction}
      disabled={pending}
      className={`${className} transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {isThisPending ? pendingText : children}
    </button>
  );
}

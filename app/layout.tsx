import type { Metadata } from 'next';
import { Source_Serif_4, Inter } from 'next/font/google';
import './globals.css';

// Names here match the --font-serif / --font-sans variables read in
// globals.css and tailwind.config.ts — single source of truth (Rule 17).
const serif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sanctum',
  description: 'Prepare an entire Sunday service presentation from the programme you already have.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Theme toggle UI comes in Phase 2 — for now, default to the visitor's
  // system preference so dark mode isn't dead code sitting unused.
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <head>
        <script
          // Runs before paint to avoid a light-mode flash for dark-mode users.
          dangerouslySetInnerHTML={{
            __html: `
              if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('dark');
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

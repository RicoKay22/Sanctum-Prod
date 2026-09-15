'use client';

import { useState } from 'react';
import { extractText } from '../../../lib/parsing/extract-text';
import { createProgramFromText } from '../../../lib/parsing/create-program';
import type { Section } from '../../../lib/db/schema';

// Round 2 test harness — a real, working upload flow. UI polish and the
// "not found — add it" hymn form come in Phase 5; this round's job is
// proving extraction + parsing actually work end to end on real files.
export default function UploadPage() {
  const [status, setStatus] = useState<'idle' | 'extracting' | 'parsing' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [sections, setSections] = useState<Section[]>([]);
  const [needsReview, setNeedsReview] = useState(0);

  async function handleFile(file: File) {
    setStatus('extracting');
    setErrorMsg('');
    try {
      const text = await extractText(file);
      setStatus('parsing');

      // Placeholder workspaceId until Phase 5 wires this to the real
      // signed-in workspace — this round is testing extraction/parsing only.
      const { result } = await createProgramFromText('test-workspace', file.name, text);
      setSections(result.sections);
      setNeedsReview(result.needsReview);
      setStatus('done');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
      setStatus('error');
    }
  }

  return (
    <main style={{ padding: '2rem', maxWidth: 720 }}>
      <h1 style={{ fontFamily: 'var(--font-serif)' }}>Upload a programme</h1>
      <p style={{ color: 'var(--text-muted)' }}>
        PDF, JPEG, PNG, or plain text — max 10MB. Round 2 test harness.
      </p>

      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.txt"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        disabled={status === 'extracting' || status === 'parsing'}
      />

      {status === 'extracting' && <p>Extracting text…</p>}
      {status === 'parsing' && <p>Parsing service structure…</p>}
      {status === 'error' && <p style={{ color: 'var(--primary)' }}>{errorMsg}</p>}

      {status === 'done' && (
        <>
          <p style={{ marginTop: '1.5rem' }}>
            {sections.length} sections found
            {needsReview > 0 && ` — ${needsReview} need review`}
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <tbody>
              {sections.map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--text-muted)' }}>
                  <td style={{ padding: '0.5rem' }}>{s.order + 1}</td>
                  <td style={{ padding: '0.5rem', fontWeight: s.type === 'other' ? 'normal' : 'bold' }}>
                    {s.type}
                  </td>
                  <td style={{ padding: '0.5rem' }}>{s.title}</td>
                  <td style={{ padding: '0.5rem', color: 'var(--text-muted)' }}>{s.reference ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </main>
  );
}
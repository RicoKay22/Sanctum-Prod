// Password rules follow NIST SP 800-63B Revision 4 (finalized 2025) —
// the current U.S. federal digital identity standard. It explicitly
// states systems "shall not" require uppercase/number/symbol
// composition: those rules produce predictable patterns (Password1!)
// that are cracked faster, not slower. What actually matters is length
// and checking against known-breached passwords.
// Reference: https://pages.nist.gov/800-63-4/sp800-63b.html

export const MIN_PASSWORD_LENGTH = 8;
export const RECOMMENDED_PASSWORD_LENGTH = 12;

export function getPasswordStrength(password: string): 'too-short' | 'okay' | 'strong' {
  if (password.length < MIN_PASSWORD_LENGTH) return 'too-short';
  if (password.length < RECOMMENDED_PASSWORD_LENGTH) return 'okay';
  return 'strong';
}

// Checks a password against HaveIBeenPwned's Pwned Passwords API using
// k-anonymity: only the first 5 characters of the SHA-1 hash are ever
// sent over the network, so the real password never leaves this server.
// Free, public, no API key required.
export async function isPasswordLeaked(password: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();

  const prefix = hashHex.slice(0, 5);
  const suffix = hashHex.slice(5);

  const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  if (!response.ok) {
    // Fail open if the third-party service is down — length requirements
    // still apply regardless; we don't want a breach-check outage to
    // lock everyone out of signing up.
    return false;
  }

  const text = await response.text();
  return text.split('\n').some((line) => line.startsWith(suffix));
}

import { describe, it, expect } from 'vitest';
import { isLikelySpam } from '../forms.js';

describe('isLikelySpam', () => {
  it('flags as spam when the honeypot field is filled', () => {
    expect(isLikelySpam({ honeypot: 'bot-filled-this', elapsedMs: 5000 })).toBe(true);
  });
  it('flags as spam when submitted too fast (<3s)', () => {
    expect(isLikelySpam({ honeypot: '', elapsedMs: 1000 })).toBe(true);
  });
  it('does not flag a normal human submission', () => {
    expect(isLikelySpam({ honeypot: '', elapsedMs: 8000 })).toBe(false);
  });
});

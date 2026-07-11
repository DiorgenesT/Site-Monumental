import { describe, it, expect } from 'vitest';
import { shouldShowBanner } from '../cookie-banner.js';

describe('shouldShowBanner', () => {
  it('returns true when there is no stored consent', () => {
    expect(shouldShowBanner(null)).toBe(true);
  });
  it('returns false when consent was accepted', () => {
    expect(shouldShowBanner('accepted')).toBe(false);
  });
  it('returns false when consent was declined', () => {
    expect(shouldShowBanner('declined')).toBe(false);
  });
});

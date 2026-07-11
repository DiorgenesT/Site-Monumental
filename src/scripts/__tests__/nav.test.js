import { describe, it, expect } from 'vitest';
import { getHeaderState } from '../nav.js';

describe('getHeaderState', () => {
  it('returns "top" when scrollY is 0', () => {
    expect(getHeaderState(0)).toBe('top');
  });
  it('returns "scrolled" when scrollY is greater than threshold', () => {
    expect(getHeaderState(80)).toBe('scrolled');
  });
  it('uses a 40px threshold', () => {
    expect(getHeaderState(39)).toBe('top');
    expect(getHeaderState(41)).toBe('scrolled');
  });
});

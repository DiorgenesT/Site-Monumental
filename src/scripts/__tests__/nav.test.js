import { describe, it, expect } from 'vitest';
import { getHeaderState, nextMenuOpenState } from '../nav.js';

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

describe('nextMenuOpenState', () => {
  it('opens when closed', () => {
    expect(nextMenuOpenState(false)).toBe(true);
  });
  it('closes when open', () => {
    expect(nextMenuOpenState(true)).toBe(false);
  });
});

import { describe, it, expect } from 'vitest';
import { shouldAnimate } from '../reveal.js';

describe('shouldAnimate', () => {
  it('returns false when the user prefers reduced motion', () => {
    expect(shouldAnimate({ matches: true })).toBe(false);
  });
  it('returns true when the user has no motion preference', () => {
    expect(shouldAnimate({ matches: false })).toBe(true);
  });
  it('defaults to true when no media query result is given', () => {
    expect(shouldAnimate()).toBe(true);
  });
});

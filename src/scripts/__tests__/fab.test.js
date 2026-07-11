import { describe, it, expect } from 'vitest';
import { toggleFabState } from '../fab.js';

describe('toggleFabState', () => {
  it('opens when closed', () => {
    expect(toggleFabState(false)).toBe(true);
  });
  it('closes when open', () => {
    expect(toggleFabState(true)).toBe(false);
  });
});

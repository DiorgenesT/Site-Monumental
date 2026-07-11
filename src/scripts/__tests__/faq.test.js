import { describe, it, expect } from 'vitest';
import { toggleFaqState } from '../faq.js';

describe('toggleFaqState', () => {
  it('opens a closed item and closes the rest', () => {
    const state = { openIndex: null };
    const next = toggleFaqState(state, 2);
    expect(next.openIndex).toBe(2);
  });
  it('closes an already-open item when clicked again', () => {
    const state = { openIndex: 2 };
    const next = toggleFaqState(state, 2);
    expect(next.openIndex).toBe(null);
  });
});

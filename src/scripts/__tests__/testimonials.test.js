import { describe, it, expect } from 'vitest';
import { nextIndex, prevIndex } from '../testimonials.js';

describe('testimonial index wrap-around', () => {
  it('wraps to 0 after the last item on next', () => {
    expect(nextIndex(2, 3)).toBe(0);
  });
  it('wraps to the last item before the first on prev', () => {
    expect(prevIndex(0, 3)).toBe(2);
  });
  it('moves forward/backward normally within bounds', () => {
    expect(nextIndex(0, 3)).toBe(1);
    expect(prevIndex(1, 3)).toBe(0);
  });
});

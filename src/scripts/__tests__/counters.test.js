import { describe, it, expect } from 'vitest';
import { computeCounterFrames } from '../counters.js';

describe('computeCounterFrames', () => {
  it('generates frames from 0 to target inclusive', () => {
    const frames = computeCounterFrames(5, 5);
    expect(frames[0]).toBe(0);
    expect(frames[frames.length - 1]).toBe(5);
  });
  it('never exceeds the requested frame count', () => {
    const frames = computeCounterFrames(100, 10);
    expect(frames.length).toBeLessThanOrEqual(11);
  });
});

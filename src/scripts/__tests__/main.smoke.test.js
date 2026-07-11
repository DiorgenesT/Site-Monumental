import { describe, it, expect } from 'vitest';

describe('main.js entry', () => {
  it('exports an init function', async () => {
    const mod = await import('../main.js');
    expect(typeof mod.initSite).toBe('function');
  });
});

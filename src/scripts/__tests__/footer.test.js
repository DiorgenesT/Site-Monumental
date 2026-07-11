import { describe, it, expect } from 'vitest';
import { getCopyrightYear } from '../footer.js';

describe('getCopyrightYear', () => {
  it('returns the year of the given date', () => {
    expect(getCopyrightYear(new Date('2027-03-01'))).toBe(2027);
  });
  it('defaults to the current year when no date is passed', () => {
    expect(getCopyrightYear()).toBe(new Date().getFullYear());
  });
});

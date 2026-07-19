import { describe, expect, it } from 'vitest';
import { reboundScore } from './game';

describe('reboundScore', () => {
  it('returns 10 points per bounce', () => {
    expect(reboundScore(3)).toBe(30);
  });
});

import { describe, expect, it } from 'vitest'
import { applyBounce } from './game'

describe('applyBounce', () => {
  it('multiplies velocity by bounce multiplier', () => {
    expect(applyBounce(10, 0.8)).toBe(8)
  })
})

import { describe, it, expect } from 'vitest'
import { calculatePoints, calculateStars } from '../engine/sessionScorer'

describe('calculatePoints', () => {
  it('returns 10 base points for first correct answer with no streak', () => {
    expect(calculatePoints(0, 5000, null, 0)).toBe(10)
  })

  it('applies x1.5 multiplier at streak 3', () => {
    expect(calculatePoints(3, 5000, null, 0)).toBe(15)
  })

  it('applies x2.0 multiplier at streak 6', () => {
    expect(calculatePoints(6, 5000, null, 0)).toBe(20)
  })

  it('applies x2.5 multiplier at streak 9', () => {
    expect(calculatePoints(9, 5000, null, 0)).toBe(25)
  })

  it('caps multiplier at x3.0 for high streaks', () => {
    const pts15 = calculatePoints(15, 5000, null, 0)
    const pts30 = calculatePoints(30, 5000, null, 0)
    expect(pts30).toBe(pts15)
    expect(pts30).toBe(30)
  })

  it('applies speed bonus when timer is present and time remaining', () => {
    // answered instantly (1ms), limit 30s → full speed bonus
    const withBonus = calculatePoints(0, 1, 30, 0)
    const withoutTimer = calculatePoints(0, 5000, null, 0)
    expect(withBonus).toBeGreaterThan(withoutTimer)
  })

  it('gives no speed bonus when no time limit', () => {
    expect(calculatePoints(0, 100, null, 0)).toBe(10)
  })

  it('deducts 3 points per hint used', () => {
    expect(calculatePoints(0, 5000, null, 1)).toBe(7)
    expect(calculatePoints(0, 5000, null, 2)).toBe(4)
  })

  it('never returns negative points', () => {
    expect(calculatePoints(0, 5000, null, 10)).toBeGreaterThanOrEqual(0)
  })

  it('returns a whole number (rounded)', () => {
    const pts = calculatePoints(4, 100, 30, 0)
    expect(pts).toBe(Math.round(pts))
  })
})

describe('calculateStars', () => {
  it('returns 3 stars for 100% correct', () => {
    expect(calculateStars(10, 10)).toBe(3)
  })

  it('returns 2 stars for 80-99%', () => {
    expect(calculateStars(8, 10)).toBe(2)
    expect(calculateStars(9, 10)).toBe(2)
  })

  it('returns 1 star for 70-79%', () => {
    expect(calculateStars(7, 10)).toBe(1)
  })

  it('returns 0 stars below 70%', () => {
    expect(calculateStars(6, 10)).toBe(0)
    expect(calculateStars(0, 10)).toBe(0)
  })

  it('handles edge case of 0 questions gracefully', () => {
    expect(() => calculateStars(0, 0)).not.toThrow()
  })
})

import { describe, it, expect } from 'vitest'
import { resolveTitle, TITLES } from '../data/titles'

describe('resolveTitle', () => {
  it('returns first title at 0 points', () => {
    expect(resolveTitle(0).nameHebrew).toBe('מתחילה')
  })

  it('returns correct title at exactly 100 points', () => {
    expect(resolveTitle(100).nameHebrew).toBe('ילדה חכמה')
  })

  it('returns correct title at 99 points (below threshold)', () => {
    expect(resolveTitle(99).nameHebrew).toBe('מתחילה')
  })

  it('returns correct title at 300 points', () => {
    expect(resolveTitle(300).nameHebrew).toBe('פותרת בעיות')
  })

  it('returns the highest title at max points', () => {
    const highest = TITLES[TITLES.length - 1]
    expect(resolveTitle(highest.requiredPoints).nameHebrew).toBe(highest.nameHebrew)
  })

  it('returns highest title for very large point values', () => {
    const highest = TITLES[TITLES.length - 1]
    expect(resolveTitle(999999).nameHebrew).toBe(highest.nameHebrew)
  })

  it('titles are sorted by requiredPoints ascending', () => {
    for (let i = 1; i < TITLES.length; i++) {
      expect(TITLES[i].requiredPoints).toBeGreaterThan(TITLES[i - 1].requiredPoints)
    }
  })

  it('all titles have Hebrew names', () => {
    TITLES.forEach(t => {
      expect(t.nameHebrew.length).toBeGreaterThan(0)
      expect(t.iconEmoji.length).toBeGreaterThan(0)
    })
  })
})

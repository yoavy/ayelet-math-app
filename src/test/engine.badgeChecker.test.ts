import { describe, it, expect } from 'vitest'
import { checkBadgeConditions } from '../engine/badgeChecker'
import { BADGES } from '../data/badges'
import type { UserProfile, Score } from '../types'

function makeProfile(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    id: 'test',
    name: 'תלמידה',
    avatarId: 'star',
    createdAt: Date.now(),
    onboardingComplete: true,
    totalPoints: 0,
    currentTitle: 'מתחילה',
    currentStreak: 0,
    maxStreak: 0,
    dailyStreak: 1,
    lastPlayedAt: Date.now(),
    badgeIds: [],
    parentPin: null,
    gender: 'female',
    difficulty: 'medium',
    ...overrides,
  }
}

function makeScore(levelId: string, stars: 0|1|2|3 = 3): Score {
  return {
    levelId,
    topicId: 'addition',
    stars,
    pointsEarned: 50,
    correctCount: 9,
    totalCount: 10,
    bestStreak: 5,
    completedAt: Date.now(),
    attempts: 1,
  }
}

describe('checkBadgeConditions', () => {
  it('returns empty array when no conditions met', () => {
    const result = checkBadgeConditions(makeProfile(), {}, BADGES)
    expect(result).toHaveLength(0)
  })

  it('awards first_play badge when at least one score exists', () => {
    const scores = { addition_1: makeScore('addition_1') }
    const result = checkBadgeConditions(makeProfile(), scores, BADGES)
    const ids = result.map(b => b.id)
    expect(ids).toContain('first_play')
  })

  it('does not re-award a badge already in badgeIds', () => {
    const scores = { addition_1: makeScore('addition_1') }
    const profile = makeProfile({ badgeIds: ['first_play'] })
    const result = checkBadgeConditions(profile, scores, BADGES)
    expect(result.find(b => b.id === 'first_play')).toBeUndefined()
  })

  it('awards streak_5 badge when maxStreak >= 5', () => {
    const profile = makeProfile({ maxStreak: 5 })
    const scores = { addition_1: makeScore('addition_1') }
    const result = checkBadgeConditions(profile, scores, BADGES)
    expect(result.find(b => b.id === 'streak_5')).toBeDefined()
  })

  it('does not award streak_10 when maxStreak is only 5', () => {
    const profile = makeProfile({ maxStreak: 5 })
    const result = checkBadgeConditions(profile, {}, BADGES)
    expect(result.find(b => b.id === 'streak_10')).toBeUndefined()
  })

  it('awards streak_10 badge when maxStreak >= 10', () => {
    const profile = makeProfile({ maxStreak: 10 })
    const scores = { addition_1: makeScore('addition_1') }
    const result = checkBadgeConditions(profile, scores, BADGES)
    expect(result.find(b => b.id === 'streak_10')).toBeDefined()
  })

  it('awards points_100 badge when totalPoints >= 100', () => {
    const profile = makeProfile({ totalPoints: 100 })
    const result = checkBadgeConditions(profile, {}, BADGES)
    expect(result.find(b => b.id === 'points_100')).toBeDefined()
  })

  it('does not award points_500 when totalPoints is 100', () => {
    const profile = makeProfile({ totalPoints: 100 })
    const result = checkBadgeConditions(profile, {}, BADGES)
    expect(result.find(b => b.id === 'points_500')).toBeUndefined()
  })

  it('awards addition_complete badge when all 5 addition levels completed', () => {
    const scores: Record<string, Score> = {}
    for (let i = 1; i <= 5; i++) {
      scores[`addition_${i}`] = { ...makeScore(`addition_${i}`), topicId: 'addition' }
    }
    const result = checkBadgeConditions(makeProfile(), scores, BADGES)
    expect(result.find(b => b.id === 'addition_complete')).toBeDefined()
  })

  it('does not award addition_complete with only 4 levels done', () => {
    const scores: Record<string, Score> = {}
    for (let i = 1; i <= 4; i++) {
      scores[`addition_${i}`] = { ...makeScore(`addition_${i}`), topicId: 'addition' }
    }
    const result = checkBadgeConditions(makeProfile(), scores, BADGES)
    expect(result.find(b => b.id === 'addition_complete')).toBeUndefined()
  })

  it('awards daily_7 badge when dailyStreak >= 7', () => {
    const profile = makeProfile({ dailyStreak: 7 })
    const result = checkBadgeConditions(profile, {}, BADGES)
    expect(result.find(b => b.id === 'daily_7')).toBeDefined()
  })

  it('can award multiple badges at once', () => {
    const profile = makeProfile({ totalPoints: 600, maxStreak: 10, dailyStreak: 7 })
    const scores = { addition_1: makeScore('addition_1') }
    const result = checkBadgeConditions(profile, scores, BADGES)
    expect(result.length).toBeGreaterThan(1)
  })
})

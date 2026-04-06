import { describe, it, expect } from 'vitest'
import { TOPICS } from '../data/topics'
import type { Score } from '../types'

// Test the getLevelStatus logic directly (pure logic extracted for testability)
function getLevelStatus(
  levelId: string,
  topicId: string,
  levelNumber: number,
  scores: Record<string, Score>
): 'locked' | 'available' | 'in_progress' | 'completed' {
  const score = scores[levelId]
  if (score && score.stars > 0) return 'completed'
  if (levelNumber === 1) return 'available'
  const prevLevelId = `${topicId}_${levelNumber - 1}`
  const prevScore = scores[prevLevelId]
  if (prevScore && prevScore.stars > 0) return 'available'
  return 'locked'
}

function makeScore(levelId: string, stars: 0|1|2|3 = 3): Score {
  return {
    levelId, topicId: 'addition', stars,
    pointsEarned: 50, correctCount: 9, totalCount: 10,
    bestStreak: 5, completedAt: Date.now(), attempts: 1,
  }
}

describe('getLevelStatus', () => {
  it('level 1 is always available when no scores', () => {
    expect(getLevelStatus('addition_1', 'addition', 1, {})).toBe('available')
  })

  it('level 2 is locked when level 1 not completed', () => {
    expect(getLevelStatus('addition_2', 'addition', 2, {})).toBe('locked')
  })

  it('level 2 is available when level 1 is completed', () => {
    const scores = { addition_1: makeScore('addition_1') }
    expect(getLevelStatus('addition_2', 'addition', 2, scores)).toBe('available')
  })

  it('completed level shows as completed', () => {
    const scores = { addition_1: makeScore('addition_1') }
    expect(getLevelStatus('addition_1', 'addition', 1, scores)).toBe('completed')
  })

  it('level with 0 stars does not count as completed', () => {
    const scores = { addition_1: makeScore('addition_1', 0) }
    expect(getLevelStatus('addition_1', 'addition', 1, scores)).toBe('available')
  })

  it('level 5 is locked if level 4 not done', () => {
    const scores = { addition_1: makeScore('addition_1'), addition_2: makeScore('addition_2') }
    expect(getLevelStatus('addition_5', 'addition', 5, scores)).toBe('locked')
  })

  it('level 5 is available when level 4 is done', () => {
    const scores: Record<string, Score> = {}
    for (let i = 1; i <= 4; i++) scores[`addition_${i}`] = makeScore(`addition_${i}`)
    expect(getLevelStatus('addition_5', 'addition', 5, scores)).toBe('available')
  })
})

describe('getTopicStars', () => {
  function getTopicStars(topicId: string, scores: Record<string, Score>): number {
    const topic = TOPICS.find(t => t.id === topicId)!
    return topic.levels.reduce((sum, l) => sum + (scores[l.id]?.stars ?? 0), 0)
  }

  it('returns 0 when no levels completed', () => {
    expect(getTopicStars('addition', {})).toBe(0)
  })

  it('returns correct star count for partial completion', () => {
    const scores = {
      addition_1: makeScore('addition_1', 3),
      addition_2: makeScore('addition_2', 2),
    }
    expect(getTopicStars('addition', scores)).toBe(5)
  })

  it('returns max 15 stars when all levels have 3 stars', () => {
    const scores: Record<string, Score> = {}
    for (let i = 1; i <= 5; i++) scores[`addition_${i}`] = makeScore(`addition_${i}`, 3)
    expect(getTopicStars('addition', scores)).toBe(15)
  })
})

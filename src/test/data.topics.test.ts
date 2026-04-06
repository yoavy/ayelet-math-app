import { describe, it, expect } from 'vitest'
import { TOPICS } from '../data/topics'

describe('TOPICS static data', () => {
  it('contains exactly 8 topics', () => {
    expect(TOPICS).toHaveLength(8)
  })

  it('each topic has exactly 5 levels', () => {
    TOPICS.forEach(topic => {
      expect(topic.levels).toHaveLength(5)
    })
  })

  it('level numbers are 1-5 in order', () => {
    TOPICS.forEach(topic => {
      topic.levels.forEach((level, i) => {
        expect(level.levelNumber).toBe(i + 1)
      })
    })
  })

  it('level ids follow pattern topicId_levelNumber', () => {
    TOPICS.forEach(topic => {
      topic.levels.forEach(level => {
        expect(level.id).toBe(`${topic.id}_${level.levelNumber}`)
      })
    })
  })

  it('each level has a passingScore below questionsPerSession', () => {
    TOPICS.forEach(topic => {
      topic.levels.forEach(level => {
        expect(level.passingScore).toBeLessThanOrEqual(level.questionsPerSession)
      })
    })
  })

  it('starThresholds are in ascending order', () => {
    TOPICS.forEach(topic => {
      topic.levels.forEach(level => {
        const [s1, s2, s3] = level.starThresholds
        expect(s1).toBeLessThanOrEqual(s2)
        expect(s2).toBeLessThanOrEqual(s3)
      })
    })
  })

  it('maxValue is always >= minValue in difficultyParams', () => {
    TOPICS.forEach(topic => {
      topic.levels.forEach(level => {
        const { minValue, maxValue } = level.difficultyParams
        expect(maxValue).toBeGreaterThanOrEqual(minValue)
      })
    })
  })

  it('difficulty increases across levels (maxValue grows)', () => {
    TOPICS.forEach(topic => {
      for (let i = 1; i < topic.levels.length; i++) {
        const prev = topic.levels[i - 1].difficultyParams.maxValue
        const curr = topic.levels[i].difficultyParams.maxValue
        expect(curr).toBeGreaterThanOrEqual(prev)
      }
    })
  })

  it('every topic has a Hebrew name, emoji, and colors', () => {
    TOPICS.forEach(topic => {
      expect(topic.nameHebrew.length).toBeGreaterThan(0)
      expect(topic.emoji.length).toBeGreaterThan(0)
      expect(topic.color).toMatch(/^#/)
      expect(topic.bgColor).toMatch(/^#/)
    })
  })

  it('all topic ids are unique', () => {
    const ids = TOPICS.map(t => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all level ids across all topics are unique', () => {
    const ids = TOPICS.flatMap(t => t.levels.map(l => l.id))
    expect(new Set(ids).size).toBe(ids.length)
  })
})

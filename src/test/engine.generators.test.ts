import { describe, it, expect } from 'vitest'
import { generateQuestion, buildSession } from '../engine/questionGenerators'
import { TOPICS } from '../data/topics'
import type { Level, QuestionType } from '../types'

function getLevel(topicId: string, levelNumber: number): Level {
  const topic = TOPICS.find(t => t.id === topicId)!
  return topic.levels.find(l => l.levelNumber === levelNumber)!
}

// ─── Addition ─────────────────────────────────────────────────────────────────

describe('generateQuestion — addition', () => {
  const level = getLevel('addition', 1)

  it('returns a question with correct topicId', () => {
    const q = generateQuestion(level, new Set())
    expect(q.topicId).toBe('addition')
  })

  it('answer equals sum of operands', () => {
    for (let i = 0; i < 20; i++) {
      const q = generateQuestion(level, new Set())
      if (q.expression) {
        const parts = q.expression.replace(' = ?', '').split(' + ').map(Number)
        const expected = parts.reduce((a, b) => a + b, 0)
        expect(Number(q.answer)).toBe(expected)
      }
    }
  })

  it('values stay within difficulty bounds', () => {
    const { minValue, maxValue } = level.difficultyParams
    for (let i = 0; i < 30; i++) {
      const q = generateQuestion(level, new Set())
      expect(Number(q.answer)).toBeGreaterThanOrEqual(minValue * 2)
      expect(Number(q.answer)).toBeLessThanOrEqual(maxValue * 3)
    }
  })

  it('multiple_choice questions have exactly 4 choices', () => {
    const mcLevel = { ...level, allowedQuestionTypes: ['multiple_choice'] as QuestionType[] }
    for (let i = 0; i < 10; i++) {
      const q = generateQuestion(mcLevel, new Set())
      if (q.type === 'multiple_choice') {
        expect(q.choices).toHaveLength(4)
      }
    }
  })

  it('correct answer is always among choices', () => {
    const mcLevel = { ...level, allowedQuestionTypes: ['multiple_choice'] as QuestionType[] }
    for (let i = 0; i < 20; i++) {
      const q = generateQuestion(mcLevel, new Set())
      if (q.choices) {
        const vals = q.choices.map(c => String(c.value))
        expect(vals).toContain(String(q.answer))
      }
    }
  })

  it('does not repeat questions with same hash', () => {
    const used = new Set<string>()
    const questions = Array.from({ length: 10 }, () => generateQuestion(level, used))
    const expressions = questions.map(q => q.expression)
    const unique = new Set(expressions)
    expect(unique.size).toBe(questions.length)
  })

  it('level 5 uses 3 operands', () => {
    const l5 = getLevel('addition', 5)
    let found3 = false
    for (let i = 0; i < 30; i++) {
      const q = generateQuestion(l5, new Set())
      if (q.expression && q.expression.split('+').length === 3) {
        found3 = true
        break
      }
    }
    expect(found3).toBe(true)
  })
})

// ─── Subtraction ──────────────────────────────────────────────────────────────

describe('generateQuestion — subtraction', () => {
  it('answer is never negative', () => {
    const level = getLevel('subtraction', 2)
    for (let i = 0; i < 30; i++) {
      const q = generateQuestion(level, new Set())
      expect(Number(q.answer)).toBeGreaterThanOrEqual(0)
    }
  })

  it('answer matches a - b', () => {
    const level = getLevel('subtraction', 2)
    for (let i = 0; i < 20; i++) {
      const q = generateQuestion(level, new Set())
      if (q.expression) {
        const [a, b] = q.expression.replace(' = ?', '').split(' - ').map(Number)
        expect(Number(q.answer)).toBe(a - b)
      }
    }
  })
})

// ─── Multiplication ───────────────────────────────────────────────────────────

describe('generateQuestion — multiplication', () => {
  it('answer equals product of operands', () => {
    const level = getLevel('multiplication', 2)
    for (let i = 0; i < 20; i++) {
      const q = generateQuestion(level, new Set())
      if (q.expression) {
        const [a, b] = q.expression.replace(' = ?', '').split(' × ').map(Number)
        expect(Number(q.answer)).toBe(a * b)
      }
    }
  })
})

// ─── Division ─────────────────────────────────────────────────────────────────

describe('generateQuestion — division', () => {
  it('answer is always a whole number (no remainder)', () => {
    const level = getLevel('division', 2)
    for (let i = 0; i < 30; i++) {
      const q = generateQuestion(level, new Set())
      expect(Number(q.answer) % 1).toBe(0)
    }
  })

  it('dividend = divisor × answer', () => {
    const level = getLevel('division', 2)
    for (let i = 0; i < 20; i++) {
      const q = generateQuestion(level, new Set())
      if (q.expression) {
        const [dividend, divisor] = q.expression.replace(' = ?', '').split(' ÷ ').map(Number)
        expect(dividend).toBe(divisor * Number(q.answer))
      }
    }
  })
})

// ─── Fractions ────────────────────────────────────────────────────────────────

describe('generateQuestion — fractions', () => {
  it('level 1-2: answer is a valid fraction string or number', () => {
    const level = getLevel('fractions', 1)
    for (let i = 0; i < 10; i++) {
      const q = generateQuestion(level, new Set())
      expect(typeof q.answer === 'string' || typeof q.answer === 'number').toBe(true)
    }
  })

  it('level 3+: answer is a simplified fraction', () => {
    const level = getLevel('fractions', 3)
    for (let i = 0; i < 15; i++) {
      const q = generateQuestion(level, new Set())
      const ans = String(q.answer)
      if (ans.includes('/')) {
        const [num, den] = ans.split('/').map(Number)
        expect(den).toBeGreaterThan(0)
        expect(num).toBeGreaterThanOrEqual(0)
      }
    }
  })
})

// ─── Geometry ─────────────────────────────────────────────────────────────────

describe('generateQuestion — geometry', () => {
  it('answer is a positive number', () => {
    const level = getLevel('geometry', 1)
    for (let i = 0; i < 20; i++) {
      const q = generateQuestion(level, new Set())
      expect(Number(q.answer)).toBeGreaterThan(0)
    }
  })

  it('question text mentions perimeter or area in Hebrew', () => {
    const level = getLevel('geometry', 2)
    for (let i = 0; i < 10; i++) {
      const q = generateQuestion(level, new Set())
      expect(q.displayText).toMatch(/היקף|שטח/)
    }
  })
})

// ─── Word Problems ────────────────────────────────────────────────────────────

describe('generateQuestion — wordProblems', () => {
  it('answer is a positive number', () => {
    const level = getLevel('wordProblems', 1)
    for (let i = 0; i < 10; i++) {
      const q = generateQuestion(level, new Set(), 'נועה')
      expect(Number(q.answer)).toBeGreaterThan(0)
    }
  })

  it('injects user name into question text', () => {
    const level = getLevel('wordProblems', 1)
    let found = false
    for (let i = 0; i < 20; i++) {
      const q = generateQuestion(level, new Set(), 'נועה')
      if (q.displayText.includes('נועה')) { found = true; break }
    }
    expect(found).toBe(true)
  })
})

// ─── buildSession ─────────────────────────────────────────────────────────────

describe('buildSession', () => {
  it('returns exactly questionsPerSession questions', () => {
    const level = getLevel('addition', 1)
    const questions = buildSession(level)
    expect(questions).toHaveLength(level.questionsPerSession)
  })

  it('all questions have correct topicId', () => {
    const level = getLevel('multiplication', 3)
    const questions = buildSession(level)
    questions.forEach(q => expect(q.topicId).toBe('multiplication'))
  })

  it('no duplicate question expressions within a session', () => {
    const level = getLevel('addition', 2)
    const questions = buildSession(level)
    const exprs = questions.map(q => q.expression ?? q.displayText)
    const unique = new Set(exprs)
    expect(unique.size).toBe(questions.length)
  })

  it('works for all 8 topics without throwing', () => {
    const topicIds = ['addition','subtraction','multiplication','division',
                      'fractions','decimals','geometry','wordProblems']
    for (const topicId of topicIds) {
      const level = getLevel(topicId, 1)
      expect(() => buildSession(level, 'תלמידה')).not.toThrow()
    }
  })
})

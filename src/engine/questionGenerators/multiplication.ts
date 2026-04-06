import type { Level, Question } from '../../types'
import { randomInt, pickType, makeChoices, buildQuestion } from './utils'

export function generateMultiplication(level: Level, used: Set<string>): Question {
  const { minValue, maxValue } = level.difficultyParams
  let a: number, b: number, answer: number, hash: string
  let attempts = 0

  do {
    a = randomInt(Math.max(2, minValue), maxValue)
    b = randomInt(Math.max(2, minValue), maxValue)
    answer = a * b
    hash = `mul:${Math.min(a, b)}x${Math.max(a, b)}`
    attempts++
  } while (used.has(hash) && attempts < 50)

  used.add(hash)
  const type = pickType(level.allowedQuestionTypes)

  return buildQuestion({
    topicId: 'multiplication',
    levelId: level.id,
    type,
    displayText: `כמה זה ${a} כפול ${b}?`,
    expression: `${a} × ${b} = ?`,
    answer,
    choices: type === 'multiple_choice' ? makeChoices(answer, maxValue * maxValue) : undefined,
    hintText: `${a} × ${b}: חשבי ${a} פעמים ${b}`,
  })
}

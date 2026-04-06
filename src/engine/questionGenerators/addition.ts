import type { Level, Question } from '../../types'
import { randomInt, pickType, makeChoices, buildQuestion } from './utils'

export function generateAddition(level: Level, used: Set<string>): Question {
  const { minValue, maxValue, operandCount } = level.difficultyParams
  let a: number, b: number, c: number | undefined, answer: number, hash: string
  let attempts = 0

  do {
    a = randomInt(minValue, maxValue)
    b = randomInt(minValue, maxValue)
    c = operandCount === 3 ? randomInt(minValue, Math.floor(maxValue / 2)) : undefined
    answer = a + b + (c ?? 0)
    hash = `add:${a}+${b}${c !== undefined ? `+${c}` : ''}`
    attempts++
  } while (used.has(hash) && attempts < 50)

  used.add(hash)
  const type = pickType(level.allowedQuestionTypes)
  const expr = c !== undefined ? `${a} + ${b} + ${c}` : `${a} + ${b}`

  return buildQuestion({
    topicId: 'addition',
    levelId: level.id,
    type,
    displayText: `כמה זה ${expr}?`,
    expression: `${expr} = ?`,
    answer,
    choices: type === 'multiple_choice' ? makeChoices(answer, maxValue * 2) : undefined,
    hintText: `נסי לחשב שלב אחרי שלב: קודם ${a} + ${b}`,
  })
}

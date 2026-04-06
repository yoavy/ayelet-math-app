import type { Level, Question } from '../../types'
import { randomInt, pickType, makeChoices, buildQuestion } from './utils'

export function generateDivision(level: Level, used: Set<string>): Question {
  const { minValue, maxValue } = level.difficultyParams
  let divisor: number, quotient: number, dividend: number, hash: string
  let attempts = 0

  do {
    divisor = randomInt(Math.max(2, minValue), Math.min(12, maxValue))
    quotient = randomInt(Math.max(2, minValue), maxValue)
    dividend = divisor * quotient
    hash = `div:${dividend}/${divisor}`
    attempts++
  } while (used.has(hash) && attempts < 50)

  used.add(hash)
  const type = pickType(level.allowedQuestionTypes)

  return buildQuestion({
    topicId: 'division',
    levelId: level.id,
    type,
    displayText: `כמה זה ${dividend} חלקי ${divisor}?`,
    expression: `${dividend} ÷ ${divisor} = ?`,
    answer: quotient,
    choices: type === 'multiple_choice' ? makeChoices(quotient, maxValue) : undefined,
    hintText: `${dividend} ÷ ${divisor}: כמה פעמים ${divisor} נכנס ב-${dividend}?`,
  })
}

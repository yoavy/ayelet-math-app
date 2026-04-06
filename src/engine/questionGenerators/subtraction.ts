import type { Level, Question } from '../../types'
import { randomInt, pickType, makeChoices, buildQuestion } from './utils'

export function generateSubtraction(level: Level, used: Set<string>): Question {
  const { minValue, maxValue } = level.difficultyParams
  let a: number, b: number, answer: number, hash: string
  let attempts = 0

  do {
    a = randomInt(minValue + 1, maxValue)
    b = randomInt(minValue, a)
    answer = a - b
    hash = `sub:${a}-${b}`
    attempts++
  } while (used.has(hash) && attempts < 50)

  used.add(hash)
  const type = pickType(level.allowedQuestionTypes)

  return buildQuestion({
    topicId: 'subtraction',
    levelId: level.id,
    type,
    displayText: `כמה זה ${a} פחות ${b}?`,
    expression: `${a} - ${b} = ?`,
    answer,
    choices: type === 'multiple_choice' ? makeChoices(answer, maxValue) : undefined,
    hintText: `${a} - ${b}: נסי לספור אחורה מ-${a}`,
  })
}

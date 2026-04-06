import type { Level, Question } from '../../types'
import { randomFloat, pickType, makeChoices, buildQuestion } from './utils'

export function generateDecimals(level: Level, used: Set<string>): Question {
  const { minValue, maxValue, decimalPlaces = 1 } = level.difficultyParams
  let a: number, b: number, answer: number, hash: string
  const isAdd = Math.random() > 0.5
  let attempts = 0

  do {
    a = randomFloat(minValue, maxValue, decimalPlaces)
    b = randomFloat(minValue, isAdd ? maxValue : a, decimalPlaces)
    answer = isAdd ? a + b : a - b
    answer = Math.round(answer * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces)
    if (answer < 0) { [a, b] = [b, a]; answer = a - b }
    hash = `dec:${a}${isAdd ? '+' : '-'}${b}`
    attempts++
  } while (used.has(hash) && attempts < 50)

  used.add(hash)
  const type = pickType(level.allowedQuestionTypes)
  const op = isAdd ? '+' : '-'

  const choicesRaw = type === 'multiple_choice'
    ? makeChoices(Math.round(answer * 10), maxValue * 10).map(c => ({
        ...c,
        value: (c.value as number) / 10,
        label: ((c.value as number) / 10).toFixed(decimalPlaces),
      }))
    : undefined

  return buildQuestion({
    topicId: 'decimals',
    levelId: level.id,
    type,
    displayText: `כמה זה ${a} ${op === '+' ? 'ועוד' : 'פחות'} ${b}?`,
    expression: `${a} ${op} ${b} = ?`,
    answer,
    choices: choicesRaw,
    hintText: `יישרי את הנקודות העשרוניות ואז ${isAdd ? 'חברי' : 'חסרי'}`,
  })
}

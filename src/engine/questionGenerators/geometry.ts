import type { Level, Question } from '../../types'
import { randomInt, pickType, makeChoices, buildQuestion } from './utils'

type Shape = 'rectangle' | 'square' | 'triangle'

export function generateGeometry(level: Level, used: Set<string>): Question {
  const { minValue, maxValue } = level.difficultyParams
  const shapes: Shape[] = level.levelNumber <= 2
    ? ['square', 'rectangle']
    : ['square', 'rectangle', 'triangle']

  const shape = shapes[Math.floor(Math.random() * shapes.length)]
  const isPerimeter = level.levelNumber <= 3 ? true : Math.random() > 0.5
  let a: number, b: number | undefined, answer: number, hash: string
  let attempts = 0

  do {
    a = randomInt(minValue, maxValue)
    b = shape !== 'square' ? randomInt(minValue, maxValue) : undefined
    if (isPerimeter) {
      answer = shape === 'square'
        ? a * 4
        : shape === 'rectangle'
        ? 2 * (a + b!)
        : a + b! + randomInt(minValue, maxValue)
    } else {
      answer = shape === 'square'
        ? a * a
        : a * b!
    }
    hash = `geo:${shape}_${isPerimeter ? 'p' : 'a'}_${a}_${b ?? ''}`
    attempts++
  } while (used.has(hash) && attempts < 50)

  used.add(hash)
  const type = pickType(level.allowedQuestionTypes)

  const shapeNames: Record<Shape, string> = {
    square: 'ריבוע',
    rectangle: 'מלבן',
    triangle: 'משולש',
  }
  const measure = isPerimeter ? 'היקף' : 'שטח'
  const dims = shape === 'square'
    ? `צלע ${a}`
    : `צלעות ${a} ו-${b}`

  return buildQuestion({
    topicId: 'geometry',
    levelId: level.id,
    type,
    displayText: `מה ה${measure} של ${shapeNames[shape]} עם ${dims}?`,
    expression: isPerimeter
      ? shape === 'square' ? `היקף = 4 × ${a}` : `היקף = 2 × (${a} + ${b})`
      : shape === 'square' ? `שטח = ${a} × ${a}` : `שטח = ${a} × ${b}`,
    answer,
    choices: type === 'multiple_choice' ? makeChoices(answer, answer * 2) : undefined,
    hintText: isPerimeter
      ? `היקף = סכום כל הצלעות`
      : `שטח = אורך × רוחב`,
  })
}

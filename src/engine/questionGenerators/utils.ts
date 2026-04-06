import type { Choice, Question, QuestionType } from '../../types'

let _counter = 0
export function uid(): string {
  return `q_${Date.now()}_${++_counter}`
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomFloat(min: number, max: number, decimals = 1): number {
  const factor = Math.pow(10, decimals)
  return Math.round((Math.random() * (max - min) + min) * factor) / factor
}

export function pickType(allowed: QuestionType[]): QuestionType {
  return allowed[Math.floor(Math.random() * allowed.length)]
}

export function makeChoices(correct: number, max: number): Choice[] {
  const distractors = new Set<number>()
  distractors.add(correct + 1)
  distractors.add(correct - 1)
  distractors.add(correct + randomInt(2, Math.max(5, Math.floor(max * 0.1))))
  distractors.delete(correct)

  const all = [correct, ...Array.from(distractors).slice(0, 3)]
  // shuffle
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[all[i], all[j]] = [all[j], all[i]]
  }
  return all.map((v, i) => ({ id: String(i), value: v, label: String(v) }))
}

export function buildQuestion(
  partial: Omit<Question, 'id'>
): Question {
  return { id: uid(), ...partial }
}

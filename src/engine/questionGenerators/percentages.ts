import type { Level, Question } from '../../types'
import { randomInt, pickType, buildQuestion } from './utils'

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

/** Percentages guaranteed to produce integer results with the right base */
const EASY_PERCS = [10, 20, 25, 50] as const
const HARD_PERCS = [5, 10, 15, 20, 25, 30, 40, 50, 75] as const

/**
 * Returns a base number such that pct% of it is a whole number,
 * within [minBase, maxBase] approximately.
 */
function niceBase(pct: number, minBase: number, maxBase: number): number {
  const d = Math.round(100 / gcd(pct, 100)) // base must be a multiple of d
  const minK = Math.max(1, Math.ceil(minBase / d))
  const maxK = Math.max(minK, Math.floor(maxBase / d))
  return randomInt(minK, maxK) * d
}

function pctOf(base: number, pct: number): number {
  return Math.round(base * pct / 100)
}

function makeChoices(correct: number, unit = '') {
  const offsets = [-20, -10, 10, 20].filter(o => correct + o > 0)
  const pool = Array.from(new Set([correct, ...offsets.map(o => correct + o)])).slice(0, 4)
  while (pool.length < 4) pool.push(pool[pool.length - 1] + 5)
  return pool
    .slice(0, 4)
    .sort(() => Math.random() - 0.5)
    .map((v, i) => ({ id: String(i), value: String(v), label: unit ? `${v} ${unit}` : String(v) }))
}

function makePercentChoices(correct: number) {
  const offsets = [-10, -5, 5, 10].filter(o => correct + o > 0 && correct + o <= 100)
  const pool = Array.from(new Set([correct, ...offsets.map(o => correct + o)])).slice(0, 4)
  while (pool.length < 4) pool.push(Math.min(100, pool[pool.length - 1] + 5))
  return pool
    .slice(0, 4)
    .sort(() => Math.random() - 0.5)
    .map((v, i) => ({ id: String(i), value: String(v), label: `${v}%` }))
}

// ── Level 1: What is X% of Y? (simple percentages) ───────────────────────────
function genL1(level: Level, used: Set<string>): Question {
  const max = Math.max(100, level.difficultyParams.maxValue)
  let pct: number, base: number, answer: number, hash = '', attempts = 0
  do {
    pct = EASY_PERCS[randomInt(0, EASY_PERCS.length - 1)]
    base = niceBase(pct, 10, max)
    answer = pctOf(base, pct)
    hash = `pct1:${pct}of${base}`
    attempts++
  } while (used.has(hash) && attempts < 50)
  used.add(hash)

  const type = pickType(level.allowedQuestionTypes)
  return buildQuestion({
    topicId: 'percentages',
    levelId: level.id,
    type,
    displayText: `כמה זה ${pct}% מ-${base}?`,
    expression: `${pct}% × ${base} = ?`,
    answer: String(answer),
    choices: type === 'multiple_choice' ? makeChoices(answer) : undefined,
    hintText: `${pct}% = ${pct} חלקי 100. חשבי: ${base} × ${pct} ÷ 100`,
  })
}

// ── Level 2: X is what % of Y? ────────────────────────────────────────────────
function genL2(level: Level, used: Set<string>): Question {
  const max = Math.max(200, level.difficultyParams.maxValue)
  let pct: number, base: number, part: number, hash = '', attempts = 0
  do {
    pct = EASY_PERCS[randomInt(0, EASY_PERCS.length - 1)]
    base = niceBase(pct, 20, max)
    part = pctOf(base, pct)
    hash = `pct2:${part}of${base}`
    attempts++
  } while (used.has(hash) && attempts < 50)
  used.add(hash)

  const type = pickType(level.allowedQuestionTypes)
  return buildQuestion({
    topicId: 'percentages',
    levelId: level.id,
    type,
    displayText: `${part} הם כמה אחוזים מ-${base}?`,
    expression: `${part} ÷ ${base} × 100 = ?%`,
    answer: String(pct),
    choices: type === 'multiple_choice' ? makePercentChoices(pct) : undefined,
    hintText: `חלקי: ${part} ÷ ${base} = ${(part / base).toFixed(2)}, כפלי ב-100`,
  })
}

// ── Level 3: Price change — apply % increase or decrease ─────────────────────
function genL3(level: Level, used: Set<string>): Question {
  const max = Math.max(300, level.difficultyParams.maxValue)
  let pct: number, base: number, isUp: boolean, newVal: number, hash = '', attempts = 0
  do {
    pct = EASY_PERCS[randomInt(0, EASY_PERCS.length - 1)]
    base = niceBase(pct, 20, max)
    isUp = Math.random() > 0.5
    newVal = isUp ? base + pctOf(base, pct) : base - pctOf(base, pct)
    if (newVal <= 0) { attempts++; continue }
    hash = `pct3:${base}${isUp ? '+' : '-'}${pct}`
    attempts++
  } while (used.has(hash) && attempts < 50)
  used.add(hash)

  const type = pickType(level.allowedQuestionTypes)
  const verb = isUp ? 'עלה' : 'ירד'
  const change = pctOf(base, pct)

  return buildQuestion({
    topicId: 'percentages',
    levelId: level.id,
    type,
    displayText: `מוצר שעלה ${base} ₪ ${verb} ב-${pct}%. מה המחיר החדש?`,
    expression: `${base} ₪ ${isUp ? '+' : '−'} ${pct}% = ?`,
    answer: String(newVal),
    choices: type === 'multiple_choice' ? makeChoices(newVal, '₪') : undefined,
    hintText: `${pct}% מ-${base} = ${change} ₪. מחיר חדש: ${base} ${isUp ? '+' : '−'} ${change}`,
  })
}

// ── Level 4: Find the original price ─────────────────────────────────────────
function genL4(level: Level, used: Set<string>): Question {
  const max = Math.max(400, level.difficultyParams.maxValue)
  let pct: number, original: number, isUp: boolean, newVal: number, hash = '', attempts = 0
  do {
    pct = EASY_PERCS[randomInt(0, EASY_PERCS.length - 1)]
    original = niceBase(pct, 20, max)
    isUp = Math.random() > 0.5
    newVal = isUp ? original + pctOf(original, pct) : original - pctOf(original, pct)
    if (newVal <= 0) { attempts++; continue }
    hash = `pct4:${original}${isUp ? '+' : '-'}${pct}→${newVal}`
    attempts++
  } while (used.has(hash) && attempts < 50)
  used.add(hash)

  const verb = isUp ? 'עלייה' : 'הנחה'
  const type = pickType(level.allowedQuestionTypes)

  return buildQuestion({
    topicId: 'percentages',
    levelId: level.id,
    type,
    displayText: `אחרי ${verb} של ${pct}%, המחיר הוא ${newVal} ₪. מה היה המחיר המקורי?`,
    expression: `? ${isUp ? '+' : '−'} ${pct}% = ${newVal} ₪`,
    answer: String(original),
    choices: type === 'multiple_choice' ? makeChoices(original, '₪') : undefined,
    hintText: `המחיר החדש הוא ${isUp ? 100 + pct : 100 - pct}% מהמקורי. חלקי: ${newVal} ÷ ${(isUp ? 100 + pct : 100 - pct) / 100}`,
  })
}

// ── Level 5: Mixed harder questions ──────────────────────────────────────────
function genL5(level: Level, used: Set<string>): Question {
  const max = Math.max(500, level.difficultyParams.maxValue)
  const harder = HARD_PERCS

  // Randomly pick question type
  const qType = randomInt(0, 3)

  let pct: number, base: number, hash = '', attempts = 0

  if (qType === 0) {
    // Hard: what is X% of Y?
    let answer = 0
    do {
      pct = harder[randomInt(0, harder.length - 1)]
      base = niceBase(pct, 50, max)
      answer = pctOf(base, pct)
      hash = `pct5a:${pct}of${base}`
      attempts++
    } while (used.has(hash) && attempts < 50)
    used.add(hash)
    const type = pickType(level.allowedQuestionTypes)
    return buildQuestion({
      topicId: 'percentages', levelId: level.id, type,
      displayText: `כמה זה ${pct}% מ-${base}?`,
      expression: `${pct}% × ${base} = ?`,
      answer: String(answer),
      choices: type === 'multiple_choice' ? makeChoices(answer) : undefined,
      hintText: `${pct}% = ${pct}/100. חשבי: ${base} × ${pct} ÷ 100`,
    })
  }

  if (qType === 1) {
    // Hard: X is what % of Y?
    let part = 0
    do {
      pct = harder[randomInt(0, harder.length - 1)]
      base = niceBase(pct, 50, max)
      part = pctOf(base, pct)
      hash = `pct5b:${part}of${base}`
      attempts++
    } while (used.has(hash) && attempts < 50)
    used.add(hash)
    const type = pickType(level.allowedQuestionTypes)
    return buildQuestion({
      topicId: 'percentages', levelId: level.id, type,
      displayText: `${part} הם כמה אחוזים מ-${base}?`,
      expression: `${part} ÷ ${base} × 100 = ?%`,
      answer: String(pct),
      choices: type === 'multiple_choice' ? makePercentChoices(pct) : undefined,
      hintText: `(${part} ÷ ${base}) × 100`,
    })
  }

  if (qType === 2) {
    // Hard: price change
    let isUp = true, newVal = 0
    do {
      pct = harder[randomInt(0, harder.length - 1)]
      base = niceBase(pct, 50, max)
      isUp = Math.random() > 0.5
      newVal = isUp ? base + pctOf(base, pct) : base - pctOf(base, pct)
      hash = `pct5c:${base}${isUp ? '+' : '-'}${pct}`
      attempts++
    } while ((used.has(hash) || newVal <= 0) && attempts < 50)
    used.add(hash)
    const verb = isUp ? 'עלה' : 'ירד'
    const type = pickType(level.allowedQuestionTypes)
    return buildQuestion({
      topicId: 'percentages', levelId: level.id, type,
      displayText: `מוצר שעלה ${base} ₪ ${verb} ב-${pct}%. מה המחיר החדש?`,
      expression: `${base} ${isUp ? '+' : '−'} ${pct}% = ?`,
      answer: String(newVal),
      choices: type === 'multiple_choice' ? makeChoices(newVal, '₪') : undefined,
      hintText: `${pct}% מ-${base} = ${pctOf(base, pct)} ₪`,
    })
  }

  // Hard: find original
  let original = 0, isUp2 = true, newVal2 = 0
  do {
    pct = harder[randomInt(0, harder.length - 1)]
    original = niceBase(pct, 50, max)
    isUp2 = Math.random() > 0.5
    newVal2 = isUp2 ? original + pctOf(original, pct) : original - pctOf(original, pct)
    hash = `pct5d:${original}${isUp2 ? '+' : '-'}${pct}`
    attempts++
  } while ((used.has(hash) || newVal2 <= 0) && attempts < 50)
  used.add(hash)
  const verb2 = isUp2 ? 'עלייה' : 'הנחה'
  const type = pickType(level.allowedQuestionTypes)
  return buildQuestion({
    topicId: 'percentages', levelId: level.id, type,
    displayText: `אחרי ${verb2} של ${pct}%, המחיר הוא ${newVal2} ₪. מה המחיר המקורי?`,
    expression: `? ${isUp2 ? '+' : '−'} ${pct}% = ${newVal2} ₪`,
    answer: String(original),
    choices: type === 'multiple_choice' ? makeChoices(original, '₪') : undefined,
    hintText: `המחיר החדש = ${isUp2 ? 100 + pct : 100 - pct}% מהמקורי`,
  })
}

export function generatePercentages(level: Level, used: Set<string>): Question {
  switch (level.levelNumber) {
    case 1: return genL1(level, used)
    case 2: return genL2(level, used)
    case 3: return genL3(level, used)
    case 4: return genL4(level, used)
    default: return genL5(level, used)
  }
}

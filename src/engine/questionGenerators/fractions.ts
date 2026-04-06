import type { Level, Question } from '../../types'
import { randomInt, pickType, buildQuestion } from './utils'

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

function simplify(num: number, den: number): [number, number] {
  const g = gcd(Math.abs(num), Math.abs(den))
  return [num / g, den / g]
}

function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b)
}

/** Returns "3/4" or "3" if denominator is 1 */
function fracStr(num: number, den: number): string {
  return den === 1 ? String(num) : `${num}/${den}`
}

// ── Level 1: Identify a fraction ──────────────────────────────────────────────
function genLevel1(level: Level, used: Set<string>): Question {
  let den = 2, num = 1, hash = '', attempts = 0
  do {
    den = randomInt(2, 10)
    num = randomInt(1, den - 1)
    hash = `frac_id:${num}/${den}`
    attempts++
  } while (used.has(hash) && attempts < 50)
  used.add(hash)

  const type = pickType(level.allowedQuestionTypes)
  const choices = type === 'multiple_choice'
    ? [
        { id: '0', value: `${num}/${den}`,     label: `${num}/${den}` },
        { id: '1', value: `${den}/${num}`,     label: `${den}/${num}` },
        { id: '2', value: `${num + 1}/${den}`, label: `${num + 1}/${den}` },
        { id: '3', value: `${num}/${den + 1}`, label: `${num}/${den + 1}` },
      ].sort(() => Math.random() - 0.5)
    : undefined

  return buildQuestion({
    topicId: 'fractions',
    levelId: level.id,
    type,
    displayText: `מה השבר שמייצג ${num} חלקים מתוך ${den}?`,
    expression: `? / ${den}`,
    answer: `${num}/${den}`,
    choices,
    hintText: `שבר = מספר החלקים הצבועים / סך כל החלקים`,
  })
}

// ── Level 2: Simplify (reduce) a fraction ─────────────────────────────────────
function genLevel2(level: Level, used: Set<string>): Question {
  let num = 2, den = 4, hash = '', attempts = 0
  do {
    const factor = randomInt(2, 5)
    const sNum = randomInt(1, 5)
    const sDen = randomInt(sNum + 1, 9)
    // ensure reduced form is proper and different from original
    const [rn, rd] = simplify(sNum, sDen)
    num = rn * factor
    den = rd * factor
    hash = `frac_reduce:${num}/${den}`
    attempts++
    if (gcd(num, den) === 1) continue // already fully reduced — skip
  } while (used.has(hash) && attempts < 50)
  used.add(hash)

  const [sn, sd] = simplify(num, den)
  const answer = fracStr(sn, sd)

  const type = pickType(level.allowedQuestionTypes)
  const choices = type === 'multiple_choice'
    ? [
        { id: '0', value: answer,                    label: answer },
        { id: '1', value: `${sn + 1}/${sd}`,         label: `${sn + 1}/${sd}` },
        { id: '2', value: `${sn}/${sd + 1}`,         label: `${sn}/${sd + 1}` },
        { id: '3', value: `${num - 1}/${den}`,        label: `${num - 1}/${den}` },
      ].sort(() => Math.random() - 0.5)
    : undefined

  return buildQuestion({
    topicId: 'fractions',
    levelId: level.id,
    type,
    displayText: `פשטי את השבר: ${num}/${den}`,
    expression: `${num}/${den} = ?`,
    answer,
    choices,
    hintText: `חלקי מונה ומכנה במחלק המשותף הגדול (מ.מ.ג = ${gcd(num, den)})`,
  })
}

// ── Level 3: Expand a fraction (find missing numerator or denominator) ─────────
function genLevel3(level: Level, used: Set<string>): Question {
  let num = 1, den = 2, factor = 2, hash = '', attempts = 0
  do {
    const rawNum = randomInt(1, 5)
    const rawDen = randomInt(rawNum + 1, 8);
    [num, den] = simplify(rawNum, rawDen) // start from simplified form
    factor = randomInt(2, 6)
    hash = `frac_expand:${num}/${den}x${factor}`
    attempts++
  } while (used.has(hash) && attempts < 50)
  used.add(hash)

  const missingNumerator = Math.random() > 0.5
  const type = pickType(level.allowedQuestionTypes)

  if (missingNumerator) {
    const ans = String(num * factor)
    const choices = type === 'multiple_choice'
      ? [
          { id: '0', value: ans,                        label: ans },
          { id: '1', value: String(num * factor + 1),   label: String(num * factor + 1) },
          { id: '2', value: String(num * (factor - 1)), label: String(num * (factor - 1)) },
          { id: '3', value: String(num * factor + den),  label: String(num * factor + den) },
        ].sort(() => Math.random() - 0.5)
      : undefined

    return buildQuestion({
      topicId: 'fractions',
      levelId: level.id,
      type,
      displayText: `הרחיבי את השבר: ${num}/${den} = ?/${den * factor}`,
      expression: `${num}/${den} = ?/${den * factor}`,
      answer: ans,
      choices,
      hintText: `${den} × ${factor} = ${den * factor}, לכן גם המונה: ${num} × ${factor} = ?`,
    })
  } else {
    const ans = String(den * factor)
    const choices = type === 'multiple_choice'
      ? [
          { id: '0', value: ans,                        label: ans },
          { id: '1', value: String(den * factor + 1),   label: String(den * factor + 1) },
          { id: '2', value: String(den * (factor - 1)), label: String(den * (factor - 1)) },
          { id: '3', value: String(den * factor - num),  label: String(den * factor - num) },
        ].sort(() => Math.random() - 0.5)
      : undefined

    return buildQuestion({
      topicId: 'fractions',
      levelId: level.id,
      type,
      displayText: `הרחיבי את השבר: ${num}/${den} = ${num * factor}/?`,
      expression: `${num}/${den} = ${num * factor}/?`,
      answer: ans,
      choices,
      hintText: `${num} × ${factor} = ${num * factor}, לכן גם המכנה: ${den} × ${factor} = ?`,
    })
  }
}

// ── Levels 4–5: Add / subtract fractions ──────────────────────────────────────
function genAddSubtract(level: Level, used: Set<string>): Question {
  const levelNum = level.levelNumber
  let den1 = 2, den2 = 3, num1 = 1, num2 = 1
  let ansNum = 0, ansDen = 1, isAdd = true, hash = '', attempts = 0

  do {
    if (levelNum === 4) {
      // Level 4: same denominator or one is a multiple of the other
      den1 = randomInt(2, 8)
      den2 = Math.random() > 0.5 ? den1 : den1 * randomInt(2, 3)
      if (den2 > 15) den2 = den1
    } else {
      // Level 5: unrelated denominators
      den1 = randomInt(2, 9)
      den2 = randomInt(2, 9)
      while (den2 === den1) den2 = randomInt(2, 9)
    }

    num1 = randomInt(1, den1 - 1)
    num2 = randomInt(1, den2 - 1)
    isAdd = Math.random() > 0.35

    const common = lcm(den1, den2)
    const n1 = num1 * (common / den1)
    const n2 = num2 * (common / den2)
    const raw = isAdd ? n1 + n2 : n1 - n2

    if (raw <= 0) { attempts++; continue }

    ;[ansNum, ansDen] = simplify(raw, common)
    hash = `frac_op${levelNum}:${num1}/${den1}${isAdd ? '+' : '-'}${num2}/${den2}`
    attempts++
  } while (used.has(hash) && attempts < 50)

  used.add(hash)

  const answer = fracStr(ansNum, ansDen)
  const common = lcm(den1, den2)
  const op = isAdd ? '+' : '−'

  return buildQuestion({
    topicId: 'fractions',
    levelId: level.id,
    type: 'numeric_input',
    displayText: `חשבי: ${num1}/${den1} ${op} ${num2}/${den2}`,
    expression: `${num1}/${den1} ${op} ${num2}/${den2} = ?`,
    answer,
    hintText: common === den1
      ? `המכנה המשותף הוא ${common}. הרחיבי את ${num2}/${den2}`
      : `מכנה משותף: ${common}. הרחיבי את שני השברים ואז ${isAdd ? 'חברי' : 'חסרי'}`,
  })
}

export function generateFractions(level: Level, used: Set<string>): Question {
  switch (level.levelNumber) {
    case 1: return genLevel1(level, used)
    case 2: return genLevel2(level, used)
    case 3: return genLevel3(level, used)
    default: return genAddSubtract(level, used)
  }
}

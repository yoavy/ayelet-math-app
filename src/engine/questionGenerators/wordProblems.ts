import type { Level, Question, TopicId } from '../../types'
import { randomInt, makeChoices, buildQuestion } from './utils'

interface Template {
  id: string
  requiresTopic: TopicId   // which math topic this problem exercises
  text: (a: number, b: number, name: string) => string
  answer: (a: number, b: number) => number
  constraint: (a: number, b: number) => boolean
  hint: string
}

const TEMPLATES: Template[] = [
  {
    id: 'shopping',
    requiresTopic: 'subtraction',
    text: (a, b, name) => `ל${name} יש ${a} שקלים. היא קנתה ספר ב-${b} שקלים. כמה שקלים נשארו לה?`,
    answer: (a, b) => a - b,
    constraint: (a, b) => a > b,
    hint: 'כמה כסף היה פחות כמה הוצאה',
  },
  {
    id: 'stickers',
    requiresTopic: 'addition',
    text: (a, b, name) => `ל${name} יש ${a} מדבקות. היא קיבלה עוד ${b} מדבקות במתנה. כמה מדבקות יש לה עכשיו?`,
    answer: (a, b) => a + b,
    constraint: () => true,
    hint: 'חברי את שני המספרים',
  },
  {
    id: 'sharing',
    requiresTopic: 'division',
    text: (a, b, name) => `${name} ו-${b - 1} חברות שלה חילקו ${a * b} ממתקים שווה בשווה. כמה ממתקים קיבלה כל ילדה?`,
    answer: (a, _b) => a,
    constraint: (_a, b) => b >= 2,
    hint: 'חלקי את הממתקים במספר הילדות',
  },
  {
    id: 'boxes',
    requiresTopic: 'multiplication',
    text: (a, b, name) => `${name} ארזה ${a} קופסאות. בכל קופסא יש ${b} עוגיות. כמה עוגיות בסך הכל?`,
    answer: (a, b) => a * b,
    constraint: () => true,
    hint: 'כפלי מספר קופסאות בעוגיות בכל קופסא',
  },
  {
    id: 'books',
    requiresTopic: 'addition',
    text: (a, b, name) => `${name} קראה ${a} עמודים ביום ראשון ו-${b} עמודים ביום שני. כמה עמודים קראה בסך הכל?`,
    answer: (a, b) => a + b,
    constraint: () => true,
    hint: 'חברי את מספר העמודים משני הימים',
  },
  {
    id: 'distance',
    requiresTopic: 'addition',
    text: (a, b, name) => `${name} הלכה ${a} קילומטרים בבוקר ו-${b} קילומטרים בערב. כמה קילומטרים הלכה בסך הכל?`,
    answer: (a, b) => a + b,
    constraint: () => true,
    hint: 'חברי את שתי המרחקים',
  },
  {
    id: 'tickets',
    requiresTopic: 'division',
    text: (a, b, name) => `כרטיס קולנוע עולה ${b} שקלים. ל${name} יש ${a} שקלים. כמה כרטיסים יכולה היא לקנות?`,
    answer: (a, b) => Math.floor(a / b),
    constraint: (a, b) => b > 0 && a >= b,
    hint: 'חלקי את הכסף שיש בעלות כרטיס',
  },
  {
    id: 'flowers',
    requiresTopic: 'division',
    text: (a, b, name) => `${name} קטפה ${a * b} פרחים וסידרה אותם ב-${a} אגרטלים. כמה פרחים בכל אגרטל?`,
    answer: (_a, b) => b,
    constraint: (a) => a >= 2,
    hint: 'חלקי את מספר הפרחים במספר האגרטלים',
  },
]

let _templateIndex = 0

export function generateWordProblem(
  level: Level,
  used: Set<string>,
  userName = 'אביגיל',
  unlockedTopicIds: string[] = ['addition']
): Question {
  const { minValue, maxValue } = level.difficultyParams

  // Only use templates whose required topic is unlocked
  const available = TEMPLATES.filter(t => unlockedTopicIds.includes(t.requiresTopic))
  const pool = available.length > 0 ? available : TEMPLATES.filter(t => t.requiresTopic === 'addition')

  let template: Template = pool[0]
  let a = 0, b = 0, answer = 0, hash = ''
  let found = false
  let attempts = 0

  while (!found && attempts < 80) {
    template = pool[_templateIndex % pool.length]
    _templateIndex++
    a = randomInt(Math.max(2, minValue), maxValue)
    b = randomInt(Math.max(2, minValue), Math.min(maxValue, a))
    attempts++
    if (!template.constraint(a, b)) continue
    answer = template.answer(a, b)
    hash = `wp:${template.id}_${a}_${b}`
    if (!used.has(hash)) found = true
  }

  used.add(hash)

  const text = template.text(a, b, userName)
  const type = level.allowedQuestionTypes.includes('word_problem')
    ? (level.allowedQuestionTypes.includes('multiple_choice') && Math.random() > 0.6 ? 'multiple_choice' : 'word_problem')
    : 'word_problem'

  return buildQuestion({
    topicId: level.topicId,
    levelId: level.id,
    type,
    displayText: text,
    answer,
    choices: type === 'multiple_choice' ? makeChoices(answer, maxValue * 2) : undefined,
    hintText: template.hint,
  })
}

/**
 * Shared answer-checking utility used by both the game reducer and the learn stage.
 * Handles string/numeric comparison with tolerance for floating-point values.
 */
export function isAnswerCorrect(correct: string, given: string): boolean {
  const c = correct.trim().replace(',', '.')
  const g = given.trim().replace(',', '.')
  if (c === g) return true
  const cn = parseFloat(c)
  const gn = parseFloat(g)
  if (!isNaN(cn) && !isNaN(gn)) return Math.abs(cn - gn) < 0.001
  return false
}

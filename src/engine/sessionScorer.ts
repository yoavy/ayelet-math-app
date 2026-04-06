export function calculatePoints(
  streak: number,
  timeSpentMs: number,
  timeLimitSeconds: number | null,
  hintsUsed: number
): number {
  const base = 10
  const multiplier = Math.min(1 + Math.floor(streak / 3) * 0.5, 3)
  let speedBonus = 1
  if (timeLimitSeconds && timeLimitSeconds > 0) {
    const timeRemaining = Math.max(0, timeLimitSeconds - timeSpentMs / 1000)
    speedBonus = 1 + (timeRemaining / timeLimitSeconds) * 0.5
  }
  const hintPenalty = hintsUsed * 3
  return Math.max(0, Math.round(base * multiplier * speedBonus) - hintPenalty)
}

export function calculateStars(correctCount: number, totalCount: number): 0 | 1 | 2 | 3 {
  const pct = correctCount / totalCount
  if (pct >= 1.0) return 3
  if (pct >= 0.8) return 2
  if (pct >= 0.7) return 1
  return 0
}

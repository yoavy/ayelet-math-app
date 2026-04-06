import type { Difficulty, Level, Question, TopicId } from '../../types'
import { generateAddition } from './addition'
import { generateSubtraction } from './subtraction'
import { generateMultiplication } from './multiplication'
import { generateDivision } from './division'
import { generateFractions } from './fractions'
import { generateDecimals } from './decimals'
import { generateGeometry } from './geometry'
import { generateWordProblem } from './wordProblems'
import { generatePercentages } from './percentages'

type GeneratorFn = (level: Level, used: Set<string>, userName?: string) => Question

const GENERATORS: Record<TopicId, GeneratorFn> = {
  addition: generateAddition,
  subtraction: generateSubtraction,
  multiplication: generateMultiplication,
  division: generateDivision,
  fractions: generateFractions,
  decimals: generateDecimals,
  geometry: generateGeometry,
  wordProblems: generateWordProblem,
  percentages: generatePercentages,
}

/** Scale a level's difficultyParams and timeLimitSeconds by the global difficulty. */
function applyDifficulty(level: Level, difficulty: Difficulty): Level {
  if (difficulty === 'medium') return level
  const numScale = difficulty === 'easy' ? 0.55 : 1.75
  const timeScale = difficulty === 'easy' ? 1.6 : 0.7
  return {
    ...level,
    difficultyParams: {
      ...level.difficultyParams,
      minValue: Math.max(1, Math.round(level.difficultyParams.minValue * numScale)),
      maxValue: Math.max(3, Math.round(level.difficultyParams.maxValue * numScale)),
    },
    timeLimitSeconds: level.timeLimitSeconds
      ? Math.max(10, Math.round(level.timeLimitSeconds * timeScale))
      : null,
  }
}

export function generateQuestion(level: Level, used: Set<string>, userName?: string): Question {
  const gen = GENERATORS[level.topicId]
  return gen(level, used, userName)
}

export function buildSession(
  level: Level,
  userName?: string,
  difficulty: Difficulty = 'medium',
): Question[] {
  const adjustedLevel = applyDifficulty(level, difficulty)
  const used = new Set<string>()
  return Array.from({ length: level.questionsPerSession }, () =>
    generateQuestion(adjustedLevel, used, userName)
  )
}

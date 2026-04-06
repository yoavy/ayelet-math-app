import type { UserProfile, GameSession, Score, Badge, DailyActivity, Difficulty } from '../types'

export type AppAction =
  | { type: 'SET_USER_PROFILE'; payload: UserProfile }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'START_SESSION'; payload: GameSession }
  | { type: 'ANSWER_QUESTION'; payload: { answer: number | string; timeSpentMs: number; hintsUsed: number } }
  | { type: 'END_SESSION' }
  | { type: 'SAVE_SCORE'; payload: Score }
  | { type: 'AWARD_BADGE'; payload: Badge }
  | { type: 'CONSUME_PENDING_BADGE' }
  | { type: 'UPDATE_DAILY_ACTIVITY'; payload: Partial<DailyActivity> & { date: string } }
  | { type: 'SET_PARENT_PIN'; payload: string }
  | { type: 'ADD_POINTS'; payload: number }
  | { type: 'UPDATE_TITLE'; payload: string }
  | { type: 'SET_DIFFICULTY'; payload: Difficulty }

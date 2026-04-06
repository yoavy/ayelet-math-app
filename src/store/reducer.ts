import type { AppState, Score } from '../types'
import type { AppAction } from './actions'
import { calculatePoints, calculateStars } from '../engine/sessionScorer'
import { checkBadgeConditions } from '../engine/badgeChecker'
import { resolveTitle } from '../data/titles'
import { BADGES } from '../data/badges'

export const initialState: AppState = {
  userProfile: null,
  scores: {},
  activeSession: null,
  pendingBadges: [],
  weeklyData: [],
}

export function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {

    case 'SET_USER_PROFILE':
      return { ...state, userProfile: action.payload }

    case 'COMPLETE_ONBOARDING':
      if (!state.userProfile) return state
      return {
        ...state,
        userProfile: { ...state.userProfile, onboardingComplete: true },
      }

    case 'START_SESSION':
      return { ...state, activeSession: action.payload }

    case 'ANSWER_QUESTION': {
      const session = state.activeSession
      if (!session || session.isComplete) return state

      const { answer, timeSpentMs, hintsUsed } = action.payload
      const sessionQ = session.questions[session.currentQuestionIndex]
      const correct = isAnswerCorrect(String(sessionQ.question.answer), String(answer))

      const newStreak = correct ? session.currentStreak + 1 : 0
      const multiplier = getMultiplier(newStreak)

      const timeLimitSeconds = sessionQ.question.type !== 'word_problem'
        ? (state.activeSession as typeof session).questions.length > 0
          ? null
          : null
        : null

      const pts = correct
        ? calculatePoints(session.currentStreak, timeSpentMs, timeLimitSeconds, hintsUsed)
        : 0

      const updatedQuestions = session.questions.map((q, i) =>
        i === session.currentQuestionIndex
          ? { ...q, userAnswer: answer, isCorrect: correct, answeredAt: Date.now(), timeSpentMs, pointsAwarded: pts, hintsUsed }
          : q
      )

      const nextIndex = session.currentQuestionIndex + 1
      const isComplete = nextIndex >= session.questions.length

      return {
        ...state,
        activeSession: {
          ...session,
          questions: updatedQuestions,
          currentQuestionIndex: nextIndex,
          currentStreak: newStreak,
          streakMultiplier: multiplier,
          pointsThisSession: session.pointsThisSession + pts,
          isComplete,
        },
      }
    }

    case 'END_SESSION': {
      const session = state.activeSession
      if (!session) return state

      const correctCount = session.questions.filter(q => q.isCorrect).length
      const totalCount = session.questions.length
      const bestStreak = session.questions.reduce((max, _, i, arr) => {
        let run = 0
        for (let j = i; j < arr.length && arr[j].isCorrect; j++) run++
        return Math.max(max, run)
      }, 0)

      // Find level to get star thresholds
      // We'll look these up from TOPICS in the context provider instead
      const stars = calculateStars(correctCount, totalCount)
      const isPassed = correctCount >= Math.ceil(totalCount * 0.7)

      const existingScore = state.scores[session.levelId]
      const newScore: Score = {
        levelId: session.levelId,
        topicId: session.topicId,
        stars,
        pointsEarned: session.pointsThisSession,
        correctCount,
        totalCount,
        bestStreak,
        completedAt: Date.now(),
        attempts: (existingScore?.attempts ?? 0) + 1,
      }

      // Only replace if new score is better (more stars) or first time
      const shouldReplace = !existingScore || newScore.stars >= existingScore.stars
      const updatedScores = shouldReplace
        ? { ...state.scores, [session.levelId]: newScore }
        : state.scores

      // Update profile points and title
      let newProfile = state.userProfile
      if (newProfile && session.pointsThisSession > 0) {
        const newPoints = newProfile.totalPoints + session.pointsThisSession
        const newTitle = resolveTitle(newPoints, newProfile.gender ?? 'female').nameHebrew
        newProfile = {
          ...newProfile,
          totalPoints: newPoints,
          currentTitle: newTitle,
          maxStreak: Math.max(newProfile.maxStreak, bestStreak),
          lastPlayedAt: Date.now(),
        }
      }

      // Check for new badges
      const newBadges = newProfile
        ? checkBadgeConditions(newProfile, updatedScores, BADGES)
        : []

      const updatedProfile = newProfile
        ? {
            ...newProfile,
            badgeIds: [
              ...newProfile.badgeIds,
              ...newBadges.map(b => b.id).filter(id => !newProfile!.badgeIds.includes(id)),
            ],
          }
        : newProfile

      return {
        ...state,
        activeSession: { ...session, isComplete: true, isPassed, endedAt: Date.now() },
        scores: updatedScores,
        userProfile: updatedProfile,
        pendingBadges: [...state.pendingBadges, ...newBadges],
      }
    }

    case 'AWARD_BADGE': {
      const badge = action.payload
      if (!state.userProfile || state.userProfile.badgeIds.includes(badge.id)) return state
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          badgeIds: [...state.userProfile.badgeIds, badge.id],
        },
        pendingBadges: [...state.pendingBadges, badge],
      }
    }

    case 'CONSUME_PENDING_BADGE':
      return { ...state, pendingBadges: state.pendingBadges.slice(1) }

    case 'UPDATE_DAILY_ACTIVITY': {
      const { date, ...delta } = action.payload
      const existing = state.weeklyData.find(d => d.date === date)
      const updated = existing
        ? {
            ...existing,
            sessionsPlayed: (existing.sessionsPlayed ?? 0) + (delta.sessionsPlayed ?? 0),
            pointsEarned: (existing.pointsEarned ?? 0) + (delta.pointsEarned ?? 0),
            questionsAnswered: (existing.questionsAnswered ?? 0) + (delta.questionsAnswered ?? 0),
            correctAnswers: (existing.correctAnswers ?? 0) + (delta.correctAnswers ?? 0),
          }
        : { date, sessionsPlayed: 0, pointsEarned: 0, questionsAnswered: 0, correctAnswers: 0, ...delta }

      const others = state.weeklyData.filter(d => d.date !== date)
      const cutoff = Date.now() - 60 * 24 * 60 * 60 * 1000
      const pruned = [...others, updated].filter(d => new Date(d.date).getTime() >= cutoff)
      return { ...state, weeklyData: pruned }
    }

    case 'SET_PARENT_PIN':
      if (!state.userProfile) return state
      return { ...state, userProfile: { ...state.userProfile, parentPin: action.payload } }

    case 'ADD_POINTS': {
      if (!state.userProfile) return state
      const newPoints = state.userProfile.totalPoints + action.payload
      const newTitle = resolveTitle(newPoints).nameHebrew
      return {
        ...state,
        userProfile: { ...state.userProfile, totalPoints: newPoints, currentTitle: newTitle },
      }
    }

    case 'UPDATE_TITLE':
      if (!state.userProfile) return state
      return { ...state, userProfile: { ...state.userProfile, currentTitle: action.payload } }

    case 'SET_DIFFICULTY':
      if (!state.userProfile) return state
      return { ...state, userProfile: { ...state.userProfile, difficulty: action.payload } }

    default:
      return state
  }
}

function isAnswerCorrect(correct: string, given: string): boolean {
  const c = correct.trim().replace(',', '.')
  const g = given.trim().replace(',', '.')
  if (c === g) return true
  const cn = parseFloat(c)
  const gn = parseFloat(g)
  if (!isNaN(cn) && !isNaN(gn)) return Math.abs(cn - gn) < 0.001
  return false
}

function getMultiplier(streak: number): number {
  return Math.min(1 + Math.floor(streak / 3) * 0.5, 3)
}

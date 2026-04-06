import { useCallback } from 'react'
import { useApp } from '../store/AppContext'
import { buildSession } from '../engine/questionGenerators'
import type { Level, SessionQuestion } from '../types'

let _sessionCounter = 0

export function useGameSession() {
  const { state, dispatch } = useApp()

  const startSession = useCallback((level: Level) => {
    const userName = state.userProfile?.name
    const difficulty = state.userProfile?.difficulty ?? 'medium'
    const questions = buildSession(level, userName, difficulty)
    const sessionQuestions: SessionQuestion[] = questions.map(q => ({
      question: q,
      userAnswer: null,
      isCorrect: null,
      answeredAt: null,
      timeSpentMs: null,
      pointsAwarded: 0,
      hintsUsed: 0,
    }))

    dispatch({
      type: 'START_SESSION',
      payload: {
        id: `session_${Date.now()}_${++_sessionCounter}`,
        topicId: level.topicId,
        levelId: level.id,
        startedAt: Date.now(),
        endedAt: null,
        questions: sessionQuestions,
        currentQuestionIndex: 0,
        currentStreak: 0,
        pointsThisSession: 0,
        streakMultiplier: 1,
        isComplete: false,
        isPassed: false,
      },
    })
  }, [state.userProfile?.name, state.userProfile?.difficulty, dispatch])

  const answerQuestion = useCallback((answer: number | string, timeSpentMs: number, hintsUsed = 0) => {
    dispatch({ type: 'ANSWER_QUESTION', payload: { answer, timeSpentMs, hintsUsed } })
  }, [dispatch])

  const endSession = useCallback(() => {
    const session = state.activeSession
    if (!session) return
    dispatch({ type: 'END_SESSION' })

    // Update daily activity
    const today = new Date().toISOString().split('T')[0]
    const correct = session.questions.filter(q => q.isCorrect).length
    dispatch({
      type: 'UPDATE_DAILY_ACTIVITY',
      payload: {
        date: today,
        sessionsPlayed: 1,
        pointsEarned: session.pointsThisSession,
        questionsAnswered: session.questions.length,
        correctAnswers: correct,
      },
    })
  }, [state.activeSession, dispatch])

  return {
    session: state.activeSession,
    startSession,
    answerQuestion,
    endSession,
    currentQuestion: state.activeSession?.questions[state.activeSession.currentQuestionIndex]?.question ?? null,
  }
}

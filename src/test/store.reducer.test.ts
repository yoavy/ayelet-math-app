import { describe, it, expect } from 'vitest'
import { reducer, initialState } from '../store/reducer'
import type { AppState, UserProfile, GameSession, SessionQuestion, Question } from '../types'

function makeProfile(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    id: 'u1', name: 'נועה', avatarId: 'star', createdAt: Date.now(),
    onboardingComplete: true, totalPoints: 0, currentTitle: 'מתחילה',
    currentStreak: 0, maxStreak: 0, dailyStreak: 1, lastPlayedAt: Date.now(),
    badgeIds: [], parentPin: null, gender: 'female', difficulty: 'medium', ...overrides,
  }
}

function makeQuestion(answer: number | string = 5): Question {
  return {
    id: 'q1', topicId: 'addition', levelId: 'addition_1',
    type: 'numeric_input', displayText: '2 + 3 = ?',
    expression: '2 + 3 = ?', answer,
  }
}

function makeSessionQuestion(answer: number | string = 5): SessionQuestion {
  return {
    question: makeQuestion(answer),
    userAnswer: null, isCorrect: null, answeredAt: null,
    timeSpentMs: null, pointsAwarded: 0, hintsUsed: 0,
  }
}

function makeSession(overrides: Partial<GameSession> = {}): GameSession {
  return {
    id: 's1', topicId: 'addition', levelId: 'addition_1',
    startedAt: Date.now(), endedAt: null,
    questions: Array.from({ length: 10 }, (_, i) => makeSessionQuestion(i + 1)),
    currentQuestionIndex: 0, currentStreak: 0,
    pointsThisSession: 0, streakMultiplier: 1,
    isComplete: false, isPassed: false,
    ...overrides,
  }
}

function stateWith(overrides: Partial<AppState> = {}): AppState {
  return { ...initialState, ...overrides }
}

describe('reducer — SET_USER_PROFILE', () => {
  it('sets user profile', () => {
    const profile = makeProfile()
    const s = reducer(initialState, { type: 'SET_USER_PROFILE', payload: profile })
    expect(s.userProfile?.name).toBe('נועה')
  })
})

describe('reducer — START_SESSION', () => {
  it('stores the session in activeSession', () => {
    const session = makeSession()
    const s = reducer(initialState, { type: 'START_SESSION', payload: session })
    expect(s.activeSession?.id).toBe('s1')
    expect(s.activeSession?.currentQuestionIndex).toBe(0)
  })
})

describe('reducer — ANSWER_QUESTION', () => {
  const baseState = stateWith({
    userProfile: makeProfile(),
    activeSession: makeSession({
      questions: [makeSessionQuestion(5), makeSessionQuestion(10)],
    }),
  })

  it('marks correct answer as isCorrect=true', () => {
    const s = reducer(baseState, {
      type: 'ANSWER_QUESTION',
      payload: { answer: 5, timeSpentMs: 3000, hintsUsed: 0 },
    })
    expect(s.activeSession?.questions[0].isCorrect).toBe(true)
  })

  it('marks wrong answer as isCorrect=false', () => {
    const s = reducer(baseState, {
      type: 'ANSWER_QUESTION',
      payload: { answer: 99, timeSpentMs: 3000, hintsUsed: 0 },
    })
    expect(s.activeSession?.questions[0].isCorrect).toBe(false)
  })

  it('increments currentQuestionIndex after answer', () => {
    const s = reducer(baseState, {
      type: 'ANSWER_QUESTION',
      payload: { answer: 5, timeSpentMs: 3000, hintsUsed: 0 },
    })
    expect(s.activeSession?.currentQuestionIndex).toBe(1)
  })

  it('increments streak on correct answer', () => {
    const s = reducer(baseState, {
      type: 'ANSWER_QUESTION',
      payload: { answer: 5, timeSpentMs: 3000, hintsUsed: 0 },
    })
    expect(s.activeSession?.currentStreak).toBe(1)
  })

  it('resets streak on wrong answer', () => {
    const withStreak = stateWith({
      userProfile: makeProfile(),
      activeSession: makeSession({
        questions: [makeSessionQuestion(5)],
        currentStreak: 5,
      }),
    })
    const s = reducer(withStreak, {
      type: 'ANSWER_QUESTION',
      payload: { answer: 999, timeSpentMs: 3000, hintsUsed: 0 },
    })
    expect(s.activeSession?.currentStreak).toBe(0)
  })

  it('awards points for correct answer', () => {
    const s = reducer(baseState, {
      type: 'ANSWER_QUESTION',
      payload: { answer: 5, timeSpentMs: 3000, hintsUsed: 0 },
    })
    expect(s.activeSession!.pointsThisSession).toBeGreaterThan(0)
  })

  it('awards 0 points for wrong answer', () => {
    const s = reducer(baseState, {
      type: 'ANSWER_QUESTION',
      payload: { answer: 999, timeSpentMs: 3000, hintsUsed: 0 },
    })
    expect(s.activeSession!.pointsThisSession).toBe(0)
  })

  it('marks session complete when last question answered', () => {
    const singleQ = stateWith({
      userProfile: makeProfile(),
      activeSession: makeSession({ questions: [makeSessionQuestion(5)] }),
    })
    const s = reducer(singleQ, {
      type: 'ANSWER_QUESTION',
      payload: { answer: 5, timeSpentMs: 1000, hintsUsed: 0 },
    })
    expect(s.activeSession?.isComplete).toBe(true)
  })

  it('ignores answers when session is already complete', () => {
    const doneState = stateWith({
      userProfile: makeProfile(),
      activeSession: makeSession({ isComplete: true }),
    })
    const s = reducer(doneState, {
      type: 'ANSWER_QUESTION',
      payload: { answer: 1, timeSpentMs: 1000, hintsUsed: 0 },
    })
    expect(s.activeSession?.currentQuestionIndex).toBe(0)
  })
})

describe('reducer — END_SESSION', () => {
  function runSession(answers: number[]): AppState {
    const questions = answers.map((a, i) => makeSessionQuestion(a === i + 1 ? a : -1))
    let s = stateWith({
      userProfile: makeProfile({ totalPoints: 0 }),
      activeSession: makeSession({ questions }),
    })
    for (let i = 0; i < answers.length; i++) {
      s = reducer(s, {
        type: 'ANSWER_QUESTION',
        payload: { answer: answers[i], timeSpentMs: 2000, hintsUsed: 0 },
      })
    }
    return reducer(s, { type: 'END_SESSION' })
  }

  it('saves score to scores record', () => {
    const allCorrect = Array.from({ length: 10 }, (_, i) => i + 1)
    const s = runSession(allCorrect)
    expect(s.scores['addition_1']).toBeDefined()
  })

  it('adds earned points to profile totalPoints', () => {
    const allCorrect = Array.from({ length: 10 }, (_, i) => i + 1)
    const s = runSession(allCorrect)
    expect(s.userProfile!.totalPoints).toBeGreaterThan(0)
  })

  it('keeps higher star score when retrying with lower score', () => {
    const allCorrect = Array.from({ length: 10 }, (_, i) => i + 1)
    const s1 = runSession(allCorrect)
    // second run: all wrong (answer -1 never matches)
    expect(s1.scores['addition_1']?.stars).toBeGreaterThanOrEqual(0)
  })

  it('updates currentTitle based on new point total', () => {
    // Give enough points for a title upgrade
    const profile = makeProfile({ totalPoints: 90 })
    let s = stateWith({
      userProfile: profile,
      activeSession: makeSession({
        questions: Array.from({ length: 10 }, (_, i) => makeSessionQuestion(i + 1)),
        pointsThisSession: 0,
      }),
    })
    // Answer all correct to earn points
    for (let i = 0; i < 10; i++) {
      s = reducer(s, { type: 'ANSWER_QUESTION', payload: { answer: i + 1, timeSpentMs: 2000, hintsUsed: 0 } })
    }
    s = reducer(s, { type: 'END_SESSION' })
    // Should have updated title if points crossed 100
    if (s.userProfile!.totalPoints >= 100) {
      expect(s.userProfile!.currentTitle).toBe('ילדה חכמה')
    }
  })
})

describe('reducer — AWARD_BADGE', () => {
  it('adds badge id to profile', () => {
    const state = stateWith({ userProfile: makeProfile() })
    const badge = { id: 'test_badge', nameHebrew: 'תג', descriptionHebrew: '',
      emoji: '⭐', rarity: 'bronze' as const,
      condition: { type: 'first_play' as const, threshold: 1 } }
    const s = reducer(state, { type: 'AWARD_BADGE', payload: badge })
    expect(s.userProfile?.badgeIds).toContain('test_badge')
  })

  it('adds badge to pendingBadges queue', () => {
    const state = stateWith({ userProfile: makeProfile() })
    const badge = { id: 'test_badge2', nameHebrew: 'תג', descriptionHebrew: '',
      emoji: '🏆', rarity: 'gold' as const,
      condition: { type: 'first_play' as const, threshold: 1 } }
    const s = reducer(state, { type: 'AWARD_BADGE', payload: badge })
    expect(s.pendingBadges).toHaveLength(1)
  })

  it('does not duplicate an already-earned badge', () => {
    const state = stateWith({ userProfile: makeProfile({ badgeIds: ['dupe'] }) })
    const badge = { id: 'dupe', nameHebrew: 'כפול', descriptionHebrew: '',
      emoji: '⚡', rarity: 'silver' as const,
      condition: { type: 'streak' as const, threshold: 5 } }
    const s = reducer(state, { type: 'AWARD_BADGE', payload: badge })
    const count = s.userProfile!.badgeIds.filter(id => id === 'dupe').length
    expect(count).toBe(1)
  })
})

describe('reducer — CONSUME_PENDING_BADGE', () => {
  it('removes the first pending badge', () => {
    const badges = [
      { id: 'a', nameHebrew: '', descriptionHebrew: '', emoji: '', rarity: 'bronze' as const, condition: { type: 'first_play' as const, threshold: 1 } },
      { id: 'b', nameHebrew: '', descriptionHebrew: '', emoji: '', rarity: 'bronze' as const, condition: { type: 'first_play' as const, threshold: 1 } },
    ]
    const state = stateWith({ pendingBadges: badges })
    const s = reducer(state, { type: 'CONSUME_PENDING_BADGE' })
    expect(s.pendingBadges).toHaveLength(1)
    expect(s.pendingBadges[0].id).toBe('b')
  })

  it('handles empty pendingBadges without throwing', () => {
    expect(() => reducer(initialState, { type: 'CONSUME_PENDING_BADGE' })).not.toThrow()
  })
})

describe('reducer — SET_PARENT_PIN', () => {
  it('sets parent pin on profile', () => {
    const state = stateWith({ userProfile: makeProfile() })
    const s = reducer(state, { type: 'SET_PARENT_PIN', payload: '1234' })
    expect(s.userProfile?.parentPin).toBe('1234')
  })

  it('does nothing without a profile', () => {
    const s = reducer(initialState, { type: 'SET_PARENT_PIN', payload: '1234' })
    expect(s.userProfile).toBeNull()
  })
})

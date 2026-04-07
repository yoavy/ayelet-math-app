import { useState, useCallback } from 'react'
import { isAnswerCorrect } from '../engine/answerChecker'
import type { TopicLearnContent, LearnSlide, LearnValidationQuestion } from '../types'

export type LearnPhase =
  | 'explanation'     // showing the slide explanation + visual
  | 'question'        // showing validation question
  | 'wrong_answer'    // brief wrong-answer feedback (before retry)
  | 'slide_complete'  // all questions in this slide answered correctly
  | 'all_done'        // all slides completed

export interface LearnSessionState {
  slideIndex: number
  questionIndex: number
  phase: LearnPhase
  inputValue: string
  wrongAttempts: number
  showHint: boolean
  animKey: number
}

export interface LearnSessionAPI {
  // State
  phase: LearnPhase
  slideIndex: number
  questionIndex: number
  inputValue: string
  wrongAttempts: number
  showHint: boolean
  animKey: number
  // Derived
  currentSlide: LearnSlide
  currentQuestion: LearnValidationQuestion | null
  totalSlides: number
  // Handlers
  handleUnderstood: () => void
  handleAnswer: (answer: string | number) => void
  handleNext: () => void
  setInputValue: (v: string) => void
}

export function useLearnSession(content: TopicLearnContent): LearnSessionAPI {
  const [state, setState] = useState<LearnSessionState>({
    slideIndex: 0,
    questionIndex: 0,
    phase: 'explanation',
    inputValue: '',
    wrongAttempts: 0,
    showHint: false,
    animKey: 0,
  })

  const currentSlide = content.slides[state.slideIndex]
  const currentQuestion =
    state.phase === 'question' || state.phase === 'wrong_answer'
      ? currentSlide.validationQuestions[state.questionIndex] ?? null
      : null

  // User clicks "הבנתי!" — advance from explanation to first question
  const handleUnderstood = useCallback(() => {
    setState(s => ({
      ...s,
      phase: 'question',
      questionIndex: 0,
      inputValue: '',
      wrongAttempts: 0,
      showHint: false,
      animKey: s.animKey + 1,
    }))
  }, [])

  // User submits an answer
  const handleAnswer = useCallback((answer: string | number) => {
    const slide = content.slides[state.slideIndex]
    const question = slide.validationQuestions[state.questionIndex]
    if (!question) return

    const correct = isAnswerCorrect(String(question.answer), String(answer))

    if (correct) {
      const nextQIndex = state.questionIndex + 1
      const hasMoreQuestions = nextQIndex < slide.validationQuestions.length

      if (hasMoreQuestions) {
        // Move to next question in same slide
        setState(s => ({
          ...s,
          questionIndex: nextQIndex,
          inputValue: '',
          wrongAttempts: 0,
          showHint: false,
          animKey: s.animKey + 1,
        }))
      } else {
        // All questions in this slide done
        setState(s => ({
          ...s,
          phase: 'slide_complete',
          inputValue: '',
          animKey: s.animKey + 1,
        }))
      }
    } else {
      // Wrong answer — increment attempts, maybe show hint
      const newAttempts = state.wrongAttempts + 1
      setState(s => ({
        ...s,
        wrongAttempts: newAttempts,
        showHint: newAttempts >= 2,
        inputValue: '',
      }))
    }
  }, [content, state.slideIndex, state.questionIndex, state.wrongAttempts])

  // User clicks "הבאה" / "בואי נשחק" after slide complete
  const handleNext = useCallback(() => {
    const nextSlideIndex = state.slideIndex + 1
    const hasMoreSlides = nextSlideIndex < content.slides.length

    if (hasMoreSlides) {
      setState(s => ({
        ...s,
        slideIndex: nextSlideIndex,
        questionIndex: 0,
        phase: 'explanation',
        inputValue: '',
        wrongAttempts: 0,
        showHint: false,
        animKey: s.animKey + 1,
      }))
    } else {
      setState(s => ({ ...s, phase: 'all_done', animKey: s.animKey + 1 }))
    }
  }, [content.slides.length, state.slideIndex])

  const setInputValue = useCallback((v: string) => {
    setState(s => ({ ...s, inputValue: v }))
  }, [])

  return {
    phase: state.phase,
    slideIndex: state.slideIndex,
    questionIndex: state.questionIndex,
    inputValue: state.inputValue,
    wrongAttempts: state.wrongAttempts,
    showHint: state.showHint,
    animKey: state.animKey,
    currentSlide,
    currentQuestion,
    totalSlides: content.slides.length,
    handleUnderstood,
    handleAnswer,
    handleNext,
    setInputValue,
  }
}

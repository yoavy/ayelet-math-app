import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { TOPICS } from '../data/topics'
import { useGameSession } from '../hooks/useGameSession'
import { useApp } from '../store/AppContext'
import { useTheme } from '../hooks/useTheme'
import { StarRating } from '../components/ui/StarRating'
import { Confetti } from '../components/ui/Confetti'
import { calculateStars } from '../engine/sessionScorer'

type GamePhase = 'playing' | 'result' | 'complete'

export function GamePage() {
  const { topicId, levelNumber } = useParams<{ topicId: string; levelNumber: string }>()
  const navigate = useNavigate()
  const { state } = useApp()
  const theme = useTheme()
  const { session, startSession, answerQuestion, endSession, currentQuestion } = useGameSession()

  const [phase, setPhase] = useState<GamePhase>('playing')
  const [inputValue, setInputValue] = useState('')
  const [lastResult, setLastResult] = useState<{ correct: boolean; correctAnswer: string; pts: number } | null>(null)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)
  const startTimeRef = useRef<number>(Date.now())
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  const topic = TOPICS.find(t => t.id === topicId)
  const level = topic?.levels.find(l => l.levelNumber === Number(levelNumber))

  // Initialize session
  useEffect(() => {
    if (!level) return
    if (!session || session.levelId !== level.id) {
      startSession(level)
    }
  }, [level?.id])

  // Timer
  useEffect(() => {
    if (!level?.timeLimitSeconds || phase !== 'playing') return
    setSecondsLeft(level.timeLimitSeconds)
    startTimeRef.current = Date.now()
    timerRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s === null || s <= 1) {
          clearInterval(timerRef.current!)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current!)
  }, [session?.currentQuestionIndex, phase])

  // Reset hint on new question
  useEffect(() => {
    setInputValue('')
    setShowHint(false)
    setHintsUsed(0)
    startTimeRef.current = Date.now()
  }, [session?.currentQuestionIndex])

  // Detect session complete
  useEffect(() => {
    if (session?.isComplete && phase === 'result') {
      endSession()
      setShowConfetti(true)
      setPhase('complete')
      setTimeout(() => setShowConfetti(false), 3500)
    }
  }, [session?.isComplete, phase])

  if (!topic || !level) {
    return <div className={`flex-1 flex items-center justify-center ${theme.chipText} opacity-60`}>טוענת...</div>
  }

  // ── Level-complete screen (shown before requiring currentQuestion) ──────────
  if (phase === 'complete') {
    const correctCount = (session?.questions ?? []).filter(q => q.isCorrect).length
    const total = session?.questions.length ?? level.questionsPerSession
    const passed = correctCount >= level.passingScore
    const stars = calculateStars(correctCount, total)
    const pts = session?.pointsThisSession ?? 0

    // Find the next level in this topic
    const currentIdx = topic.levels.findIndex(l => l.id === level.id)
    const nextLevel = topic.levels[currentIdx + 1]

    const emojis = passed
      ? ['🎉','⭐','✨','🌟','💫','🎊','🏆','🥳']
      : ['💪','🌈','😊','🔄','💡','🌸']
    const bigEmoji = emojis[Math.floor(Math.random() * emojis.length)]

    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <Confetti show={showConfetti} />
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Big animated emoji */}
          <motion.div
            animate={{ rotate: [0, -10, 10, -8, 8, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-8xl mb-4"
          >
            {bigEmoji}
          </motion.div>

          <h2 className={`text-3xl font-bold ${theme.textPrimary} mb-1`}>
            {passed ? 'כל הכבוד!' : 'כמעט!'}
          </h2>
          <p className="text-gray-500 mb-4 text-sm">
            {passed
              ? `ענית נכון על ${correctCount} מתוך ${total} שאלות`
              : `ענית נכון על ${correctCount} מתוך ${total} — ${theme.tryAgain}`}
          </p>

          <div className="mb-3"><StarRating stars={stars} size="lg" /></div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`bg-gradient-to-r ${theme.gradientLight} rounded-2xl p-4 mb-5`}
          >
            <p className={`${theme.textPrimary} font-bold text-2xl`}>+{pts} נקודות ✨</p>
          </motion.div>

          {state.pendingBadges.length > 0 && (
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6, type: 'spring' }}
              className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-3 mb-4"
            >
              <p className="text-yellow-700 font-bold">
                {state.pendingBadges[0].emoji} תג חדש:{' '}
                {theme.isMale && state.pendingBadges[0].nameHebrewMale
                  ? state.pendingBadges[0].nameHebrewMale
                  : state.pendingBadges[0].nameHebrew}
              </p>
            </motion.div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-2xl transition-all active:scale-95"
            >
              🏠 בית
            </button>
            {passed && nextLevel ? (
              <button
                onClick={() => navigate(`/game/${topicId}/${nextLevel.levelNumber}`)}
                className={`flex-1 ${theme.primaryBtn} font-bold py-3 rounded-2xl shadow-lg transition-all active:scale-95`}
              >
                השלב הבא ←
              </button>
            ) : passed ? (
              <button
                onClick={() => navigate('/')}
                className={`flex-1 ${theme.primaryBtn} font-bold py-3 rounded-2xl shadow-lg transition-all active:scale-95`}
              >
                לדף הבית 🌟
              </button>
            ) : (
              <button
                onClick={() => { startSession(level); setPhase('playing') }}
                className={`flex-1 ${theme.primaryBtn} font-bold py-3 rounded-2xl shadow-lg transition-all active:scale-95`}
              >
                {theme.tryAgain}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    )
  }

  if (!session || !currentQuestion) {
    return <div className={`flex-1 flex items-center justify-center ${theme.chipText} opacity-60`}>טוענת...</div>
  }

  const questionNumber = session.currentQuestionIndex + 1
  const totalQuestions = session.questions.length
  const progress = ((questionNumber - 1) / totalQuestions) * 100
  const multiplier = session.streakMultiplier

  function handleSubmit(val?: string) {
    const answer = val ?? inputValue
    if (!answer.trim()) return
    clearInterval(timerRef.current!)
    const timeSpentMs = Date.now() - startTimeRef.current
    const prevIndex = session!.currentQuestionIndex

    answerQuestion(answer, timeSpentMs, hintsUsed)

    const correct = String(currentQuestion!.answer).trim() === answer.trim()
      || Math.abs(Number(currentQuestion!.answer) - Number(answer)) < 0.001

    setLastResult({
      correct,
      correctAnswer: String(currentQuestion!.answer),
      pts: correct ? Math.max(0, Math.round(10 * multiplier) - hintsUsed * 3) : 0,
    })
    setPhase('result')

    const isLastQuestion = prevIndex + 1 >= totalQuestions
    setTimeout(() => {
      if (!isLastQuestion) setPhase('playing')
    }, 1200)
  }

  function handleChoice(val: string) {
    handleSubmit(val)
  }

  function handleHint() {
    if (hintsUsed < 2) {
      setHintsUsed(h => h + 1)
      setShowHint(true)
    }
  }

  return (
    <div className="flex-1 flex flex-col max-w-lg mx-auto w-full">
      {/* Top HUD */}
      <div className={`px-4 pt-3 pb-2 bg-white border-b ${theme.borderColor}`}>
        {/* Progress bar */}
        <div className={`h-2 ${theme.bgMuted} rounded-full mb-2 overflow-hidden`}>
          <motion.div
            className={`h-full bg-gradient-to-r ${theme.progressBar} rounded-full`}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">{questionNumber}/{totalQuestions}</span>
            {session.currentStreak >= 3 && (
              <motion.span
                key={session.currentStreak}
                initial={{ scale: 1.5 }} animate={{ scale: 1 }}
                className="text-orange-500 font-bold"
              >
                🔥 ×{multiplier}
              </motion.span>
            )}
          </div>
          <div className={`flex items-center gap-1 ${theme.chipText} font-bold`}>
            <span>⭐</span>
            <motion.span key={session.pointsThisSession} initial={{ scale: 1.3 }} animate={{ scale: 1 }}>
              {session.pointsThisSession}
            </motion.span>
          </div>
          {secondsLeft !== null && (
            <span className={`font-bold ${secondsLeft <= 5 ? 'text-red-500' : 'text-gray-500'}`}>
              ⏱ {secondsLeft}
            </span>
          )}
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={session.currentQuestionIndex}
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            className="flex-1 flex flex-col"
          >
            {/* Question card */}
            <div className={`bg-white rounded-3xl shadow-sm border-2 ${theme.borderColor} p-6 mb-4 text-center flex-1 flex flex-col justify-center`}>
              {currentQuestion.expression ? (
                <>
                  <p className="text-gray-600 text-sm mb-3">{currentQuestion.displayText}</p>
                  <p dir="ltr" className={`text-3xl font-bold ${theme.textPrimary} leading-relaxed`}>{currentQuestion.expression}</p>
                </>
              ) : (
                <p className="text-xl font-bold text-gray-800 leading-relaxed">{currentQuestion.displayText}</p>
              )}

              {showHint && currentQuestion.hintText && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-4 bg-yellow-50 rounded-2xl p-3 text-sm text-yellow-700"
                >
                  💡 {currentQuestion.hintText}
                </motion.div>
              )}
            </div>

            {/* Result flash */}
            <AnimatePresence>
              {phase === 'result' && lastResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className={`rounded-2xl p-3 mb-3 text-center font-bold ${
                    lastResult.correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {lastResult.correct
                    ? `נכון! +${lastResult.pts} נקודות 🎯`
                    : `לא בדיוק... התשובה הנכונה: ${lastResult.correctAnswer}`}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Answer area */}
            {currentQuestion.type === 'multiple_choice' && currentQuestion.choices ? (
              <div className="grid grid-cols-2 gap-3">
                {currentQuestion.choices.map(choice => (
                  <button
                    key={choice.id}
                    onClick={() => handleChoice(String(choice.value))}
                    disabled={phase === 'result'}
                    className={`bg-white border-2 ${theme.borderColor} rounded-2xl py-4 text-xl font-bold ${theme.textPrimary} hover:${theme.borderColorMd} ${theme.bgLight} active:scale-95 transition-all disabled:opacity-50`}
                  >
                    <span dir="ltr">{choice.label}</span>
                  </button>
                ))}
              </div>
            ) : (
              <>
                {currentQuestion.topicId === 'fractions' && (
                  <p className={`text-center text-sm ${theme.chipText} opacity-70 mb-1`}>
                    {theme.fractionHint}
                  </p>
                )}
                <input
                  type={currentQuestion.topicId === 'fractions' ? 'text' : 'number'}
                  inputMode={currentQuestion.topicId === 'fractions' ? 'text' : 'numeric'}
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder={currentQuestion.topicId === 'fractions' ? 'למשל: 3/4' : theme.inputPlaceholder}
                  disabled={phase === 'result'}
                  dir="ltr"
                  className={`w-full border-2 ${theme.borderColorMd} rounded-2xl px-4 py-4 text-center text-2xl font-bold focus:outline-none focus:${theme.borderColorMd} mb-3 disabled:opacity-50`}
                  autoFocus
                />
                <div className="flex gap-3">
                  {!showHint && hintsUsed < 2 && currentQuestion.hintText && (
                    <button
                      onClick={handleHint}
                      className="flex-1 bg-yellow-50 text-yellow-600 font-bold py-3 rounded-2xl border-2 border-yellow-100"
                    >
                      💡 רמז (-3)
                    </button>
                  )}
                  <button
                    onClick={() => handleSubmit()}
                    disabled={!inputValue.trim() || phase === 'result'}
                    className={`flex-1 ${theme.primaryBtn} font-bold py-3 rounded-2xl shadow-md disabled:opacity-40 active:scale-95 transition-all`}
                  >
                    אישור ✓
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

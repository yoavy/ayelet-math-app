import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { TOPICS } from '../data/topics'
import { LEARN_CONTENT } from '../data/learnContent'
import { useLearnSession } from '../hooks/useLearnSession'
import { useTheme } from '../hooks/useTheme'
import type { LearnSlide, LearnValidationQuestion } from '../types'

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressDots({ total, current }: { total: number; current: number }) {
  const theme = useTheme()
  return (
    <div className="flex gap-2 justify-center py-3">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i < current
              ? `w-3 h-3 ${theme.levelCircleComplete}`
              : i === current
              ? `w-4 h-4 bg-gradient-to-r ${theme.gradient}`
              : 'w-3 h-3 bg-gray-200'
          }`}
        />
      ))}
    </div>
  )
}

function VisualBlock({ slide }: { slide: LearnSlide }) {
  if (!slide.visualExample) return null

  const baseClass =
    'rounded-2xl p-5 my-4 text-center font-mono text-sm leading-relaxed whitespace-pre-line'

  if (slide.visualType === 'emoji_grid') {
    return (
      <div className={`${baseClass} bg-amber-50 text-2xl leading-loose border border-amber-100`}>
        {slide.visualExample}
      </div>
    )
  }

  if (slide.visualType === 'expression') {
    return (
      <div
        dir="ltr"
        className={`${baseClass} bg-slate-50 text-slate-700 border border-slate-200 text-base`}
      >
        {slide.visualExample}
      </div>
    )
  }

  // 'text' type
  return (
    <div className={`${baseClass} bg-blue-50 text-blue-800 border border-blue-100 font-sans text-base`}>
      {slide.visualExample}
    </div>
  )
}

function ExplanationPanel({
  slide,
  onUnderstood,
  understoodLabel,
  gTransform,
}: {
  slide: LearnSlide
  onUnderstood: () => void
  understoodLabel: string
  gTransform: (t: string) => string
}) {
  const theme = useTheme()
  return (
    <motion.div
      key="explanation"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.28 }}
      className="flex flex-col flex-1"
    >
      <VisualBlock slide={slide} />
      <p className="text-gray-700 text-base leading-relaxed text-right mt-2 mb-6">
        {gTransform(slide.explanationHebrew)}
      </p>
      <button
        onClick={onUnderstood}
        className={`w-full py-4 rounded-2xl font-bold text-lg shadow-md active:scale-95 transition-transform bg-gradient-to-r ${theme.gradient} text-white`}
      >
        {understoodLabel}
      </button>
    </motion.div>
  )
}

function QuestionPanel({
  question,
  inputValue,
  wrongAttempts,
  showHint,
  onAnswer,
  setInputValue,
  wrongLabel,
  gTransform,
}: {
  question: LearnValidationQuestion
  inputValue: string
  wrongAttempts: number
  showHint: boolean
  onAnswer: (a: string | number) => void
  setInputValue: (v: string) => void
  wrongLabel: string
  gTransform: (t: string) => string
}) {
  const theme = useTheme()
  const [shakeKey, setShakeKey] = useState(0)

  const handleChoiceClick = (value: string | number) => {
    onAnswer(value)
    setShakeKey(k => k + 1)
  }

  const handleSubmit = () => {
    if (inputValue.trim()) onAnswer(inputValue.trim())
  }

  return (
    <motion.div
      key={`q_${question.prompt}`}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.28 }}
      className="flex flex-col flex-1"
    >
      {/* Question prompt */}
      <div className={`rounded-2xl p-5 border-2 ${theme.borderColorMd} bg-white shadow-sm mb-4`}>
        <p className="font-bold text-lg text-right text-gray-800">
          🤔 {gTransform(question.prompt)}
        </p>
        {question.expression && (
          <p
            dir="ltr"
            className={`text-center text-xl font-bold mt-3 ${theme.textPrimary}`}
          >
            {question.expression}
          </p>
        )}
      </div>

      {/* Wrong answer feedback */}
      <AnimatePresence>
        {wrongAttempts > 0 && (
          <motion.div
            key={`wrong_${shakeKey}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 mb-3 text-center text-red-600 text-sm font-medium"
          >
            {wrongLabel}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint after 2 wrong attempts */}
      <AnimatePresence>
        {showHint && question.hintText && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${theme.bgLight} border ${theme.borderColor} rounded-xl px-4 py-3 mb-3 text-right text-sm ${theme.textPrimary}`}
          >
            💡 רמז: {question.hintText}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Answer input */}
      {question.type === 'multiple_choice' && question.choices ? (
        <div className="grid grid-cols-2 gap-3 mt-2">
          {question.choices.map(choice => (
            <button
              key={choice.id}
              onClick={() => handleChoiceClick(choice.value)}
              className={`py-4 rounded-2xl border-2 ${theme.borderColorMd} bg-white text-gray-800 font-bold text-lg
                         active:scale-95 transition-all shadow-sm`}
            >
              {choice.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            dir="ltr"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="תשובה..."
            className={`flex-1 px-4 py-3 rounded-2xl border-2 ${theme.borderColorMd} text-center text-xl font-bold
                       focus:outline-none focus:ring-2 focus:ring-offset-1`}
            autoFocus
          />
          <button
            onClick={handleSubmit}
            disabled={!inputValue.trim()}
            className={`px-6 py-3 rounded-2xl font-bold text-white bg-gradient-to-r ${theme.gradient}
                       disabled:opacity-40 active:scale-95 transition-transform shadow-md`}
          >
            ✓
          </button>
        </div>
      )}
    </motion.div>
  )
}

function SlideCompletePanel({
  isLast,
  onNext,
  nextLabel,
  playLabel,
  title,
}: {
  isLast: boolean
  onNext: () => void
  nextLabel: string
  playLabel: string
  title: string
}) {
  const theme = useTheme()
  return (
    <motion.div
      key="slide_complete"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, type: 'spring', bounce: 0.4 }}
      className="flex flex-col items-center justify-center flex-1 gap-6 py-8"
    >
      <div className="text-7xl">🌟</div>
      <p className={`text-2xl font-bold ${theme.textPrimary}`}>{title}</p>
      <button
        onClick={onNext}
        className={`w-full py-4 rounded-2xl font-bold text-lg shadow-md active:scale-95 transition-transform bg-gradient-to-r ${theme.gradient} text-white`}
      >
        {isLast ? playLabel : nextLabel}
      </button>
    </motion.div>
  )
}

function AllDonePanel({
  onPlay,
  onBackToTopics,
  playLabel,
  title,
  showBackToTopics,
}: {
  onPlay: () => void
  onBackToTopics: () => void
  playLabel: string
  title: string
  showBackToTopics: boolean
}) {
  const theme = useTheme()
  return (
    <motion.div
      key="all_done"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, type: 'spring', bounce: 0.45 }}
      className="flex flex-col items-center justify-center flex-1 gap-5 py-6"
    >
      <div className="text-7xl">🎉</div>
      <p className={`text-2xl font-bold text-center ${theme.textPrimary}`}>{title}</p>
      <p className="text-gray-500 text-center text-sm">עכשיו אפשר לפרוץ לשלבים!</p>
      <button
        onClick={onPlay}
        className={`w-full py-5 rounded-2xl font-bold text-xl shadow-lg active:scale-95 transition-transform bg-gradient-to-r ${theme.gradient} text-white mt-2`}
      >
        {playLabel}
      </button>
      {showBackToTopics && (
        <button
          onClick={onBackToTopics}
          className="w-full py-3 rounded-2xl font-semibold text-base border-2 border-gray-200 text-gray-500 bg-white active:scale-95 transition-transform"
        >
          חזרה לרשימת הנושאים 📚
        </button>
      )}
    </motion.div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function LearnPage() {
  const { topicId } = useParams<{ topicId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()

  // Was this page opened from the home/topic-list page directly?
  const fromHome = (location.state as { fromHome?: boolean } | null)?.fromHome === true

  const topic = TOPICS.find(t => t.id === topicId)
  const content = topicId ? LEARN_CONTENT[topicId as keyof typeof LEARN_CONTENT] : undefined

  const session = useLearnSession(content!)

  if (!topic || !content) {
    navigate(-1)
    return null
  }

  const isLastSlide = session.slideIndex === session.totalSlides - 1

  const handlePlayNow = () => navigate(`/game/${topicId}/1`)
  const handleBackToTopics = () => navigate('/')

  return (
    <div className="min-h-screen flex flex-col bg-gray-50" dir="rtl">
      {/* ── Top Bar ── */}
      <div
        className={`bg-gradient-to-r ${theme.gradient} text-white px-4 pb-4 flex items-center gap-3`}
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
      >
        {/* Exit button — 🚪 door icon clearly signals "leave this lesson" */}
        <button
          onClick={() => navigate(fromHome ? '/' : `/topic/${topicId}`)}
          className="text-white/90 hover:text-white text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 active:bg-white/20 transition-colors flex-shrink-0"
          aria-label="יציאה מהשיעור"
          title="יציאה מהשיעור"
        >
          🚪
        </button>
        <div className="flex-1 text-center">
          <p className="font-bold text-lg leading-tight">{topic.emoji} {topic.nameHebrew}</p>
          <p className="text-white/80 text-xs">{theme.g(content.subtitleHebrew)}</p>
        </div>
        <div className="w-10 h-10 flex items-center justify-center text-white/70 text-sm font-medium">
          {session.slideIndex + 1}/{session.totalSlides}
        </div>
      </div>

      {/* ── Progress Dots ── */}
      <ProgressDots total={session.totalSlides} current={session.slideIndex} />

      {/* ── Phase label ── */}
      <div className="px-4 pb-2">
        <p className={`text-xs font-medium ${theme.chipText} text-right`}>
          {session.phase === 'explanation' && '📖 הסבר'}
          {(session.phase === 'question' || session.phase === 'wrong_answer') && '✏️ שאלת בדיקה'}
          {session.phase === 'slide_complete' && '✅ מצוין!'}
          {session.phase === 'all_done' && '🏆 סיום'}
        </p>
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 px-4 pb-6 flex flex-col max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">
          {session.phase === 'explanation' && (
            <ExplanationPanel
              key={`exp_${session.slideIndex}`}
              slide={session.currentSlide}
              onUnderstood={session.handleUnderstood}
              understoodLabel={theme.learnUnderstoodBtn}
              gTransform={theme.g}
            />
          )}

          {(session.phase === 'question' || session.phase === 'wrong_answer') &&
            session.currentQuestion && (
              <QuestionPanel
                key={`q_${session.slideIndex}_${session.questionIndex}_${session.animKey}`}
                question={session.currentQuestion}
                inputValue={session.inputValue}
                wrongAttempts={session.wrongAttempts}
                showHint={session.showHint}
                onAnswer={session.handleAnswer}
                setInputValue={session.setInputValue}
                wrongLabel={theme.learnWrongAnswer}
                gTransform={theme.g}
              />
            )}

          {session.phase === 'slide_complete' && (
            <SlideCompletePanel
              key={`done_${session.slideIndex}`}
              isLast={isLastSlide}
              onNext={isLastSlide ? handlePlayNow : session.handleNext}
              nextLabel={theme.learnNextSlideBtn}
              playLabel={theme.learnPlayNowBtn}
              title={theme.learnSlideCompleteTitle}
            />
          )}

          {session.phase === 'all_done' && (
            <AllDonePanel
              key="all_done"
              onPlay={handlePlayNow}
              onBackToTopics={handleBackToTopics}
              playLabel={theme.learnPlayNowBtn}
              title={theme.learnAllDoneTitle}
              showBackToTopics={fromHome}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

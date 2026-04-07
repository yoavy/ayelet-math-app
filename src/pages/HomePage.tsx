import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../store/AppContext'
import { TOPICS } from '../data/topics'
import { LEARN_CONTENT } from '../data/learnContent'
import { useTopicProgress } from '../hooks/useTopicProgress'
import { useTheme } from '../hooks/useTheme'
import { StarRating } from '../components/ui/StarRating'
import type { Difficulty } from '../types'

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string; emoji: string }[] = [
  { value: 'easy',   label: 'קל',    emoji: '🟢' },
  { value: 'medium', label: 'בינוני', emoji: '🟡' },
  { value: 'hard',   label: 'קשה',   emoji: '🔴' },
]

export function HomePage() {
  const { state, dispatch } = useApp()
  const { getTopicStars, isTopicUnlocked } = useTopicProgress()
  const theme = useTheme()
  const navigate = useNavigate()
  const profile = state.userProfile!

  const timeOfDay = new Date().getHours()
  const greeting = timeOfDay < 12 ? 'בוקר טוב' : timeOfDay < 17 ? 'צהריים טובים' : 'ערב טוב'

  function setDifficulty(d: Difficulty) {
    dispatch({ type: 'SET_DIFFICULTY', payload: d })
  }

  return (
    <div className="flex-1 pb-24 px-4 pt-4 max-w-lg mx-auto w-full">

      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r ${theme.gradient} rounded-3xl p-5 text-white mb-4 shadow-lg`}
      >
        <p className="text-sm opacity-80">{greeting},</p>
        <h1 className="text-2xl font-bold">{profile.name}! ✨</h1>
        <p className="text-sm opacity-90 mt-1">{profile.currentTitle}</p>
        <div className="flex items-center gap-3 mt-3">
          <div className="bg-white/20 rounded-full px-3 py-1 text-sm font-bold">
            ⭐ {profile.totalPoints.toLocaleString('he-IL')} נקודות
          </div>
          {profile.dailyStreak > 1 && (
            <div className="bg-white/20 rounded-full px-3 py-1 text-sm font-bold">
              📅 {profile.dailyStreak} ימים ברצף
            </div>
          )}
        </div>
      </motion.div>

      {/* Difficulty Selector */}
      <div className="mb-4">
        <p className="text-sm font-bold text-gray-500 mb-2">רמת קושי</p>
        <div className="flex gap-2">
          {DIFFICULTY_OPTIONS.map(opt => {
            const active = (profile.difficulty ?? 'medium') === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => setDifficulty(opt.value)}
                className={`flex-1 py-2 rounded-2xl font-bold text-sm transition-all active:scale-95 border-2 ${
                  active
                    ? `bg-gradient-to-r ${theme.gradient} text-white border-transparent shadow-md`
                    : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
                }`}
              >
                {opt.emoji} {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Topic Grid */}
      <h2 className="font-bold text-gray-700 mb-3 text-lg">{theme.topicsLabel}</h2>
      <div className="grid grid-cols-2 gap-3">
        {TOPICS.map((topic, index) => {
          const unlocked = isTopicUnlocked(topic.id, index)
          const stars = getTopicStars(topic.id)
          const maxStars = topic.levels.length * 3
          const hasLearn = Boolean(LEARN_CONTENT[topic.id as keyof typeof LEARN_CONTENT])

          return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.04 }}
              className={`relative rounded-3xl shadow-sm border-2 overflow-hidden ${
                unlocked ? 'border-transparent' : 'border-gray-100 opacity-50'
              }`}
              style={{ backgroundColor: unlocked ? topic.bgColor : '#f9fafb' }}
            >
              {!unlocked && (
                <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-gray-100/60 z-10">
                  <span className="text-3xl">🔒</span>
                </div>
              )}

              {/* Main tap area → topic page */}
              <button
                onClick={() => unlocked && navigate(`/topic/${topic.id}`)}
                disabled={!unlocked}
                className="w-full p-4 text-right active:scale-95 transition-transform cursor-pointer disabled:cursor-not-allowed"
              >
                <div className="text-3xl mb-2">{topic.emoji}</div>
                <p className="font-bold text-gray-800 text-sm">{topic.nameHebrew}</p>
                <div className="mt-1">
                  <StarRating stars={Math.round((stars / maxStars) * 5)} max={5} size="sm" />
                </div>
                {stars > 0 && (
                  <p className="text-xs text-gray-500 mt-1">{stars}/{maxStars}</p>
                )}
              </button>

              {/* 📚 Learn shortcut button — available for ALL topics, even locked */}
              {hasLearn && (
                <button
                  onClick={e => {
                    e.stopPropagation()
                    navigate(`/learn/${topic.id}`, { state: { fromHome: true } })
                  }}
                  className="absolute top-2 left-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/70 hover:bg-white/95 active:scale-90 transition-all text-base shadow-sm z-20"
                  title="שיעור"
                  aria-label="פתח שיעור"
                >
                  📚
                </button>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

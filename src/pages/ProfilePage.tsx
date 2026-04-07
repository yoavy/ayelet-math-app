import { useApp } from '../store/AppContext'
import { BADGES } from '../data/badges'
import { TITLES } from '../data/titles'
import { TOPICS } from '../data/topics'
import { useTopicProgress } from '../hooks/useTopicProgress'
import { useTheme } from '../hooks/useTheme'
import { motion } from 'framer-motion'

export function ProfilePage() {
  const { state } = useApp()
  const { getTopicStars } = useTopicProgress()
  const theme = useTheme()
  const profile = state.userProfile!

  const nextTitle = TITLES.find(t => t.requiredPoints > profile.totalPoints)
  const pointsToNext = nextTitle ? nextTitle.requiredPoints - profile.totalPoints : 0
  const currentTitleObj = TITLES.filter(t => t.requiredPoints <= profile.totalPoints).at(-1)!

  const totalQuestions = state.weeklyData.reduce((s, d) => s + d.questionsAnswered, 0)
  const totalCorrect = state.weeklyData.reduce((s, d) => s + d.correctAnswers, 0)
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0

  const avatarEmojis: Record<string, string> = {
    star: '🌟', unicorn: '🦄', butterfly: '🦋', cat: '🐱',
    fox: '🦊', rainbow: '🌈', rocket: '🚀', crown: '👑',
  }

  const nextTitleName = nextTitle
    ? (theme.isMale && nextTitle.nameHebrewMale ? nextTitle.nameHebrewMale : nextTitle.nameHebrew)
    : null

  function handleShareBadges() {
    const earned = BADGES.filter(b => profile.badgeIds.includes(b.id))
    if (earned.length === 0) return
    const list = earned
      .map(b => `${b.emoji} ${theme.isMale && b.nameHebrewMale ? b.nameHebrewMale : b.nameHebrew}`)
      .join('\n')
    const text = `התגים שלי במתמטיקיות על 🏆\n\n${list}\n\nסה"כ ${earned.length} תגים!`
    if (navigator.share) {
      navigator.share({ text }).catch(() => {/* user cancelled */})
    } else {
      navigator.clipboard?.writeText(text)
        .then(() => alert('הטקסט הועתק ללוח!'))
        .catch(() => {/* clipboard unavailable */})
    }
  }

  const earnedCount = profile.badgeIds.length

  return (
    <div className="flex-1 pb-24 px-4 pt-4 max-w-lg mx-auto w-full">
      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-br ${theme.gradient} rounded-3xl p-6 text-white text-center mb-4 shadow-lg`}
      >
        <div className="text-6xl mb-2">{avatarEmojis[profile.avatarId] ?? '🌟'}</div>
        <h1 className="text-2xl font-bold">{profile.name}</h1>
        <p className="opacity-80 text-sm">{currentTitleObj?.iconEmoji} {profile.currentTitle}</p>
        <div className="mt-4 bg-white/20 rounded-2xl p-3">
          <p className="text-3xl font-bold">{profile.totalPoints.toLocaleString('he-IL')}</p>
          <p className="text-sm opacity-80">נקודות</p>
        </div>
        {nextTitle && (
          <div className="mt-3">
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{
                  width: `${Math.round(((profile.totalPoints - (currentTitleObj?.requiredPoints ?? 0)) /
                    (nextTitle.requiredPoints - (currentTitleObj?.requiredPoints ?? 0))) * 100)}%`
                }}
              />
            </div>
            <p className="text-xs opacity-70 mt-1">עוד {pointsToNext} נקודות ל-{nextTitleName}</p>
          </div>
        )}
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'רצף מקסימלי', value: profile.maxStreak, emoji: '🔥' },
          { label: 'ימים ברצף', value: profile.dailyStreak, emoji: '📅' },
          { label: 'דיוק', value: `${accuracy}%`, emoji: '🎯' },
        ].map(stat => (
          <div key={stat.label} className={`bg-white rounded-2xl p-3 text-center shadow-sm border ${theme.borderColor}`}>
            <div className="text-xl">{stat.emoji}</div>
            <div className="font-bold text-gray-800">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Topic progress */}
      <div className={`bg-white rounded-3xl p-4 mb-4 shadow-sm border ${theme.borderColor}`}>
        <h3 className="font-bold text-gray-700 mb-3">התקדמות בנושאים</h3>
        {TOPICS.map(topic => {
          const stars = getTopicStars(topic.id)
          const maxStars = topic.levels.length * 3
          const pct = Math.round((stars / maxStars) * 100)
          return (
            <div key={topic.id} className="mb-3 last:mb-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{topic.emoji} {topic.nameHebrew}</span>
                <span className="text-xs text-gray-400">{stars}/{maxStars}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: topic.color }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Badges */}
      <div className={`bg-white rounded-3xl p-4 shadow-sm border ${theme.borderColor}`}>
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-700">התגים שלי</h3>
            {earnedCount > 0 && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${theme.chipBg} ${theme.chipText}`}>
                {earnedCount}
              </span>
            )}
          </div>
          {earnedCount > 0 && (
            <button
              onClick={handleShareBadges}
              className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full
                          bg-gradient-to-r ${theme.gradient} text-white shadow-sm active:scale-95 transition-transform`}
            >
              {theme.shareLabel} 🏅
            </button>
          )}
        </div>

        <div className="grid grid-cols-4 gap-3">
          {BADGES.map(badge => {
            const earned = profile.badgeIds.includes(badge.id)
            const displayName = theme.isMale && badge.nameHebrewMale
              ? badge.nameHebrewMale
              : badge.nameHebrew
            return (
              <div
                key={badge.id}
                className={`flex flex-col items-center text-center p-2 rounded-2xl transition-all ${
                  earned ? 'bg-yellow-50 border-2 border-yellow-200' : 'bg-gray-50 opacity-40'
                }`}
                title={badge.descriptionHebrew}
              >
                <span className="text-2xl">{badge.emoji}</span>
                <span className="text-[10px] text-gray-600 mt-1 leading-tight">{displayName}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

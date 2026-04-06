import { useState } from 'react'
import { useApp } from '../store/AppContext'
import { TOPICS } from '../data/topics'
import { BADGES } from '../data/badges'
import { useTopicProgress } from '../hooks/useTopicProgress'
import { StarRating } from '../components/ui/StarRating'
import { motion } from 'framer-motion'

function shareReport(text: string) {
  if (navigator.share) {
    navigator.share({ title: 'דוח התקדמות', text }).catch(() => {})
  } else {
    navigator.clipboard.writeText(text).then(() => alert('הועתק ללוח'))
  }
}

export function ParentsPage() {
  const { state, dispatch } = useApp()
  const { getTopicStars } = useTopicProgress()
  const profile = state.userProfile!

  const [pinInput, setPinInput] = useState('')
  const [unlocked, setUnlocked] = useState(!profile.parentPin)
  const [pinError, setPinError] = useState(false)
  const [settingPin, setSettingPin] = useState(false)
  const [newPin, setNewPin] = useState('')

  function handleUnlock() {
    if (pinInput === profile.parentPin) {
      setUnlocked(true)
      setPinError(false)
    } else {
      setPinError(true)
    }
  }

  function handleSetPin() {
    if (newPin.length === 4) {
      dispatch({ type: 'SET_PARENT_PIN', payload: newPin })
      setSettingPin(false)
      setNewPin('')
    }
  }

  const weeklyData = state.weeklyData.slice(-7)
  const totalPointsWeek = weeklyData.reduce((s, d) => s + d.pointsEarned, 0)
  const totalSessionsWeek = weeklyData.reduce((s, d) => s + d.sessionsPlayed, 0)
  const totalQuestionsWeek = weeklyData.reduce((s, d) => s + d.questionsAnswered, 0)
  const totalCorrectWeek = weeklyData.reduce((s, d) => s + d.correctAnswers, 0)
  const accuracyWeek = totalQuestionsWeek > 0 ? Math.round((totalCorrectWeek / totalQuestionsWeek) * 100) : 0
  const earnedBadges = BADGES.filter(b => profile.badgeIds.includes(b.id))

  function buildShareText() {
    const lines = [
      `דוח התקדמות של ${profile.name} - מתמטיקיות על`,
      ``,
      `נקודות כולל: ${profile.totalPoints}`,
      `תואר נוכחי: ${profile.currentTitle}`,
      `השבוע: ${totalPointsWeek} נקודות, ${totalSessionsWeek} משחקים, דיוק ${accuracyWeek}%`,
      ``,
      `התקדמות לפי נושאים:`,
      ...TOPICS.map(t => `  ${t.nameHebrew}: ${getTopicStars(t.id)}/${t.levels.length * 3} כוכבים`),
      ``,
      earnedBadges.length > 0 ? `תגים: ${earnedBadges.map(b => b.nameHebrew).join(', ')}` : '',
    ]
    return lines.filter(Boolean).join('\n')
  }

  if (!unlocked) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-sm text-center">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">אזור הורים</h2>
          <p className="text-gray-500 text-sm mb-5">הזן קוד סודי כדי לראות את ההתקדמות</p>
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pinInput}
            onChange={e => { setPinInput(e.target.value); setPinError(false) }}
            onKeyDown={e => e.key === 'Enter' && handleUnlock()}
            placeholder="הזן 4 ספרות"
            className={`w-full border-2 rounded-2xl px-4 py-3 text-center text-2xl tracking-widest mb-3 focus:outline-none ${
              pinError ? 'border-red-300' : 'border-purple-200 focus:border-purple-400'
            }`}
          />
          {pinError && <p className="text-red-500 text-sm mb-3">קוד שגוי, נסה שוב</p>}
          <button
            onClick={handleUnlock}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-2xl shadow-md"
          >
            כניסה
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 pb-24 px-4 pt-4 max-w-lg mx-auto w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-700">דוח הורים 💌</h1>
        <button
          onClick={() => shareReport(buildShareText())}
          className="bg-green-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow"
        >
          שתף ↗
        </button>
      </div>

      {/* Student summary */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-3xl p-5 mb-4 shadow-lg"
      >
        <p className="text-sm opacity-80">דוח התקדמות עבור</p>
        <h2 className="text-2xl font-bold">{profile.name}</h2>
        <p className="text-sm opacity-80 mt-1">{profile.currentTitle}</p>
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-white/20 rounded-xl p-2 text-center">
            <p className="font-bold text-lg">{profile.totalPoints.toLocaleString('he-IL')}</p>
            <p className="text-xs opacity-80">נקודות</p>
          </div>
          <div className="bg-white/20 rounded-xl p-2 text-center">
            <p className="font-bold text-lg">{profile.dailyStreak}</p>
            <p className="text-xs opacity-80">ימים ברצף</p>
          </div>
          <div className="bg-white/20 rounded-xl p-2 text-center">
            <p className="font-bold text-lg">{profile.badgeIds.length}</p>
            <p className="text-xs opacity-80">תגים</p>
          </div>
        </div>
      </motion.div>

      {/* This week */}
      <div className="bg-white rounded-3xl p-4 mb-4 shadow-sm border border-purple-50">
        <h3 className="font-bold text-gray-700 mb-3">השבוע</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'נקודות', value: totalPointsWeek, emoji: '⭐' },
            { label: 'משחקים', value: totalSessionsWeek, emoji: '🎮' },
            { label: 'שאלות', value: totalQuestionsWeek, emoji: '❓' },
            { label: 'דיוק', value: `${accuracyWeek}%`, emoji: '🎯' },
          ].map(s => (
            <div key={s.label} className="bg-purple-50 rounded-2xl p-3 text-center">
              <p className="text-xl">{s.emoji}</p>
              <p className="font-bold text-purple-700">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Topic progress */}
      <div className="bg-white rounded-3xl p-4 mb-4 shadow-sm border border-purple-50">
        <h3 className="font-bold text-gray-700 mb-3">התקדמות לפי נושא</h3>
        {TOPICS.map(topic => {
          const stars = getTopicStars(topic.id)
          const maxStars = topic.levels.length * 3
          const pct = Math.round((stars / maxStars) * 100)
          return (
            <div key={topic.id} className="mb-3 last:mb-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">{topic.emoji} {topic.nameHebrew}</span>
                <StarRating stars={Math.min(3, Math.round(stars / topic.levels.length))} size="sm" />
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: topic.color }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Badges */}
      {earnedBadges.length > 0 && (
        <div className="bg-white rounded-3xl p-4 mb-4 shadow-sm border border-purple-50">
          <h3 className="font-bold text-gray-700 mb-3">תגים שהושגו</h3>
          <div className="flex flex-wrap gap-2">
            {earnedBadges.map(b => (
              <div key={b.id} className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1">
                <span>{b.emoji}</span>
                <span className="text-sm text-yellow-700">{b.nameHebrew}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PIN settings */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-purple-50">
        <h3 className="font-bold text-gray-700 mb-2">הגדרות קוד הורים</h3>
        {!settingPin ? (
          <button
            onClick={() => setSettingPin(true)}
            className="text-purple-600 text-sm font-medium underline"
          >
            {profile.parentPin ? 'שנה קוד סודי' : 'הגדר קוד סודי'}
          </button>
        ) : (
          <div className="flex gap-2">
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={newPin}
              onChange={e => setNewPin(e.target.value)}
              placeholder="4 ספרות"
              className="flex-1 border-2 border-purple-200 rounded-xl px-3 py-2 text-center tracking-widest focus:outline-none"
            />
            <button
              onClick={handleSetPin}
              disabled={newPin.length !== 4}
              className="bg-purple-500 text-white px-4 py-2 rounded-xl font-bold disabled:opacity-40"
            >
              שמור
            </button>
            <button onClick={() => { setSettingPin(false); setNewPin('') }} className="text-gray-400 px-2">
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

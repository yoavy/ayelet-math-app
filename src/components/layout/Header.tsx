import { useApp } from '../../store/AppContext'
import { useTheme } from '../../hooks/useTheme'
import { TOPICS } from '../../data/topics'

const AVATAR_EMOJI: Record<string, string> = {
  star: '🌟', unicorn: '🦄', butterfly: '🦋', cat: '🐱',
  fox: '🦊', rainbow: '🌈', rocket: '🚀', crown: '👑',
}

function buildShareMessage(state: ReturnType<typeof useApp>['state']): string {
  const profile = state.userProfile!
  const scores = state.scores
  const weeklyData = state.weeklyData

  const today = new Date().toISOString().split('T')[0]
  const todayData = weeklyData.find(d => d.date === today)

  const last7 = weeklyData.slice(-7)
  const weekPoints = last7.reduce((s, d) => s + d.pointsEarned, 0)
  const weekSessions = last7.reduce((s, d) => s + d.sessionsPlayed, 0)
  const weekQuestions = last7.reduce((s, d) => s + d.questionsAnswered, 0)
  const weekCorrect = last7.reduce((s, d) => s + d.correctAnswers, 0)
  const weekAccuracy = weekQuestions > 0 ? Math.round((weekCorrect / weekQuestions) * 100) : 0

  const completedTopics = TOPICS.filter(t =>
    t.levels.every(l => (scores[l.id]?.stars ?? 0) > 0)
  ).map(t => t.nameHebrew)

  const totalStars = Object.values(scores).reduce((s, sc) => s + sc.stars, 0)

  const isMale = profile.gender === 'male'
  const lines = [
    `📊 *דוח התקדמות של ${profile.name}*`,
    ``,
    `🏆 *סיכום כולל*`,
    `• תואר: ${profile.currentTitle}`,
    `• סה"כ נקודות: ${profile.totalPoints.toLocaleString('he-IL')}`,
    `• כוכבים שנצברו: ${totalStars} ⭐`,
    `• רצף מקסימלי: ${profile.maxStreak} 🔥`,
    `• ימים ברצף: ${profile.dailyStreak} 📅`,
    completedTopics.length > 0
      ? `• נושאים שהושלמו: ${completedTopics.join(', ')}`
      : `• נושאים בתהליך: ${Object.keys(scores).length > 0 ? 'בהתחלה' : 'עוד לא התחילה'}`,
    ``,
    `📅 *השבוע האחרון*`,
    `• נקודות: ${weekPoints}`,
    `• משחקים: ${weekSessions}`,
    `• שאלות: ${weekQuestions}`,
    `• דיוק: ${weekAccuracy}%`,
    ``,
    `☀️ *היום*`,
    todayData
      ? [
          `• נקודות: ${todayData.pointsEarned}`,
          `• משחקים: ${todayData.sessionsPlayed}`,
          `• שאלות: ${todayData.questionsAnswered}`,
          `• נכון: ${todayData.correctAnswers}/${todayData.questionsAnswered}`,
        ].join('\n')
      : `• עדיין לא שיחקה היום`,
    ``,
    isMale ? `💙 מתמטיקאים על` : `💜 מתמטיקיות על`,
  ]

  return lines.join('\n')
}

function shareToWhatsApp(text: string) {
  const encoded = encodeURIComponent(text)
  const waUrl = `https://wa.me/?text=${encoded}`

  // Try Web Share API first (native sheet on mobile), fall back to WhatsApp URL
  if (navigator.share) {
    navigator.share({ text }).catch(() => window.open(waUrl, '_blank'))
  } else {
    window.open(waUrl, '_blank')
  }
}

export function Header() {
  const { state } = useApp()
  const theme = useTheme()
  const profile = state.userProfile

  if (!profile) return null

  function handleShare() {
    const msg = buildShareMessage(state)
    shareToWhatsApp(msg)
  }

  return (
    <header className={`bg-white/80 backdrop-blur-sm sticky top-0 z-30 border-b ${theme.borderColor} px-4 py-2`}>
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{AVATAR_EMOJI[profile.avatarId] ?? '🌟'}</span>
          <div>
            <p className={`text-xs ${theme.chipText} opacity-70`}>{theme.helloLabel}</p>
            <p className={`font-bold ${theme.textPrimary} leading-none`}>{profile.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {profile.currentStreak > 0 && (
            <div className="flex items-center gap-1 bg-orange-50 rounded-full px-2 py-1">
              <span className="text-sm">🔥</span>
              <span className="text-xs font-bold text-orange-500">{profile.currentStreak}</span>
            </div>
          )}
          <div className={`flex items-center gap-1 ${theme.chipBg} rounded-full px-3 py-1`}>
            <span className="text-sm">⭐</span>
            <span className={`text-sm font-bold ${theme.chipText}`}>{profile.totalPoints.toLocaleString('he-IL')}</span>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-1 bg-green-500 hover:bg-green-600 active:scale-95 text-white rounded-full px-3 py-1 transition-all shadow-sm"
            aria-label="שתף התקדמות בוואטסאפ"
          >
            <span className="text-sm">📤</span>
            <span className="text-xs font-bold">{theme.shareLabel}</span>
          </button>
        </div>
      </div>
    </header>
  )
}

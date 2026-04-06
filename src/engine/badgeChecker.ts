import type { UserProfile, Score, Badge } from '../types'
import { TOPICS } from '../data/topics'

export function checkBadgeConditions(
  profile: UserProfile,
  scores: Record<string, Score>,
  allBadges: Badge[]
): Badge[] {
  const earned: Badge[] = []
  const alreadyHas = new Set(profile.badgeIds)

  for (const badge of allBadges) {
    if (alreadyHas.has(badge.id)) continue

    const { type, threshold, topicId } = badge.condition
    let qualifies = false

    switch (type) {
      case 'first_play':
        qualifies = Object.keys(scores).length >= 1
        break
      case 'streak':
        qualifies = profile.maxStreak >= threshold || profile.currentStreak >= threshold
        break
      case 'topic_complete': {
        if (topicId) {
          const topic = TOPICS.find(t => t.id === topicId)
          if (topic) {
            qualifies = topic.levels.every(l => {
              const s = scores[l.id]
              return s && s.stars > 0
            })
          }
        } else {
          // all topics
          const totalCompleted = TOPICS.reduce((sum, topic) => {
            const done = topic.levels.filter(l => {
              const s = scores[l.id]
              return s && s.stars > 0
            }).length
            return sum + done
          }, 0)
          qualifies = totalCompleted >= threshold
        }
        break
      }
      case 'all_stars': {
        if (topicId) {
          const topic = TOPICS.find(t => t.id === topicId)
          if (topic) {
            qualifies = topic.levels.every(l => scores[l.id]?.stars === 3)
          }
        }
        break
      }
      case 'total_points':
        qualifies = profile.totalPoints >= threshold
        break
      case 'daily_streak':
        qualifies = profile.dailyStreak >= threshold
        break
    }

    if (qualifies) earned.push(badge)
  }

  return earned
}

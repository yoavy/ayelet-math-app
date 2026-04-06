import { useApp } from '../store/AppContext'
import { TOPICS } from '../data/topics'
import type { LevelStatus, TopicId } from '../types'

export function useTopicProgress() {
  const { state } = useApp()
  const { scores } = state

  function getLevelStatus(levelId: string, topicId: TopicId, levelNumber: number): LevelStatus {
    const score = scores[levelId]
    if (score && score.stars > 0) return 'completed'

    // Level 1 of every topic is always available
    if (levelNumber === 1) return 'available'

    // Previous level must be completed
    const prevLevelId = `${topicId}_${levelNumber - 1}`
    const prevScore = scores[prevLevelId]
    if (prevScore && prevScore.stars > 0) return 'available'

    return 'locked'
  }

  function getTopicStars(topicId: TopicId): number {
    const topic = TOPICS.find(t => t.id === topicId)
    if (!topic) return 0
    return topic.levels.reduce((sum, l) => sum + (scores[l.id]?.stars ?? 0), 0)
  }

  function isTopicUnlocked(topicId: TopicId, index: number): boolean {
    if (index === 0) return true
    if (topicId === 'wordProblems') return true   // always unlocked
    const prevTopic = TOPICS[index - 1]
    return prevTopic.levels.some(l => scores[l.id]?.stars > 0)
  }

  return { getLevelStatus, getTopicStars, isTopicUnlocked, scores }
}

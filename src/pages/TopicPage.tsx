import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TOPICS } from '../data/topics'
import { LEARN_CONTENT } from '../data/learnContent'
import { useTopicProgress } from '../hooks/useTopicProgress'
import { useTheme } from '../hooks/useTheme'
import { StarRating } from '../components/ui/StarRating'

export function TopicPage() {
  const { topicId } = useParams<{ topicId: string }>()
  const navigate = useNavigate()
  const { getLevelStatus, scores } = useTopicProgress()
  const theme = useTheme()

  const topic = TOPICS.find(t => t.id === topicId)
  if (!topic) return <div className="p-4 text-center">נושא לא נמצא</div>

  const learnContent = topicId ? LEARN_CONTENT[topicId as keyof typeof LEARN_CONTENT] : undefined

  return (
    <div className="flex-1 pb-24 px-4 pt-4 max-w-lg mx-auto w-full">
      {/* Topic Header */}
      <div
        className="rounded-3xl p-5 text-center mb-4 shadow-sm"
        style={{ backgroundColor: topic.bgColor }}
      >
        <div className="text-5xl mb-2">{topic.emoji}</div>
        <h1 className="text-2xl font-bold text-gray-800">{topic.nameHebrew}</h1>
        <p className="text-sm text-gray-500 mt-1">5 תחנות להשלמה</p>
      </div>

      {/* Learn Button (shown only when content exists) */}
      {learnContent && (
        <motion.button
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => navigate(`/learn/${topic.id}`)}
          className={`w-full flex items-center justify-between gap-3 p-4 rounded-2xl border-2
                      ${theme.borderColorMd} bg-white shadow-sm hover:shadow-md active:scale-95
                      transition-all mb-5`}
        >
          <div className="text-right flex-1">
            <p className={`font-bold ${theme.textPrimary} text-sm`}>
              📚 {theme.learnButtonLabel}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{theme.learnButtonSubtitle}</p>
          </div>
          <span className={`${theme.chipText} text-2xl font-bold`}>←</span>
        </motion.button>
      )}

      {/* Level Nodes */}
      <div className="relative">
        {/* Connecting path */}
        <div className={`absolute right-8 top-8 bottom-8 w-0.5 ${theme.pathColor} -z-10`} />

        <div className="flex flex-col gap-4">
          {topic.levels.map((level, i) => {
            const status = getLevelStatus(level.id, topic.id, level.levelNumber)
            const score = scores[level.id]
            const isLocked = status === 'locked'
            const isCompleted = status === 'completed'

            return (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 + 0.15 }}
              >
                <button
                  onClick={() => !isLocked && navigate(`/game/${topic.id}/${level.levelNumber}`)}
                  disabled={isLocked}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-right transition-all ${
                    isLocked
                      ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                      : isCompleted
                      ? `${theme.borderColor} bg-white shadow-sm hover:shadow-md active:scale-98`
                      : `${theme.borderColorMd} bg-white shadow-md hover:shadow-lg active:scale-98`
                  }`}
                >
                  {/* Level number circle */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0 ${
                      isLocked
                        ? 'bg-gray-200 text-gray-400'
                        : isCompleted
                        ? theme.levelCircleComplete
                        : theme.levelCircleActive
                    }`}
                  >
                    {isLocked ? '🔒' : isCompleted ? '✓' : level.levelNumber}
                  </div>

                  <div className="flex-1">
                    <p className="font-bold text-gray-800 text-sm">{level.nameHebrew}</p>
                    <p className="text-xs text-gray-500">{theme.g(level.titleHebrew)}</p>
                    {score && (
                      <div className="mt-1">
                        <StarRating stars={score.stars} size="sm" />
                      </div>
                    )}
                  </div>

                  {!isLocked && (
                    <div className={`${theme.chipText} text-xl`}>←</div>
                  )}
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import { AVATARS } from '../data/avatars'
import { resolveTitle } from '../data/titles'
import type { Gender } from '../types'

type Step = 'name' | 'gender' | 'avatar' | 'done'

export function OnboardingPage() {
  const { dispatch } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('name')
  const [name, setName] = useState('')
  const [gender, setGender] = useState<Gender>('female')
  const [avatarId, setAvatarId] = useState('star')

  const isMale = gender === 'male'
  const gradient = isMale ? 'from-blue-400 via-sky-400 to-cyan-300' : 'from-purple-400 via-pink-400 to-orange-300'
  const btnClass = isMale
    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 rounded-2xl transition-all active:scale-95 shadow-lg text-lg'
    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-2xl transition-all active:scale-95 shadow-lg text-lg'
  const headingColor = isMale ? 'text-blue-700' : 'text-purple-700'

  function handleNameSubmit() {
    if (name.trim().length < 1) return
    setStep('gender')
  }

  function handleGenderSubmit() {
    setStep('avatar')
  }

  function handleAvatarSubmit() {
    const profile = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      avatarId,
      gender,
      difficulty: 'medium' as const,
      createdAt: Date.now(),
      onboardingComplete: true,
      totalPoints: 0,
      currentTitle: resolveTitle(0, gender).nameHebrew,
      currentStreak: 0,
      maxStreak: 0,
      dailyStreak: 1,
      lastPlayedAt: Date.now(),
      badgeIds: [],
      parentPin: null,
    }
    dispatch({ type: 'SET_USER_PROFILE', payload: profile })
    setStep('done')
    setTimeout(() => navigate('/'), 2200)
  }

  const selectedAvatar = AVATARS.find(a => a.id === avatarId)

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradient} flex items-center justify-center p-4`}>
      <AnimatePresence mode="wait">

        {/* ── Step 1: Name ── */}
        {step === 'name' && (
          <motion.div
            key="name"
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }}
            className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center"
          >
            <div className="text-5xl mb-4">✨</div>
            <h1 className={`text-2xl font-bold ${headingColor} mb-2`}>ברוכים הבאים!</h1>
            <p className="text-gray-500 mb-6 text-sm">בואו נכיר — איך קוראים לכם?</p>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleNameSubmit()}
              placeholder="הקלד/י את שמך..."
              maxLength={20}
              autoFocus
              className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-center text-lg font-medium focus:outline-none focus:border-blue-400 mb-4"
            />
            <button
              onClick={handleNameSubmit}
              disabled={name.trim().length < 1}
              className={`w-full ${btnClass} disabled:opacity-40`}
            >
              המשך 🚀
            </button>
          </motion.div>
        )}

        {/* ── Step 2: Gender ── */}
        {step === 'gender' && (
          <motion.div
            key="gender"
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }}
            className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center"
          >
            <div className="text-4xl mb-3">👤</div>
            <h1 className={`text-2xl font-bold ${headingColor} mb-1`}>שלום {name}!</h1>
            <p className="text-gray-500 mb-6 text-sm">את בת או בן?</p>

            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setGender('female')}
                className={`flex-1 border-2 rounded-2xl py-5 transition-all ${
                  gender === 'female'
                    ? 'border-pink-400 bg-pink-50 scale-105 shadow-md'
                    : 'border-gray-100 hover:border-pink-200'
                }`}
              >
                <div className="text-4xl mb-2">👧</div>
                <p className="font-bold text-gray-700">בת</p>
              </button>
              <button
                onClick={() => setGender('male')}
                className={`flex-1 border-2 rounded-2xl py-5 transition-all ${
                  gender === 'male'
                    ? 'border-blue-400 bg-blue-50 scale-105 shadow-md'
                    : 'border-gray-100 hover:border-blue-200'
                }`}
              >
                <div className="text-4xl mb-2">👦</div>
                <p className="font-bold text-gray-700">בן</p>
              </button>
            </div>

            <button onClick={handleGenderSubmit} className={`w-full ${btnClass}`}>
              המשך ➡️
            </button>
          </motion.div>
        )}

        {/* ── Step 3: Avatar ── */}
        {step === 'avatar' && (
          <motion.div
            key="avatar"
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }}
            className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center"
          >
            <div className="text-4xl mb-2">{selectedAvatar?.emoji}</div>
            <h1 className={`text-2xl font-bold ${headingColor} mb-1`}>
              {isMale ? `יאללה ${name}!` : `שלום ${name}!`}
            </h1>
            <p className="text-gray-500 mb-5 text-sm">
              {isMale ? 'בחר אוואטר לפרופיל שלך' : 'בחרי אוואטר לפרופיל שלך'}
            </p>
            <div className="grid grid-cols-4 gap-3 mb-6">
              {AVATARS.map(av => (
                <button
                  key={av.id}
                  onClick={() => setAvatarId(av.id)}
                  className={`text-3xl p-3 rounded-2xl border-2 transition-all ${
                    av.id === avatarId
                      ? `${isMale ? 'border-blue-400 bg-blue-50' : 'border-purple-400 bg-purple-50'} scale-110 shadow-md`
                      : 'border-gray-100 hover:border-gray-300'
                  }`}
                  aria-label={av.label}
                >
                  {av.emoji}
                </button>
              ))}
            </div>
            <button onClick={handleAvatarSubmit} className={`w-full ${btnClass}`}>
              {isMale ? 'בוא נתחיל! 🌟' : 'בואי נתחיל! 🌟'}
            </button>
          </motion.div>
        )}

        {/* ── Step 4: Done ── */}
        {step === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="text-center text-white"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8 }}
              className="text-8xl mb-6"
            >
              {selectedAvatar?.emoji}
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">היי {name}! 🎉</h1>
            <p className="text-lg opacity-90">
              {isMale
                ? 'אתה עומד להפוך לגיבור המתמטיקה!'
                : 'את עומדת להפוך לגיבורת המתמטיקה!'}
            </p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}

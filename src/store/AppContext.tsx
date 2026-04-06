import { createContext, useContext, useReducer, useEffect, useRef, type ReactNode } from 'react'
import type { AppState } from '../types'
import type { AppAction } from './actions'
import { reducer, initialState } from './reducer'

const STORAGE_KEYS = {
  profile: 'ayelet_math_v1_profile',
  scores: 'ayelet_math_v1_scores',
  session: 'ayelet_math_v1_session',
  daily: 'ayelet_math_v1_daily_activity',
}

function loadState(): Partial<AppState> {
  try {
    const profile = JSON.parse(localStorage.getItem(STORAGE_KEYS.profile) ?? 'null')
    // Migrate old profiles that predate gender/difficulty fields
    const migratedProfile = profile
      ? { gender: 'female', difficulty: 'medium', ...profile }
      : null
    return {
      userProfile: migratedProfile,
      scores: JSON.parse(localStorage.getItem(STORAGE_KEYS.scores) ?? '{}'),
      activeSession: JSON.parse(localStorage.getItem(STORAGE_KEYS.session) ?? 'null'),
      weeklyData: JSON.parse(localStorage.getItem(STORAGE_KEYS.daily) ?? '[]'),
    }
  } catch {
    return {}
  }
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(state.userProfile))
    localStorage.setItem(STORAGE_KEYS.scores, JSON.stringify(state.scores))
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(state.activeSession))
    localStorage.setItem(STORAGE_KEYS.daily, JSON.stringify(state.weeklyData))
  } catch {
    // quota exceeded — fail silently
  }
}

interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<AppAction>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const saved = loadState()
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    ...saved,
    pendingBadges: [],
  })

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => saveState(state), 300)
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current) }
  }, [state])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}

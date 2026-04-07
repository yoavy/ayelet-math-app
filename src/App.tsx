import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AppProvider, useApp } from './store/AppContext'
import { Header } from './components/layout/Header'
import { BottomNav } from './components/layout/BottomNav'
import { OnboardingPage } from './pages/OnboardingPage'
import { HomePage } from './pages/HomePage'
import { TopicPage } from './pages/TopicPage'
import { GamePage } from './pages/GamePage'
import { LearnPage } from './pages/LearnPage'
import { ProfilePage } from './pages/ProfilePage'
import { ParentsPage } from './pages/ParentsPage'

function AppRoutes() {
  const { state } = useApp()
  const location = useLocation()
  const profile = state.userProfile
  const hideChrome =
    location.pathname.startsWith('/game/') ||
    location.pathname.startsWith('/learn/')

  if (!profile?.onboardingComplete) {
    return <OnboardingPage />
  }

  return (
    <div className="flex flex-col min-h-screen">
      {!hideChrome && <Header />}
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/topics" element={<Navigate to="/" replace />} />
          <Route path="/topic/:topicId" element={<TopicPage />} />
          <Route path="/game/:topicId/:levelNumber" element={<GamePage />} />
          <Route path="/learn/:topicId" element={<LearnPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/parents" element={<ParentsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!hideChrome && <BottomNav />}
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  )
}

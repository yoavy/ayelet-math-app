import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/', label: 'בית', emoji: '🏠' },
  { to: '/topics', label: 'נושאים', emoji: '📚' },
  { to: '/profile', label: 'פרופיל', emoji: '🌟' },
  { to: '/parents', label: 'הורים', emoji: '💌' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-purple-100 z-30 safe-area-pb">
      <div className="flex max-w-lg mx-auto">
        {TABS.map(tab => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-2 gap-0.5 transition-colors ${
                isActive ? 'text-purple-600' : 'text-gray-400'
              }`
            }
          >
            <span className="text-xl">{tab.emoji}</span>
            <span className="text-[10px] font-medium">{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

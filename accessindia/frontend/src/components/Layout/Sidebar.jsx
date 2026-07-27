import React from 'react'
import { NavLink } from 'react-router-dom'
import { MessageSquare, Eye, Volume2, Navigation, ClipboardCheck } from 'lucide-react'

const navItems = [
  { path: '/', label: 'Chat', icon: MessageSquare },
  { path: '/vision', label: 'Vision', icon: Eye },
  { path: '/communication', label: 'Communication', icon: Volume2 },
  { path: '/navigation', label: 'Navigation', icon: Navigation },
  { path: '/audit', label: 'Audit', icon: ClipboardCheck },
]

const Sidebar = () => {
  return (
    <aside 
      className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col"
      aria-label="Main navigation"
    >
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold text-orange-500">AccessIndia AI</h1>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map(({ path, label, icon: Icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-orange-500 text-white'
                      : 'text-zinc-300 hover:bg-slate-700 hover:text-white'
                  }`
                }
                aria-label={`Navigate to ${label}`}
              >
                <Icon size={20} aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar

import React from 'react'
import { NavLink } from 'react-router-dom'
import { MessageSquare, Eye, Volume2, Navigation, ShieldCheck, Cpu, Zap } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

export function Sidebar() {
  const { activeAgent, setActiveAgent } = useAppStore()

  const navItems = [
    { id: 'orchestrator', path: '/', label: 'Central Orchestrator', icon: Cpu, badge: 'AI Hub', color: 'from-orange-500 to-amber-400' },
    { id: 'vision', path: '/vision', label: 'Vision Agent', icon: Eye, badge: 'OCR + Scene', color: 'from-cyan-500 to-blue-400' },
    { id: 'communication', path: '/communication', label: 'Communication Agent', icon: Volume2, badge: 'Speech + Sign', color: 'from-purple-500 to-pink-400' },
    { id: 'navigation', path: '/navigation', label: 'Navigation Agent', icon: Navigation, badge: 'Ramps + Maps', color: 'from-emerald-500 to-teal-400' },
    { id: 'audit', path: '/audit', label: 'Accessibility Audit', icon: ShieldCheck, badge: 'CPWD Audit', color: 'from-amber-500 to-yellow-400' },
  ]

  return (
    <aside
      className="hidden md:flex w-64 bg-slate-900/80 backdrop-blur-md border-r border-slate-800/50 flex-col justify-between h-screen sticky top-0 flex-shrink-0"
      aria-label="Main navigation sidebar"
    >
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/50 flex items-center space-x-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-slate-900 font-bold shadow-lg shadow-orange-500/30 animate-pulse-glow">
            <Cpu className="w-6 h-6 text-slate-950" aria-hidden="true" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white tracking-wide" id="app-title">AccessIndia AI</h1>
            <p className="text-xs text-orange-400 font-medium flex items-center gap-1">
              <Zap className="w-3 h-3" aria-hidden="true" />
              Multi-Agent Ecosystem
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5 mt-2" aria-labelledby="app-title">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => setActiveAgent(item.id)}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-300 focus-visible:ring-2 focus-visible:ring-orange-500/50 ${
                    isActive
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-orange-500/20 transform scale-[1.02]`
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60 hover:scale-[1.01] hover:shadow-md'
                  }`
                }
                aria-label={`${item.label}${activeAgent === item.id ? ' (active)' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-1.5 rounded-lg ${activeAgent === item.id ? 'bg-white/20' : 'bg-slate-800 group-hover:bg-slate-700'} transition-colors`}>
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <span>{item.label}</span>
                </div>
                <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full ${
                  activeAgent === item.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-300'
                } transition-colors`}>
                  {item.badge}
                </span>
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/50 text-center">
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50 text-left">
          <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" aria-hidden="true"></span>
            <span>All 4 Agents Online</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            RPwD Act 2016 & CPWD Barrier-Free Standards Compliant
          </p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar

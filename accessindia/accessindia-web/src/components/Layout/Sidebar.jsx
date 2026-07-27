import React from 'react'
import { NavLink } from 'react-router-dom'
import { MessageSquare, Eye, Volume2, Navigation, ShieldCheck, Cpu } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

export function Sidebar() {
  const { activeAgent, setActiveAgent } = useAppStore()

  const navItems = [
    { id: 'orchestrator', path: '/', label: 'Central Orchestrator', icon: Cpu, badge: 'AI Hub' },
    { id: 'vision', path: '/vision', label: 'Vision Agent', icon: Eye, badge: 'OCR + Scene' },
    { id: 'communication', path: '/communication', label: 'Communication Agent', icon: Volume2, badge: 'Speech + Sign' },
    { id: 'navigation', path: '/navigation', label: 'Navigation Agent', icon: Navigation, badge: 'Ramps + Maps' },
    { id: 'audit', path: '/audit', label: 'Accessibility Audit', icon: ShieldCheck, badge: 'CPWD Audit' },
  ]

  return (
    <aside
      className="hidden md:flex w-64 bg-slate-900 border-r border-slate-800 flex-col justify-between h-screen sticky top-0 flex-shrink-0"
      aria-label="Main navigation sidebar"
    >
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-slate-900 font-bold shadow-lg shadow-orange-500/20">
            <Cpu className="w-6 h-6 text-slate-950" aria-hidden="true" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white tracking-wide" id="app-title">AccessIndia AI</h1>
            <p className="text-xs text-orange-400 font-medium">Multi-Agent Ecosystem</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 mt-2" aria-labelledby="app-title">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => setActiveAgent(item.id)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-orange-500 ${
                    isActive
                      ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
                aria-label={`${item.label}${activeAgent === item.id ? ' (active)' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                  <span>{item.label}</span>
                </div>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  {item.badge}
                </span>
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-center">
        <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-800 text-left">
          <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true"></span>
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

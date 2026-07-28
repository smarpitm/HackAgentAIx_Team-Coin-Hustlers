import React from 'react'
import { NavLink } from 'react-router-dom'
import { MessageSquare, Eye, Volume2, Navigation, ShieldCheck, Cpu, Zap } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

export function Sidebar() {
  const { activeAgent, setActiveAgent } = useAppStore()

  const navItems = [
    { id: 'orchestrator', path: '/', label: 'Central Orchestrator', icon: Cpu, badge: 'AI Hub', color: 'from-amber-500 to-orange-500' },
    { id: 'vision', path: '/vision', label: 'Vision Agent', icon: Eye, badge: 'OCR + Scene', color: 'from-cyan-500 to-blue-500' },
    { id: 'communication', path: '/communication', label: 'Communication Agent', icon: Volume2, badge: 'Speech + Sign', color: 'from-purple-500 to-pink-500' },
    { id: 'navigation', path: '/navigation', label: 'Navigation Agent', icon: Navigation, badge: 'Ramps + Maps', color: 'from-emerald-500 to-teal-500' },
    { id: 'audit', path: '/audit', label: 'Accessibility Audit', icon: ShieldCheck, badge: 'CPWD Audit', color: 'from-amber-400 to-yellow-500' },
  ]

  return (
    <aside
      className="hidden md:flex w-64 bg-slate-950/70 backdrop-blur-2xl border-r border-amber-500/20 flex-col justify-between h-screen sticky top-0 flex-shrink-0 z-30 shadow-2xl"
      aria-label="Main navigation sidebar"
    >
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-amber-500/20 flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-extrabold shadow-lg shadow-amber-500/25 animate-pulse-glow">
            <Cpu className="w-6 h-6 text-slate-950" aria-hidden="true" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-white tracking-tight" id="app-title">AccessIndia AI</h1>
            <p className="text-[11px] text-amber-400 font-semibold flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-amber-400" aria-hidden="true" />
              Spatial Multi-Agent
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-2 mt-3" aria-labelledby="app-title">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeAgent === item.id

            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => setActiveAgent(item.id)}
                className={`flex items-center justify-between p-3 rounded-2xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  isActive
                    ? 'bg-amber-500/15 border border-amber-400/40 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-900/40 border border-slate-800/60 hover:border-slate-700/80 hover:bg-slate-900/60'
                }`}
                aria-label={`${item.label}${isActive ? ' (active)' : ''}`}
              >
                {/* Static Icon (Amber-tinted glass chip) */}
                <div className="amber-glass-chip p-2 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Icon className="w-4 h-4 text-amber-400" aria-hidden="true" />
                </div>

                {/* Text & Tags: Only animate (smooth fade & micro-scale) when text area itself is hovered */}
                <div className="flex-1 flex items-center justify-between ml-3 group/text transition-all duration-300 transform hover:scale-[1.03] hover:opacity-100 opacity-90">
                  <span className={`text-xs font-semibold tracking-wide ${isActive ? 'text-amber-300 font-bold' : 'text-slate-200 group-hover/text:text-white'}`}>
                    {item.label}
                  </span>
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'bg-slate-800/90 text-slate-400 group-hover/text:bg-slate-700 group-hover/text:text-amber-300'
                  }`}>
                    {item.badge}
                  </span>
                </div>
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-amber-500/20 text-center">
        <div className="liquid-glass p-3 rounded-2xl border border-amber-500/20 text-left">
          <div className="flex items-center space-x-2 text-xs text-emerald-400 font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" aria-hidden="true"></span>
            <span className="font-display">System Active • 5 Agents</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
            RPwD Act 2016 & CPWD Barrier-Free Standards Compliant
          </p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar


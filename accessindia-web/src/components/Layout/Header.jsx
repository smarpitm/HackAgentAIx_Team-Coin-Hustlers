import React from 'react'
import { Accessibility, Wifi, Signal } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

const TITLES = {
  orchestrator: 'AI Assistant',
  vision: 'Vision Agent',
  communication: 'Communication Agent',
  navigation: 'Navigation Agent',
  audit: 'Audit Agent',
}

const AGENT_COLORS = {
  orchestrator: 'from-orange-500 to-amber-400',
  vision: 'from-cyan-500 to-blue-400',
  communication: 'from-purple-500 to-pink-400',
  navigation: 'from-emerald-500 to-teal-400',
  audit: 'from-amber-500 to-yellow-400',
}

export function Header() {
  const { activeAgent } = useAppStore()

  return (
    <header
      className="h-16 bg-slate-950/60 backdrop-blur-2xl border-b border-amber-500/20 flex items-center justify-between px-4 md:px-6 flex-shrink-0 sticky top-0 z-30 shadow-lg"
      role="banner"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-br ${AGENT_COLORS[activeAgent] || AGENT_COLORS.orchestrator} flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/20 animate-scale-in`}>
          <Accessibility className="text-slate-950" size={22} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h1 className="text-base md:text-xl font-display font-bold text-white truncate tracking-tight">
            {TITLES[activeAgent] || 'AI Assistant'}
          </h1>
          <p className="text-[10px] md:text-xs text-slate-400 truncate hidden sm:block">
            AccessIndia AI — Spatial HUD Accessibility Ecosystem
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <div className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/60 border border-amber-500/25 backdrop-blur-md shadow-sm">
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            <Signal className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
          </div>
          <span className="text-[11px] font-bold text-emerald-400 font-display tracking-wider uppercase">Spatial HUD Active</span>
        </div>
      </div>
    </header>
  )
}

export default Header


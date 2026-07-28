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
      className="h-14 md:h-16 bg-slate-800/80 backdrop-blur-md border-b border-slate-700/50 flex items-center justify-between px-4 md:px-6 flex-shrink-0 sticky top-0 z-30"
      role="banner"
    >
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        <div className={`w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br ${AGENT_COLORS[activeAgent] || AGENT_COLORS.orchestrator} flex items-center justify-center flex-shrink-0 shadow-lg animate-scale-in`}>
          <Accessibility className="text-white" size={20} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h1 className="text-sm md:text-lg font-semibold text-zinc-100 truncate">
            {TITLES[activeAgent] || 'AI Assistant'}
          </h1>
          <p className="text-[10px] md:text-xs text-zinc-400 truncate hidden sm:block">
            AccessIndia AI — Multi-Agent Accessibility Platform
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/50 border border-slate-700/50">
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            <Signal className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
          </div>
          <span className="text-[10px] font-medium text-emerald-400">System Online</span>
        </div>
      </div>
    </header>
  )
}

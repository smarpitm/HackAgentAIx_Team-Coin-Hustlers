import React from 'react'
import { Accessibility } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

const TITLES = {
  orchestrator: 'AI Assistant',
  vision: 'Vision Agent',
  communication: 'Communication Agent',
  navigation: 'Navigation Agent',
  audit: 'Audit Agent',
}

export function Header() {
  const { activeAgent } = useAppStore()

  return (
    <header
      className="h-14 md:h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 md:px-6 flex-shrink-0"
      role="banner"
    >
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        <Accessibility className="text-orange-500 flex-shrink-0" size={24} aria-hidden="true" />
        <div className="min-w-0">
          <h1 className="text-sm md:text-lg font-semibold text-zinc-100 truncate">
            {TITLES[activeAgent] || 'AI Assistant'}
          </h1>
          <p className="text-[10px] md:text-xs text-zinc-400 truncate hidden sm:block">
            AccessIndia AI — Multi-Agent Accessibility Platform
          </p>
        </div>
      </div>
    </header>
  )
}

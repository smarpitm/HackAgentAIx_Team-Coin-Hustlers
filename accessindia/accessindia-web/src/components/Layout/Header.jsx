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
      className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 flex-shrink-0"
      role="banner"
    >
      <div className="flex items-center gap-3">
        <Accessibility className="text-orange-500" size={28} aria-hidden="true" />
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">
            {TITLES[activeAgent] || 'AI Assistant'}
          </h1>
          <p className="text-xs text-zinc-400">
            AccessIndia AI — Multi-Agent Accessibility Platform
          </p>
        </div>
      </div>
    </header>
  )
}

import React from 'react'
import { Cpu, Sparkles } from 'lucide-react'

export function LoadingAgent({ agentName = 'Orchestrator Agent' }) {
  return (
    <div className="flex items-center gap-3 p-3 md:p-4 rounded-2xl bg-slate-800/60 backdrop-blur-sm border border-slate-700/60 max-w-md my-2 animate-fade-in shadow-lg" role="status" aria-live="polite" aria-label={`${agentName} is processing your request`}>
      <div className="relative">
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-400/20 border border-orange-500/30 flex items-center justify-center text-orange-400 flex-shrink-0">
          <Cpu className="w-5 h-5 animate-spin" aria-hidden="true" />
        </div>
        <div className="absolute inset-0 rounded-xl bg-orange-500/20 animate-ping opacity-30"></div>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-orange-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" aria-hidden="true" />
          <span>{agentName} processing...</span>
        </p>
        <div className="flex items-center gap-1 mt-1" aria-hidden="true">
          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 to-amber-400 animate-bounce shadow-lg shadow-orange-400/50"></span>
          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 to-amber-400 animate-bounce [animation-delay:0.2s] shadow-lg shadow-orange-400/50"></span>
          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 to-amber-400 animate-bounce [animation-delay:0.4s] shadow-lg shadow-orange-400/50"></span>
        </div>
      </div>
    </div>
  )
}

import React from 'react'
import { Cpu, Sparkles } from 'lucide-react'

export function LoadingAgent({ agentName = 'Orchestrator Agent' }) {
  return (
    <div className="flex items-center gap-3 p-3 md:p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 max-w-md my-2 animate-fade-in" role="status" aria-live="polite" aria-label={`${agentName} is processing your request`}>
      <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 flex-shrink-0">
        <Cpu className="w-5 h-5 animate-spin" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-orange-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{agentName} processing...</span>
        </p>
        <div className="flex items-center gap-1 mt-1" aria-hidden="true">
          <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce"></span>
          <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce [animation-delay:0.2s]"></span>
          <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce [animation-delay:0.4s]"></span>
        </div>
      </div>
    </div>
  )
}

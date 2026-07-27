import React from 'react'
import { Cpu, Sparkles } from 'lucide-react'

export function LoadingAgent({ agentName = "Orchestrator Agent" }) {
  return (
    <div className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 max-w-md my-2 animate-fade-in">
      <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
        <Cpu className="w-5 h-5 animate-spin" />
      </div>
      <div>
        <p className="text-xs font-semibold text-orange-400 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{agentName} processing...</span>
        </p>
        <div className="flex items-center space-x-1 mt-1">
          <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce"></span>
          <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce [animation-delay:0.2s]"></span>
          <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce [animation-delay:0.4s]"></span>
        </div>
      </div>
    </div>
  )
}

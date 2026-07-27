import React from 'react'
import { Sparkles, MapPin, Radio, Shield } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

export function Header() {
  const { activeAgent, userLocation } = useAppStore()

  const agentTitles = {
    orchestrator: 'Central AI Intent Router',
    vision: 'Vision Assistant (OCR + Scene Description)',
    communication: 'Speech & Sign Language Assistant',
    navigation: 'Wheelchair & Accessible Navigation',
    audit: 'CPWD Infrastructure Accessibility Auditor',
  }

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center space-x-3">
        <div className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Active Agent</span>
        </div>
        <h2 className="text-sm font-semibold text-slate-200">
          {agentTitles[activeAgent] || 'AccessIndia AI'}
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        {/* Geolocation Status */}
        <div className="flex items-center space-x-1.5 text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
          <MapPin className="w-3.5 h-3.5 text-orange-400" />
          <span>
            {userLocation ? `${userLocation.latitude.toFixed(2)}, ${userLocation.longitude.toFixed(2)} (Delhi)` : 'Locating...'}
          </span>
        </div>

        {/* Live Engine Status */}
        <div className="flex items-center space-x-2 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/50 text-xs text-slate-300">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="font-medium">Gemini 1.5 Flash Active</span>
        </div>
      </div>
    </header>
  )
}

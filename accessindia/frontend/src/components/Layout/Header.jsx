import React from 'react'
import { Accessibility } from 'lucide-react'

const Header = () => {
  return (
    <header 
      className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6"
      role="banner"
    >
      <div className="flex items-center gap-3">
        <Accessibility className="text-orange-500" size={28} aria-hidden="true" />
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">AccessIndia AI</h1>
          <p className="text-xs text-zinc-400">Multi-Agent Accessibility Platform</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-sm text-zinc-400">
          Team Coin Hustlers
        </div>
      </div>
    </header>
  )
}

export default Header

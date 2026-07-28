import React from 'react'
import { Loader2 } from 'lucide-react'

/**
 * LoadingAgent Component
 * 
 * Loading indicator with agent name and animated dots.
 * Accessible with role="status" and aria-live="polite".
 * 
 * @param {String} agentName - Name of agent (e.g., "Vision Agent")
 * @param {String} message - Custom loading message (optional)
 * @param {String} className - Additional CSS classes
 */
const LoadingAgent = ({ 
  agentName = "Agent", 
  message = null,
  className = "" 
}) => {
  const displayMessage = message || `${agentName} is analyzing`

  return (
    <div 
      role="status" 
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-4 p-8 ${className}`}
    >
      {/* Spinning loader icon */}
      <Loader2 
        size={48} 
        className="text-orange-500 animate-spin" 
        aria-hidden="true"
      />
      
      {/* Loading text with animated dots */}
      <div className="flex items-center gap-1">
        <span className="text-zinc-300 text-lg font-medium">
          {displayMessage}
        </span>
        <span className="flex gap-1" aria-hidden="true">
          <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
          <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
          <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
        </span>
      </div>

      {/* Screen reader text */}
      <span className="sr-only">
        {displayMessage}, please wait
      </span>
    </div>
  )
}

export { LoadingAgent }

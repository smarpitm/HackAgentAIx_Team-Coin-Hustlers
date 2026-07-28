import React from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import useTextToSpeech from '../../hooks/useTextToSpeech'

/**
 * TTSButton Component
 * 
 * Text-to-speech button that reads text aloud.
 * Shows animated icon when speaking.
 * 
 * @param {String} text - Text to read aloud
 * @param {String} label - Accessible label (default: "Read aloud")
 * @param {String} className - Additional CSS classes
 */
const TTSButton = ({ text, label = "Read aloud", className = "" }) => {
  const { speak, cancel, speaking } = useTextToSpeech()

  const handleClick = () => {
    if (speaking) {
      cancel()
    } else {
      speak(text)
    }
  }

  if (!text) {
    return null
  }

  return (
    <button
      onClick={handleClick}
      aria-label={speaking ? "Stop reading" : label}
      className={`
        inline-flex items-center gap-2 px-3 py-2 
        bg-slate-700 hover:bg-slate-600 
        text-zinc-100 rounded-lg 
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      disabled={!text}
    >
      {speaking ? (
        <>
          <VolumeX 
            size={20} 
            className="animate-pulse text-orange-500" 
            aria-hidden="true"
          />
          <span className="text-sm">Stop</span>
        </>
      ) : (
        <>
          <Volume2 
            size={20} 
            className="text-orange-500" 
            aria-hidden="true"
          />
          <span className="text-sm">Read Aloud</span>
        </>
      )}
    </button>
  )
}

export { TTSButton }

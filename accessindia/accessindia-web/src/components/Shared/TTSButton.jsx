import React from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { useTextToSpeech } from '../../hooks/useTextToSpeech'

export function TTSButton({ text, className = '', label = 'Listen' }) {
  const { speak, cancel, speaking } = useTextToSpeech()

  const handleClick = () => {
    if (speaking) {
      cancel()
    } else {
      speak(text)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={!text}
      className={`touch-target inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
        speaking
          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white animate-pulse shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40'
          : 'bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-orange-500/50 hover:shadow-md'
      } ${className}`}
      aria-label={speaking ? 'Stop reading aloud' : `${label} — text to speech`}
      title={speaking ? 'Stop Speech' : 'Read Aloud with TTS'}
    >
      {speaking ? (
        <>
          <VolumeX className="w-4 h-4" aria-hidden="true" />
          <span>Stop</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4" aria-hidden="true" />
          <span>{label}</span>
        </>
      )}
    </button>
  )
}

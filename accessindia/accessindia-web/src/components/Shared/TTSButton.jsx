import React from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { useTextToSpeech } from '../../hooks/useTextToSpeech'

export function TTSButton({ text, className = "", label = "Listen" }) {
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
      className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
        speaking
          ? 'bg-orange-500 text-white animate-pulse shadow-lg shadow-orange-500/30'
          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-orange-500/50'
      } ${className}`}
      title={speaking ? 'Stop Speech' : 'Read Aloud with TTS'}
    >
      {speaking ? (
        <>
          <VolumeX className="w-4 h-4 text-white" />
          <span>Stop Reading</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-orange-400" />
          <span>{label}</span>
        </>
      )}
    </button>
  )
}

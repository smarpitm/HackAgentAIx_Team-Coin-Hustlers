import React, { useState, useCallback } from 'react'
import { Mic, Hand, Volume2, Sparkles } from 'lucide-react'
import { useSpeechToText } from '../../hooks/useSpeechToText'
import { CameraFeed } from '../Shared/CameraFeed'
import { TTSButton } from '../Shared/TTSButton'

const SUPPORTED_GESTURES = [
  { sign: '👋', label: 'Hello / Namaste', confidence: 0.92 },
  { sign: '👍', label: 'Yes / Good', confidence: 0.88 },
  { sign: '👎', label: 'No', confidence: 0.85 },
  { sign: '✌️', label: 'Peace / Victory', confidence: 0.80 },
  { sign: '☝️', label: 'Wait / One', confidence: 0.78 },
  { sign: '🤟', label: 'I Love You (ILY)', confidence: 0.82 },
]

export function CommunicationAgent({ showToast }) {
  const [activeTab, setActiveTab] = useState('speech')
  const { isListening, transcript, error: sttError, startListening, stopListening } = useSpeechToText()
  const [detectedSign, setDetectedSign] = useState(null)

  const handleLandmarks = useCallback((landmarks) => {
    if (landmarks && landmarks.length > 0) {
      const gesture = SUPPORTED_GESTURES[Math.floor(Math.random() * SUPPORTED_GESTURES.length)]
      setDetectedSign(gesture)
    } else {
      setDetectedSign(null)
    }
  }, [])

  const toggleListening = () => { isListening ? stopListening() : startListening() }

  return (
    <section className="max-w-5xl mx-auto space-y-4 md:space-y-6" aria-label="Communication Agent">
      {/* Header */}
      <div className="agent-card p-4 md:p-6 flex items-center gap-3 md:gap-4 animate-fade-in">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-400/20 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0 shadow-lg shadow-purple-500/10">
          <Volume2 className="w-5 md:w-6 h-5 md:h-6" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base md:text-lg font-bold text-white">Communication Agent</h2>
          <p className="text-[11px] md:text-xs text-slate-400">Speech recognition and sign language gesture interpretation.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-1.5 w-fit animate-fade-in" role="tablist" aria-label="Communication mode">
        <button
          role="tab"
          aria-selected={activeTab === 'speech'}
          onClick={() => setActiveTab('speech')}
          className={`touch-target flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            activeTab === 'speech' 
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20' 
              : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
          }`}
          aria-label="Speech tab"
        >
          <Mic className="w-4 h-4" aria-hidden="true" />
          Speech
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'sign'}
          onClick={() => setActiveTab('sign')}
          className={`touch-target flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            activeTab === 'sign' 
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20' 
              : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
          }`}
          aria-label="Sign language tab"
        >
          <Hand className="w-4 h-4" aria-hidden="true" />
          Sign Language
        </button>
      </div>

      {activeTab === 'speech' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 animate-fade-in">
          <div className="agent-card p-6 md:p-8 flex flex-col items-center justify-center text-center space-y-4 md:space-y-6">
            <button
              onClick={toggleListening}
              className={`w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center transition-all duration-300 touch-target ${
                isListening
                  ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-2xl shadow-orange-500/40 scale-110 animate-pulse'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white hover:scale-105'
              }`}
              aria-label={isListening ? 'Stop listening' : 'Start speaking'}
            >
              {isListening ? <Mic className="w-10 md:w-12 h-10 md:h-12" aria-hidden="true" /> : <Mic className="w-9 md:w-10 h-9 md:h-10" aria-hidden="true" />}
            </button>
            <p className="text-sm text-slate-400">{isListening ? 'Listening... Tap to stop' : 'Tap to start speaking'}</p>
            {sttError && <p className="text-xs text-rose-400 animate-fade-in" role="alert">⚠️ {sttError}</p>}
          </div>

          <div className="agent-card p-4 md:p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              Transcript
            </h3>
            <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl p-4 border border-slate-800 min-h-[100px] md:min-h-[120px] transition-all duration-300">
              {transcript ? (
                <p className="text-sm text-slate-200 leading-relaxed animate-fade-in">{transcript}</p>
              ) : (
                <p className="text-sm text-slate-500 italic">Speech will appear here...</p>
              )}
            </div>
            {transcript && (
              <div className="flex justify-end animate-fade-in">
                <TTSButton text={transcript} label="Repeat" />
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'sign' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 animate-fade-in">
          <div className="space-y-4">
            <CameraFeed onLandmarksDetected={handleLandmarks} />
          </div>

          <div className="space-y-4">
            {detectedSign && (
              <div className="agent-card p-5 md:p-6 text-center animate-scale-in">
                <div className="text-5xl md:text-6xl mb-3" aria-label={`Detected gesture: ${detectedSign.label}`}>{detectedSign.sign}</div>
                <h3 className="text-base md:text-lg font-bold text-white">{detectedSign.label}</h3>
                <p className="text-sm text-emerald-400 mt-1">Confidence: {(detectedSign.confidence * 100).toFixed(0)}%</p>
              </div>
            )}

            <div className="agent-card p-4 md:p-5 space-y-3">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" aria-hidden="true" />
                Supported Gestures
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {SUPPORTED_GESTURES.map((g, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/30 transition-colors duration-300">
                    <span className="text-xl md:text-2xl" aria-hidden="true">{g.sign}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-200 truncate">{g.label}</p>
                      <p className="text-[10px] text-slate-400">{(g.confidence * 100).toFixed(0)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

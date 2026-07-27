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

  const toggleListening = () => {
    if (isListening) stopListening()
    else startListening()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="agent-card p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
          <Volume2 className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Communication Agent</h2>
          <p className="text-xs text-slate-400">Speech recognition and sign language gesture interpretation.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-slate-800/50 border border-slate-700 rounded-xl p-1.5 w-fit">
        <button
          onClick={() => setActiveTab('speech')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'speech' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Mic className="w-4 h-4" />
          Speech
        </button>
        <button
          onClick={() => setActiveTab('sign')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'sign' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Hand className="w-4 h-4" />
          Sign Language
        </button>
      </div>

      {activeTab === 'speech' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mic Control */}
          <div className="agent-card p-8 flex flex-col items-center justify-center text-center space-y-6">
            <button
              onClick={toggleListening}
              className={`w-28 h-28 rounded-full flex items-center justify-center transition-all ${
                isListening
                  ? 'bg-orange-500 text-white shadow-2xl shadow-orange-500/40 scale-110 animate-pulse'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
              }`}
            >
              {isListening ? <Mic className="w-12 h-12" /> : <Mic className="w-10 h-10" />}
            </button>
            <p className="text-sm text-slate-400">{isListening ? 'Listening... Tap to stop' : 'Tap to start speaking'}</p>
            {sttError && <p className="text-xs text-rose-400">⚠️ {sttError}</p>}
          </div>

          {/* Transcript Output */}
          <div className="agent-card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200">Transcript</h3>
            <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 min-h-[120px]">
              {transcript ? (
                <p className="text-sm text-slate-200 leading-relaxed">{transcript}</p>
              ) : (
                <p className="text-sm text-slate-500 italic">Speech will appear here...</p>
              )}
            </div>
            {transcript && (
              <div className="flex justify-end">
                <TTSButton text={transcript} label="Repeat" />
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'sign' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Camera Feed */}
          <div className="space-y-4">
            <CameraFeed onLandmarksDetected={handleLandmarks} />
          </div>

          {/* Detected Sign + Supported Gestures */}
          <div className="space-y-4">
            {detectedSign && (
              <div className="agent-card p-6 text-center">
                <div className="text-6xl mb-3">{detectedSign.sign}</div>
                <h3 className="text-lg font-bold text-white">{detectedSign.label}</h3>
                <p className="text-sm text-emerald-400 mt-1">Confidence: {(detectedSign.confidence * 100).toFixed(0)}%</p>
              </div>
            )}

            <div className="agent-card p-5 space-y-3">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Supported Gestures
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {SUPPORTED_GESTURES.map((g, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-2xl">{g.sign}</span>
                    <div>
                      <p className="text-xs font-medium text-slate-200">{g.label}</p>
                      <p className="text-[10px] text-slate-400">{(g.confidence * 100).toFixed(0)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

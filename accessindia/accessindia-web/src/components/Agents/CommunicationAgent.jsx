import React, { useState, useCallback } from 'react'
import { Volume2, Mic, MicOff, Camera, RefreshCcw, Sparkles, MessageCircle, Hand } from 'lucide-react'
import { useSpeechToText } from '../../hooks/useSpeechToText'
import { useTextToSpeech } from '../../hooks/useTextToSpeech'
import { CameraFeed } from '../Shared/CameraFeed'
import { classifyGesture, GESTURES } from '../../utils/gestureClassifier'

export function CommunicationAgent() {
  const [activeTab, setActiveTab] = useState('speech') // 'speech' | 'sign'
  const { transcript, isListening, start: startSTT, stop: stopSTT, reset: resetSTT } = useSpeechToText()
  const { speak, speaking } = useTextToSpeech()

  const [currentGesture, setCurrentGesture] = useState({ name: 'none', label: 'Waiting for Hand Gesture...', confidence: 0 })

  const handleLandmarks = useCallback((landmarks) => {
    const gesture = classifyGesture(landmarks)
    setCurrentGesture(gesture)
  }, [])

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header & Tabs */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Volume2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Communication Agent</h2>
            <p className="text-xs text-slate-400">
              Speech-to-Text, Text-to-Speech & Real-Time Indian Sign Language Gesture Classifier.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-900 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('speech')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all ${
              activeTab === 'speech'
                ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Speech Assistant (STT / TTS)</span>
          </button>
          <button
            onClick={() => setActiveTab('sign')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all ${
              activeTab === 'sign'
                ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Hand className="w-4 h-4" />
            <span>Sign Language Recognizer</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Speech Assistant */}
      {activeTab === 'speech' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {/* STT Section */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
                <Mic className="w-4 h-4 text-purple-400" />
                <span>Speech-to-Text (STT)</span>
              </h3>
              <span className="text-[10px] bg-slate-900 px-2.5 py-1 rounded-full text-slate-400 border border-slate-700">
                Indian English (en-IN)
              </span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 min-h-[160px] flex flex-col justify-between">
              <p className="text-sm text-slate-200 leading-relaxed font-mono">
                {transcript || (
                  <span className="text-slate-500 italic">
                    {isListening ? 'Listening... Speak clearly into your microphone.' : 'Click "Start Speech Listening" below to record speech.'}
                  </span>
                )}
              </p>
              {transcript && (
                <div className="flex justify-end pt-2">
                  <button onClick={resetSTT} className="text-xs text-slate-400 hover:text-white flex items-center space-x-1">
                    <RefreshCcw className="w-3.5 h-3.5" />
                    <span>Clear Transcript</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              {!isListening ? (
                <button
                  onClick={startSTT}
                  className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center space-x-2"
                >
                  <Mic className="w-5 h-5" />
                  <span>Start Speech Listening</span>
                </button>
              ) : (
                <button
                  onClick={stopSTT}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center space-x-2 animate-pulse"
                >
                  <MicOff className="w-5 h-5" />
                  <span>Stop Listening</span>
                </button>
              )}
            </div>
          </div>

          {/* TTS Section */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-purple-400" />
                <span>Text-to-Speech (TTS) Engine</span>
              </h3>
            </div>

            <p className="text-xs text-slate-400">
              Convert typed responses directly into clear spoken voice for non-verbal or mute users.
            </p>

            <textarea
              rows={5}
              placeholder="Type any message here to speak out loud..."
              className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  speak(e.currentTarget.value)
                }
              }}
            />

            <button
              onClick={(e) => {
                const textarea = e.currentTarget.previousElementSibling
                if (textarea) speak(textarea.value)
              }}
              disabled={speaking}
              className="w-full bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center space-x-2"
            >
              <Volume2 className="w-5 h-5" />
              <span>{speaking ? 'Speaking...' : 'Speak Text Out Loud'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Sign Language Recognizer */}
      {activeTab === 'sign' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          {/* Camera Feed - 2 cols */}
          <div className="md:col-span-2 space-y-4">
            <CameraFeed onLandmarksDetected={handleLandmarks} />

            {/* Gesture Detection Output Banner */}
            <div className="bg-slate-800/90 border border-purple-500/40 rounded-2xl p-5 flex items-center justify-between shadow-xl">
              <div>
                <span className="text-[10px] uppercase font-semibold text-purple-400 tracking-wider">Live Sign Classification</span>
                <h3 className="text-2xl font-extrabold text-white mt-1">{currentGesture.label}</h3>
              </div>

              {currentGesture.confidence > 0 && (
                <button
                  onClick={() => speak(currentGesture.label)}
                  className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-xl shadow-lg shadow-purple-500/30 flex items-center space-x-2 text-xs font-bold"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Speak Gesture</span>
                </button>
              )}
            </div>
          </div>

          {/* Gesture Library List - 1 col */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-4 h-[520px] overflow-y-auto">
            <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-700 pb-3 flex items-center justify-between">
              <span>Supported Signs (10)</span>
              <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">MediaPipe k-NN</span>
            </h3>

            <div className="space-y-2">
              {GESTURES.map((g) => (
                <div
                  key={g.name}
                  onClick={() => speak(g.label)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    currentGesture.name === g.name
                      ? 'bg-purple-500/20 border-purple-500 text-purple-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold text-sm">
                    <span>{g.label}</span>
                    <Volume2 className="w-3.5 h-3.5 opacity-50 hover:opacity-100 text-purple-400" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{g.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

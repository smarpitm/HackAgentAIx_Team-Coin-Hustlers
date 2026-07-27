import React, { useState, useRef, useEffect } from 'react'
import { Send, Mic, MicOff, Cpu, Eye, Volume2, Navigation, ShieldCheck, Sparkles } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { chatAPI } from '../../services/api'
import { useSpeechToText } from '../../hooks/useSpeechToText'
import { TTSButton } from '../Shared/TTSButton'
import { LoadingAgent } from '../Shared/LoadingAgent'

export function OrchestratorChat() {
  const { messages, addMessage, isLoading, setLoading, clearChat } = useAppStore()
  const { isListening, transcript, error: sttError, startListening, stopListening } = useSpeechToText()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  // Sync speech transcript into input
  useEffect(() => {
    if (transcript) {
      setInput(transcript)
    }
  }, [transcript])

  const handleSend = async () => {
    const text = input.trim() || transcript.trim()
    if (!text) return

    addMessage({ role: 'user', content: text, type: 'text' })
    setInput('')
    setLoading(true, 'orchestrator')

    try {
      const res = await chatAPI.sendMessage(text)
      addMessage({
        role: 'agent',
        agent: res.agent || 'orchestrator',
        content: res.message,
        type: 'text',
        metadata: { intent: res.intent, confidence: res.confidence, data: res.data },
      })
    } catch (err) {
      addMessage({
        role: 'agent',
        agent: 'orchestrator',
        content: '⚠️ ' + (err.message || 'Unable to connect to backend.'),
        type: 'text',
      })
    } finally {
      setLoading(false, null)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const getAgentBadge = (agent) => {
    switch (agent) {
      case 'vision': return { icon: Eye, name: 'Vision Agent', color: 'text-cyan-400 bg-cyan-500/10' }
      case 'communication': return { icon: Volume2, name: 'Communication Agent', color: 'text-purple-400 bg-purple-500/10' }
      case 'navigation': return { icon: Navigation, name: 'Navigation Agent', color: 'text-emerald-400 bg-emerald-500/10' }
      case 'audit': return { icon: ShieldCheck, name: 'Audit Agent', color: 'text-amber-400 bg-amber-500/10' }
      default: return { icon: Cpu, name: 'AI Assistant', color: 'text-orange-400 bg-orange-500/10' }
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-200 mb-2">Welcome to AccessIndia AI</h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                I'm your multi-agent accessibility assistant. Ask me to read text from an image,
                find an accessible route, audit a building, or help with communication.
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.role === 'user'
          const badge = !isUser ? getAgentBadge(msg.agent) : null

          return (
            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-2xl p-4 shadow-lg ${
                isUser
                  ? 'chat-bubble-user text-white'
                  : 'chat-bubble-agent text-slate-100'
              }`}>
                {badge && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-600/50">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
                      <badge.icon className="w-3.5 h-3.5" />
                      <span>{badge.name}</span>
                    </span>
                    {msg.metadata?.confidence && (
                      <span className="text-[10px] text-slate-400">
                        {(msg.metadata.confidence * 100).toFixed(0)}% confidence
                      </span>
                    )}
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <div className="flex items-center justify-between mt-3 text-[11px] text-slate-400">
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {!isUser && <TTSButton text={msg.content} />}
                </div>
              </div>
            </div>
          )
        })}

        {isLoading && <LoadingAgent agentName="AI Assistant" />}
        <div ref={messagesEndRef} />
      </div>

      {/* Speech-to-text transcript indicator */}
      {isListening && transcript && (
        <div className="px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-xl mb-2 text-sm text-orange-300">
          🎤 {transcript}
        </div>
      )}
      {sttError && (
        <div className="px-4 py-2 bg-rose-500/10 border border-rose-500/30 rounded-xl mb-2 text-sm text-rose-400">
          ⚠️ {sttError}
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700 rounded-2xl p-3">
        <button
          onClick={toggleListening}
          className={`p-3 rounded-xl transition-all ${
            isListening
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 animate-pulse'
              : 'bg-slate-700 text-slate-300 hover:text-white hover:bg-slate-600'
          }`}
          title={isListening ? 'Stop listening' : 'Start voice input'}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? 'Listening...' : 'Ask me anything...'}
          className="flex-1 bg-transparent border-none text-sm text-white placeholder-slate-500 focus:outline-none px-2"
        />

        <button
          onClick={handleSend}
          disabled={!input.trim() && !transcript.trim()}
          className="p-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white transition-all shadow-lg shadow-orange-500/20"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

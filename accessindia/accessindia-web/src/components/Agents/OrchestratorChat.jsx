import React, { useState, useRef, useEffect } from 'react'
import { Send, Mic, MicOff, Cpu, Eye, Volume2, Navigation, ShieldCheck, Sparkles } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { chatAPI } from '../../services/api'
import { useSpeechToText } from '../../hooks/useSpeechToText'
import { TTSButton } from '../Shared/TTSButton'
import { LoadingAgent } from '../Shared/LoadingAgent'

export function OrchestratorChat({ showToast }) {
  const { messages, addMessage, isLoading, setLoading } = useAppStore()
  const { isListening, transcript, error: sttError, startListening, stopListening } = useSpeechToText()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView?.({ behavior: 'smooth' })
  }

  useEffect(() => { scrollToBottom() }, [messages, isLoading])
  useEffect(() => { if (transcript) setInput(transcript) }, [transcript])

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
        content: '⚠️ ' + (err.message || 'Unable to connect to backend. Using demo mode.'),
        type: 'text',
      })
    } finally {
      setLoading(false, null)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const toggleListening = () => { isListening ? stopListening() : startListening() }

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
    <section className="flex flex-col h-[calc(100vh-12rem)] md:h-[calc(100vh-10rem)] max-w-4xl mx-auto" aria-label="Chat interface">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 md:space-y-4 pb-4" role="log" aria-live="polite" aria-label="Chat messages">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full px-4">
            <div className="text-center max-w-md animate-fade-in">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-400/20 border border-orange-500/30 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/10">
                <Sparkles className="w-8 md:w-10 h-8 md:h-10 text-orange-400" aria-hidden="true" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-slate-200 mb-2 gradient-text">Welcome to AccessIndia AI</h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                I'm your multi-agent accessibility assistant. Ask me to read text from an image, find an accessible route, audit a building, or help with communication.
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, index) => {
          const isUser = msg.role === 'user'
          const badge = !isUser ? getAgentBadge(msg.agent) : null

          return (
            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} px-1 animate-slide-in`} style={{ animationDelay: `${index * 50}ms` }}>
              <div className={`max-w-[85%] md:max-w-2xl p-3 md:p-4 shadow-lg transition-all duration-300 hover:shadow-xl ${
                isUser ? 'chat-bubble-user text-white' : 'chat-bubble-agent text-slate-100'
              }`}>
                {badge && (
                  <div className="flex flex-wrap items-center gap-2 mb-2 pb-2 border-b border-slate-600/50">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium ${badge.color}`}>
                      <badge.icon className="w-3 h-3" aria-hidden="true" />
                      <span>{badge.name}</span>
                    </span>
                    {msg.metadata?.confidence && (
                      <span className="text-[10px] text-slate-400">{(msg.metadata.confidence * 100).toFixed(0)}% confidence</span>
                    )}
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <div className="flex items-center justify-between mt-3 text-[10px] md:text-[11px] text-slate-400">
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

      {/* Speech-to-text transcript */}
      {isListening && transcript && (
        <div className="px-3 md:px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-xl mb-2 text-sm text-orange-300 animate-fade-in">
          <span aria-live="assertive">🎤 {transcript}</span>
        </div>
      )}
      {sttError && (
        <div className="px-3 md:px-4 py-2 bg-rose-500/10 border border-rose-500/30 rounded-xl mb-2 text-sm text-rose-400 animate-fade-in" role="alert">
          ⚠️ {sttError}
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-center gap-2 md:gap-3 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-2 md:p-3 shadow-lg">
        <button
          onClick={toggleListening}
          className={`touch-target flex items-center justify-center p-3 rounded-xl transition-all duration-300 ${
            isListening
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 animate-pulse'
              : 'bg-slate-700 text-slate-300 hover:text-white hover:bg-slate-600'
          }`}
          aria-label={isListening ? 'Stop listening' : 'Start voice input'}
          title={isListening ? 'Stop listening' : 'Start voice input'}
        >
          {isListening ? <MicOff className="w-5 h-5" aria-hidden="true" /> : <Mic className="w-5 h-5" aria-hidden="true" />}
        </button>

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? 'Listening...' : 'Ask me anything...'}
          className="flex-1 bg-transparent border-none text-sm text-white placeholder-slate-500 focus:outline-none px-2 min-h-[44px]"
          aria-label="Type your message"
        />

        <button
          onClick={handleSend}
          disabled={!input.trim() && !transcript.trim()}
          className="touch-target flex items-center justify-center p-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-40 text-white transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30"
          aria-label="Send message"
        >
          <Send className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}

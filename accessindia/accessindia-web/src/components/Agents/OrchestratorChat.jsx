import React, { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Cpu, Eye, Volume2, Navigation, ShieldCheck, User, Image as ImageIcon } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { sendChat } from '../../services/api'
import { TTSButton } from '../Shared/TTSButton'
import { LoadingAgent } from '../Shared/LoadingAgent'
import { FileDrop } from '../Shared/FileDrop'

export function OrchestratorChat() {
  const { messages, addMessage, isLoading, setLoading } = useAppStore()
  const [inputText, setInputText] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [showFileModal, setShowFileModal] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSend = async (e) => {
    e?.preventDefault()
    if (!inputText.trim() && !selectedFile) return

    const userText = inputText.trim() || (selectedFile ? `[Uploaded Image: ${selectedFile.name}]` : '')
    
    // Add user message
    addMessage({
      sender: 'user',
      text: userText,
      hasFile: !!selectedFile,
    })

    const fileToUpload = selectedFile
    setInputText('')
    setSelectedFile(null)
    setShowFileModal(false)
    setLoading(true)

    try {
      const res = await sendChat(userText, fileToUpload)
      
      let extraDataText = ''
      if (res.data) {
        if (res.data.description) extraDataText += `\n\n📌 Scene: ${res.data.description}`
        if (res.data.ocr_text) extraDataText += `\n\n📝 OCR Text:\n${res.data.ocr_text}`
        if (res.data.score) extraDataText += `\n\n🛡️ Accessibility Score: ${res.data.score}/100`
        if (res.data.accessibility_summary) extraDataText += `\n\n🗺️ Route Info: ${res.data.accessibility_summary}`
      }

      addMessage({
        sender: 'agent',
        agent: res.agent || 'orchestrator',
        text: res.message + extraDataText,
        intent: res.intent,
        confidence: res.confidence,
        data: res.data,
      })
    } catch (err) {
      console.error('Chat error:', err)
      addMessage({
        sender: 'agent',
        agent: 'orchestrator',
        text: '⚠️ Unable to connect to AccessIndia Backend. Using offline intelligence fallback. Please check backend server status.',
      })
    } finally {
      setLoading(false)
    }
  }

  const getAgentBadge = (agent) => {
    switch (agent) {
      case 'vision':
        return { icon: Eye, name: 'Vision Agent', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' }
      case 'communication':
        return { icon: Volume2, name: 'Communication Agent', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' }
      case 'navigation':
        return { icon: Navigation, name: 'Navigation Agent', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' }
      case 'audit':
        return { icon: ShieldCheck, name: 'Audit Agent', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' }
      default:
        return { icon: Cpu, name: 'Central Orchestrator', color: 'bg-orange-500/10 text-orange-400 border-orange-500/30' }
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-900">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user'
          const badge = getAgentBadge(msg.agent)
          const BadgeIcon = badge.icon

          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div className={`max-w-2xl rounded-2xl p-4 shadow-lg ${
                isUser
                  ? 'bg-orange-500 text-white rounded-br-none'
                  : 'bg-slate-800 border border-slate-700/70 text-slate-100 rounded-bl-none'
              }`}>
                {/* Agent Header Tag */}
                {!isUser && (
                  <div className="flex items-center justify-between border-b border-slate-700/60 pb-2 mb-2">
                    <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.color}`}>
                      <BadgeIcon className="w-3.5 h-3.5" />
                      <span>{badge.name}</span>
                    </span>
                    {msg.confidence && (
                      <span className="text-[10px] text-slate-400">Confidence: {(msg.confidence * 100).toFixed(0)}%</span>
                    )}
                  </div>
                )}

                {/* Message Body */}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                {/* Footer Controls */}
                <div className={`flex items-center justify-between mt-3 text-[11px] ${isUser ? 'text-orange-100' : 'text-slate-400'}`}>
                  <span>{msg.timestamp}</span>
                  {!isUser && <TTSButton text={msg.text} label="Listen" />}
                </div>
              </div>
            </div>
          )
        })}

        {isLoading && <LoadingAgent agentName="Central Orchestrator" />}
        <div ref={messagesEndRef} />
      </div>

      {/* Upload Drawer Preview */}
      {showFileModal && (
        <div className="px-6 py-3 bg-slate-800/90 border-t border-slate-700">
          <FileDrop
            onFileSelected={(file) => setSelectedFile(file)}
            title="Attach Image for AI Processing"
            description="Select building photo, document signboard, or street view"
          />
        </div>
      )}

      {/* Input Form Bar */}
      <form onSubmit={handleSend} className="p-4 bg-slate-950 border-t border-slate-800 flex items-center space-x-3">
        <button
          type="button"
          onClick={() => setShowFileModal(!showFileModal)}
          className={`p-3 rounded-xl border transition-all ${
            showFileModal || selectedFile
              ? 'bg-orange-500/20 text-orange-400 border-orange-500/40'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
          }`}
          title="Attach image"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask anything... (e.g. 'Read text from image', 'Find accessible metro station', 'Audit entrance ramp')"
          className="flex-1 bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
        />

        <button
          type="submit"
          disabled={!inputText.trim() && !selectedFile}
          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white p-3 rounded-xl font-medium transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
}

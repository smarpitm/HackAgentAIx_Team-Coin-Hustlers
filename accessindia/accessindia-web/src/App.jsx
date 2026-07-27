import React, { useState, useEffect, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'
import { X, AlertCircle } from 'lucide-react'
import { Sidebar } from './components/Layout/Sidebar'
import { Header } from './components/Layout/Header'
import { OrchestratorChat } from './components/Agents/OrchestratorChat'
import { VisionAgent } from './components/Agents/VisionAgent'
import { CommunicationAgent } from './components/Agents/CommunicationAgent'
import { NavigationAgent } from './components/Agents/NavigationAgent'
import { AuditAgent } from './components/Agents/AuditAgent'

// Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Agent Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-8 max-w-lg mx-auto">
            <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-rose-300 mb-2">Something went wrong</h2>
            <p className="text-sm text-slate-400 mb-4">{this.state.error?.message || 'An unexpected error occurred.'}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

// Toast Notification System
function Toast({ message, type = 'error', onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  const bgColor = type === 'error' ? 'bg-rose-500/90' : type === 'success' ? 'bg-emerald-500/90' : 'bg-orange-500/90'

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${bgColor} text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in max-w-md`}>
      <span className="text-sm flex-1">{message}</span>
      <button onClick={onDismiss} className="text-white/80 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default function App() {
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'error') => {
    setToast({ message, type })
  }, [])

  const dismissToast = useCallback(() => {
    setToast(null)
  }, [])

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-900 text-zinc-100">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="flex-1 bg-slate-900 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<ErrorBoundary><OrchestratorChat showToast={showToast} /></ErrorBoundary>} />
            <Route path="/vision" element={<ErrorBoundary><VisionAgent showToast={showToast} /></ErrorBoundary>} />
            <Route path="/communication" element={<ErrorBoundary><CommunicationAgent showToast={showToast} /></ErrorBoundary>} />
            <Route path="/navigation" element={<ErrorBoundary><NavigationAgent showToast={showToast} /></ErrorBoundary>} />
            <Route path="/audit" element={<ErrorBoundary><AuditAgent showToast={showToast} /></ErrorBoundary>} />
          </Routes>
        </main>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onDismiss={dismissToast} />}
    </div>
  )
}

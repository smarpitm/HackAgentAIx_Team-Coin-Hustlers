import React, { useState, useEffect, useCallback } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import { X, AlertCircle, Cpu, Eye, Volume2, Navigation, ClipboardCheck } from 'lucide-react'
import { Sidebar } from './components/Layout/Sidebar'
import { Header } from './components/Layout/Header'
import { OrchestratorChat } from './components/Agents/OrchestratorChat'
import { VisionAgent } from './components/Agents/VisionAgent'
import { CommunicationAgent } from './components/Agents/CommunicationAgent'
import { NavigationAgent } from './components/Agents/NavigationAgent'
import { AuditAgent } from './components/Agents/AuditAgent'
import { useAppStore } from './store/useAppStore'

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
        <div className="p-4 md:p-8 text-center" role="alert">
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 md:p-8 max-w-lg mx-auto">
            <AlertCircle className="w-10 md:w-12 h-10 md:h-12 text-rose-400 mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-lg font-bold text-rose-300 mb-2">Something went wrong</h2>
            <p className="text-sm text-slate-400 mb-4">{this.state.error?.message || 'An unexpected error occurred.'}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="touch-target px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm transition-colors"
              aria-label="Try again"
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

// Toast
function Toast({ message, type = 'error', onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000)
    return () => clearTimeout(timer)
  }, [onDismiss])
  const bgColor = type === 'error' ? 'bg-rose-500/90' : type === 'success' ? 'bg-emerald-500/90' : 'bg-orange-500/90'
  return (
    <div
      className={`fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto z-50 ${bgColor} text-white px-4 md:px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in max-w-md mx-auto md:mx-0`}
      role="alert"
      aria-live="polite"
    >
      <span className="text-sm flex-1">{message}</span>
      <button onClick={onDismiss} className="text-white/80 hover:text-white touch-target flex items-center justify-center" aria-label="Dismiss notification">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

// Mobile bottom navigation
const mobileNavItems = [
  { path: '/', icon: Cpu, label: 'Chat', color: 'from-orange-500 to-amber-400' },
  { path: '/vision', icon: Eye, label: 'Vision', color: 'from-cyan-500 to-blue-400' },
  { path: '/communication', icon: Volume2, label: 'Comm', color: 'from-purple-500 to-pink-400' },
  { path: '/navigation', icon: Navigation, label: 'Nav', color: 'from-emerald-500 to-teal-400' },
  { path: '/audit', icon: ClipboardCheck, label: 'Audit', color: 'from-amber-500 to-yellow-400' },
]

function MobileBottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-md border-t border-slate-800/50 flex" aria-label="Mobile navigation">
      {mobileNavItems.map(({ path, icon: Icon, label, color }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-2 min-h-[56px] text-[10px] font-medium transition-all duration-300 ${
              isActive 
                ? 'text-white' 
                : 'text-slate-500 hover:text-slate-300'
            }`
          }
          aria-label={`Navigate to ${label}`}
        >
          {({ isActive }) => (
            <>
              <div className={`p-2 rounded-xl mb-1 transition-all duration-300 ${
                isActive ? `bg-gradient-to-br ${color} shadow-lg` : 'bg-slate-800'
              }`}>
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

export default function App() {
  const [toast, setToast] = useState(null)
  const { setUserLocation } = useAppStore()

  const showToast = useCallback((message, type = 'error') => {
    setToast({ message, type })
  }, [])

  const dismissToast = useCallback(() => {
    setToast(null)
  }, [])

  // Get user location on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation(pos.coords.latitude, pos.coords.longitude),
        () => {}
      )
    }
  }, [setUserLocation])

  return (
    <>
      {/* Skip-to-content link for screen readers (WCAG AA 2.4.1) */}
      <a href="#main-content" className="skip-link" aria-label="Skip to main content">
        Skip to content
      </a>

      <div className="flex h-screen w-screen overflow-hidden bg-slate-900 text-zinc-100">
        {/* Desktop sidebar */}
        <Sidebar />

        {/* Main area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-16 md:pb-0">
          <Header />

          <main id="main-content" className="flex-1 bg-slate-900 overflow-y-auto p-4 md:p-6" role="main">
            <Routes>
              <Route path="/" element={<ErrorBoundary><OrchestratorChat showToast={showToast} /></ErrorBoundary>} />
              <Route path="/vision" element={<ErrorBoundary><VisionAgent showToast={showToast} /></ErrorBoundary>} />
              <Route path="/communication" element={<ErrorBoundary><CommunicationAgent showToast={showToast} /></ErrorBoundary>} />
              <Route path="/navigation" element={<ErrorBoundary><NavigationAgent showToast={showToast} /></ErrorBoundary>} />
              <Route path="/audit" element={<ErrorBoundary><AuditAgent showToast={showToast} /></ErrorBoundary>} />
            </Routes>
          </main>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav />

      {toast && <Toast message={toast.message} type={toast.type} onDismiss={dismissToast} />}
    </>
  )
}

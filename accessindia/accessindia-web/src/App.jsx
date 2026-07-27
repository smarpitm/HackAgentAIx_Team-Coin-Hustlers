import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Sidebar } from './components/Layout/Sidebar'
import { Header } from './components/Layout/Header'
import { OrchestratorChat } from './components/Agents/OrchestratorChat'
import { VisionAgent } from './components/Agents/VisionAgent'
import { CommunicationAgent } from './components/Agents/CommunicationAgent'
import { NavigationAgent } from './components/Agents/NavigationAgent'
import { AuditAgent } from './components/Agents/AuditAgent'

export default function App() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-900 text-zinc-100">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="flex-1 bg-slate-900">
          <Routes>
            <Route path="/" element={<OrchestratorChat />} />
            <Route path="/vision" element={<VisionAgent />} />
            <Route path="/communication" element={<CommunicationAgent />} />
            <Route path="/navigation" element={<NavigationAgent />} />
            <Route path="/audit" element={<AuditAgent />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

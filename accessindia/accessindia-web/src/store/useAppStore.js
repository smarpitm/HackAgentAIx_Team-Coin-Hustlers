import { create } from 'zustand'

export const useAppStore = create((set) => ({
  activeAgent: 'orchestrator',
  messages: [
    {
      id: 'welcome-1',
      sender: 'agent',
      agent: 'orchestrator',
      text: 'Namaste! Welcome to AccessIndia AI — Multi-Agent Accessibility Platform. How can I help you today? You can type a query, upload an image, or switch to specialized agents.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ],
  isLoading: false,
  userLocation: { latitude: 28.6139, longitude: 77.2090 }, // Default Delhi

  setActiveAgent: (agent) => set({ activeAgent: agent }),
  setLoading: (loading) => set({ isLoading: loading }),
  setUserLocation: (loc) => set({ userLocation: loc }),
  addMessage: (msg) => set((state) => ({
    messages: [...state.messages, {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...msg
    }]
  })),
  clearMessages: () => set({ messages: [] })
}))

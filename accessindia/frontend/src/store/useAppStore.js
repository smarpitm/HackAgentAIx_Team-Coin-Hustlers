import { create } from 'zustand'

const useAppStore = create((set) => ({
  // Active agent
  activeAgent: 'orchestrator',
  setActiveAgent: (agent) => set({ activeAgent: agent }),

  // Messages array: { id, role, agent, content, type, timestamp, metadata }
  messages: [],
  addMessage: (msg) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          ...msg,
        },
      ],
    })),
  clearChat: () => set({ messages: [] }),

  // Loading state
  isLoading: false,
  loadingAgent: null,
  setLoading: (loading, agent = null) =>
    set({ isLoading: loading, loadingAgent: agent }),

  // User location
  userLocation: { lat: 28.6139, lng: 77.2090 },
  setUserLocation: (lat, lng) => set({ userLocation: { lat, lng } }),
}))

export default useAppStore

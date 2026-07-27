import { create } from 'zustand'

const useAppStore = create((set) => ({
  // Active agent state
  activeAgent: null,
  setActiveAgent: (agent) => set({ activeAgent: agent }),

  // Messages for chat
  messages: [],
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  clearMessages: () => set({ messages: [] }),

  // Loading state
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),

  // User location
  userLocation: null,
  setUserLocation: (location) => set({ userLocation: location }),

  // Error handling
  error: null,
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}))

export default useAppStore

import { useCallback } from 'react'

export const useTextToSpeech = () => {
  const speak = useCallback((text) => {
    if (!window.speechSynthesis || !text) return

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-IN'
    utterance.rate = 1.0
    utterance.pitch = 1.0

    window.speechSynthesis.speak(utterance)
  }, [])

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
  }, [])

  return { speak, stop }
}

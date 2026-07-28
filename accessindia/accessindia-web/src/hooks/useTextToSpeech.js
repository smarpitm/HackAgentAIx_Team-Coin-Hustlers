import { useCallback, useState, useEffect } from 'react'

export const useTextToSpeech = () => {
  const [speaking, setSpeaking] = useState(false)

  const speak = useCallback((text) => {
    if (!window.speechSynthesis || !text) return

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-IN'
    utterance.rate = 1.0
    utterance.pitch = 1.0

    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }, [])

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
    }
  }, [])

  return { speak, stop, cancel: stop, speaking }
}

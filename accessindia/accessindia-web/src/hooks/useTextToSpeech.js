import { useState, useEffect, useCallback } from 'react'

export const useTextToSpeech = () => {
  const [speaking, setSpeaking] = useState(false)
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSupported(true)
    }
  }, [])

  const speak = useCallback((text) => {
    if (!supported || !text) return

    window.speechSynthesis.cancel() // stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.lang = 'en-IN'

    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }, [supported])

  const cancel = useCallback(() => {
    if (supported) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
    }
  }, [supported])

  return { speak, cancel, speaking, supported }
}

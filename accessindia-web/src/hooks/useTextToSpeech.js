import { useState, useEffect, useRef } from 'react'

/**
 * useTextToSpeech Hook
 * 
 * Provides text-to-speech functionality using Web Speech Synthesis API.
 * Auto-cancels speech on unmount for cleanup.
 * 
 * @returns {Object} TTS controls
 * @returns {Function} speak - Start TTS playback of text
 * @returns {Function} cancel - Stop current TTS playback
 * @returns {Boolean} speaking - Whether TTS is currently active
 */
const useTextToSpeech = () => {
  const [speaking, setSpeaking] = useState(false)
  const utteranceRef = useRef(null)

  // Initialize speech synthesis
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null

  /**
   * Speak text aloud using TTS
   * @param {String} text - Text to speak
   */
  const speak = (text) => {
    if (!synth || !text) {
      console.warn('Speech synthesis not available or no text provided')
      return
    }

    // Cancel any ongoing speech
    cancel()

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0
    utterance.lang = 'en-IN' // Indian English

    // Try to use Indian English voice if available
    const voices = synth.getVoices()
    const indianVoice = voices.find(voice => 
      voice.lang === 'en-IN' || voice.lang.startsWith('en-')
    )
    if (indianVoice) {
      utterance.voice = indianVoice
    }

    // Event handlers
    utterance.onstart = () => {
      setSpeaking(true)
    }

    utterance.onend = () => {
      setSpeaking(false)
      utteranceRef.current = null
    }

    utterance.onerror = (error) => {
      console.error('TTS error:', error)
      setSpeaking(false)
      utteranceRef.current = null
    }

    utteranceRef.current = utterance
    synth.speak(utterance)
  }

  /**
   * Cancel current speech
   */
  const cancel = () => {
    if (synth) {
      synth.cancel()
      setSpeaking(false)
      utteranceRef.current = null
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (synth) {
        synth.cancel()
      }
    }
  }, [synth])

  // Load voices (needed for some browsers)
  useEffect(() => {
    if (synth) {
      // Some browsers need this event to load voices
      const loadVoices = () => synth.getVoices()
      
      if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = loadVoices
      }
      
      loadVoices()
    }
  }, [synth])

  return {
    speak,
    cancel,
    stop: cancel,
    speaking
  }
}

export { useTextToSpeech }
export default useTextToSpeech
export { useTextToSpeech }

import { useState, useRef, useCallback } from 'react'

export const useSpeechToText = () => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState(null)

  const recognitionRef = useRef(null)

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser.')
      // Fallback demo transcript for unsupported browsers / environment
      setTranscript('Is the main entrance accessible for wheelchairs?')
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.lang = 'en-IN'
      recognition.continuous = true
      recognition.interimResults = true

      recognition.onresult = (event) => {
        let fullTranscript = ''
        for (let i = 0; i < event.results.length; i++) {
          fullTranscript += event.results[i][0].transcript
        }
        setTranscript(fullTranscript)
      }

      recognition.onerror = (event) => {
        const errorKey = event.error
        if (errorKey === 'no-speech') {
          // Ignore transient silence timeout
          return
        }

        const friendlyMessages = {
          'not-allowed': 'Microphone access denied. Please allow microphone permissions in browser settings.',
          'service-not-allowed': 'Speech recognition service blocked by browser.',
          'audio-capture': 'No microphone detected on your device.',
          'network': 'Network error during speech recognition.',
          'aborted': 'Speech input was stopped.',
        }

        const errorMsg = friendlyMessages[errorKey] || `Speech error: ${errorKey}`
        setError(errorMsg)
        setIsListening(false)

        // Demo fallback on permission error
        if (errorKey === 'not-allowed' || errorKey === 'audio-capture') {
          setTranscript('Is the main entrance accessible for wheelchairs?')
        }
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
      recognition.start()
      setIsListening(true)
      setError(null)
      setTranscript('')
    } catch (err) {
      console.error('Speech recognition start failed:', err)
      setError('Failed to start speech recognition. Please try again.')
      setIsListening(false)
    }
  }, [])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (err) {
        // Ignore stop error if already stopped
      }
      recognitionRef.current = null
    }
    setIsListening(false)
  }, [])

  return { isListening, transcript, error, startListening, stopListening }
}

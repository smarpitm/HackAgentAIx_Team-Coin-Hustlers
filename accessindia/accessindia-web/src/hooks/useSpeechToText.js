import { useState, useRef, useCallback, useEffect } from 'react'

const DEMO_VOICE_SAMPLES = [
  'Is the main entrance accessible for wheelchairs?',
  'Find nearby accessible hospital with ramp entrance',
  'Read the text on this signboard for me',
  'Audit the entrance ramp slope and handrail compliance',
]

export const useSpeechToText = () => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState(null)

  const recognitionRef = useRef(null)
  const errorTimerRef = useRef(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Auto dismiss error after 3.5 seconds
  useEffect(() => {
    if (error) {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current)
      errorTimerRef.current = setTimeout(() => {
        setError(null)
      }, 3500)
    }
    return () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current)
    }
  }, [error])

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const sampleQuery = DEMO_VOICE_SAMPLES[Math.floor(Math.random() * DEMO_VOICE_SAMPLES.length)]

    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser.')
      setTranscript(sampleQuery)
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
          return
        }

        const friendlyMessages = {
          'not-allowed': 'Mic access blocked — loaded sample voice query.',
          'service-not-allowed': 'Speech service blocked — loaded sample voice query.',
          'audio-capture': 'No mic detected — loaded sample voice query.',
          'network': 'Speech network offline — loaded sample voice query.',
          'aborted': 'Speech input stopped.',
        }

        const errorMsg = friendlyMessages[errorKey] || `Speech error: ${errorKey}`
        setError(errorMsg)
        setIsListening(false)

        if (['not-allowed', 'audio-capture', 'network', 'service-not-allowed'].includes(errorKey)) {
          setTranscript(sampleQuery)
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
      setError('Speech service unavailable — loaded sample voice query.')
      setTranscript(sampleQuery)
      setIsListening(false)
    }
  }, [])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (err) {
        // Ignore stop error
      }
      recognitionRef.current = null
    }
    setIsListening(false)
  }, [])

  return { isListening, transcript, error, clearError, startListening, stopListening }
}

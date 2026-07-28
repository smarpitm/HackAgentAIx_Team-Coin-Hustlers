import { useState, useRef, useCallback } from 'react'

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
          // Ignore transient silence timeout
          return
        }

        const friendlyMessages = {
          'not-allowed': 'Microphone access denied in browser settings. Loaded demo voice input.',
          'service-not-allowed': 'Speech recognition service blocked by browser. Loaded demo voice input.',
          'audio-capture': 'No microphone detected on your device. Loaded demo voice input.',
          'network': 'Google speech service network unreachable. Loaded demo voice input.',
          'aborted': 'Speech input was stopped.',
        }

        const errorMsg = friendlyMessages[errorKey] || `Speech error: ${errorKey}`
        setError(errorMsg)
        setIsListening(false)

        // Automatically set sample transcript when cloud speech API is blocked or errored
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
      setError('Failed to start speech recognition. Loaded demo voice input.')
      setTranscript(sampleQuery)
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

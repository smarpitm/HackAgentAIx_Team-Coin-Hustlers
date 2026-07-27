import { useState, useEffect, useRef, useCallback } from 'react'

export const useSpeechToText = (options = {}) => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState(null)

  const recognitionRef = useRef(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError('Web Speech API is not supported in this browser.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = options.continuous ?? true
    recognition.interimResults = options.interimResults ?? true
    recognition.lang = options.lang ?? 'en-IN'

    recognition.onresult = (event) => {
      let currentTranscript = ''
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript
      }
      setTranscript(currentTranscript)
    }

    recognition.onerror = (event) => {
      logger_error(event.error)
      setError(event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
  }, [options.continuous, options.interimResults, options.lang])

  const start = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        setTranscript('')
        setError(null)
        recognitionRef.current.start()
        setIsListening(true)
      } catch (err) {
        console.error('Speech recognition start error:', err)
      }
    }
  }, [isListening])

  const stop = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }, [isListening])

  const reset = useCallback(() => {
    setTranscript('')
  }, [])

  function logger_error(err) {
    console.error('WebSpeech Error:', err)
  }

  return { transcript, isListening, error, start, stop, reset }
}

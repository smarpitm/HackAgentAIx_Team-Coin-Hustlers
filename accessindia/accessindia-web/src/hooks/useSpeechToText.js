import { useState, useRef, useCallback, useEffect } from 'react'
import { speechAPI } from '../services/api'

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
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const streamRef = useRef(null)
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

  const startListening = useCallback(async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const sampleQuery = DEMO_VOICE_SAMPLES[Math.floor(Math.random() * DEMO_VOICE_SAMPLES.length)]

    audioChunksRef.current = []

    // Start local MediaRecorder microphone stream to capture real voice audio
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        streamRef.current = stream

        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data)
          }
        }

        mediaRecorder.start(200)
      }
    } catch (micErr) {
      console.warn('Microphone stream access warning:', micErr)
    }

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
          'network': 'Speech network offline — using local mic audio capture.',
          'aborted': 'Speech input stopped.',
        }

        const errorMsg = friendlyMessages[errorKey] || `Speech error: ${errorKey}`
        setError(errorMsg)

        if (['not-allowed', 'audio-capture', 'service-not-allowed'].includes(errorKey)) {
          setIsListening(false)
          setTranscript(sampleQuery)
        }
      }

      recognition.onend = () => {
        if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
          setIsListening(false)
        }
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

  const stopListening = useCallback(async () => {
    // Stop Web Speech API
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (err) {
        // Ignore
      }
      recognitionRef.current = null
    }

    // Stop MediaRecorder and process recorded audio if Web Speech didn't return text
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop()
      } catch (err) {
        // Ignore
      }
    }

    // Close microphone track
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    setIsListening(false)

    // If Web Speech didn't output text, send recorded audio blob to backend Gemini STT endpoint
    setTimeout(async () => {
      if (audioChunksRef.current.length > 0 && !transcript) {
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
          if (audioBlob.size > 500) {
            const data = await speechAPI.transcribeAudio(audioBlob)
            if (data?.transcript) {
              setTranscript(data.transcript)
            }
          }
        } catch (sttErr) {
          console.warn('Backend audio transcription fallback notice:', sttErr)
          if (!transcript) {
            const sampleQuery = DEMO_VOICE_SAMPLES[Math.floor(Math.random() * DEMO_VOICE_SAMPLES.length)]
            setTranscript(sampleQuery)
          }
        }
      }
    }, 300)
  }, [transcript])

  return { isListening, transcript, error, clearError, startListening, stopListening }
}

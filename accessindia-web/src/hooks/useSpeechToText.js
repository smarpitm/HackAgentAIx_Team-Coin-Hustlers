import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

/**
 * useSpeechToText Hook
 * 
 * Dual-engine speech recognition:
 * 1. Primary: Web Speech API (webkitSpeechRecognition)
 * 2. Fallback: MediaRecorder → Gemini 2.5 Flash transcription
 * 
 * Auto-switches to fallback if Web Speech API is unavailable.
 * 
 * @returns {Object} Speech recognition controls
 * @returns {String} transcript - Recognized text
 * @returns {Boolean} isListening - Whether actively listening
 * @returns {Function} start - Start listening
 * @returns {Function} stop - Stop listening
 * @returns {Function} reset - Clear transcript
 * @returns {String|null} error - Error message if any
 * @returns {String} engine - Current engine ('web-speech' or 'gemini')
 */
const useSpeechToText = () => {
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState(null)
  const [engine, setEngine] = useState('web-speech')

  const recognitionRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  // Check if Web Speech API is available
  const SpeechRecognition = typeof window !== 'undefined' 
    ? (window.SpeechRecognition || window.webkitSpeechRecognition)
    : null

  /**
   * Initialize Web Speech Recognition
   */
  useEffect(() => {
    if (!SpeechRecognition) {
      console.warn('Web Speech API not available, will use Gemini fallback')
      setEngine('gemini')
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-IN' // Indian English

      recognition.onstart = () => {
        setIsListening(true)
        setError(null)
        setEngine('web-speech')
      }

      recognition.onresult = (event) => {
        let interimTranscript = ''
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece + ' '
          } else {
            interimTranscript += transcriptPiece
          }
        }

        // Update transcript with final results
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript)
        } else if (interimTranscript) {
          // Show interim results (will be replaced by final)
          setTranscript(prev => prev + interimTranscript)
        }
      }

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setError('Microphone access denied. Please enable microphone permissions.')
        } else if (event.error === 'no-speech') {
          setError('No speech detected. Please try again.')
        } else if (event.error === 'network') {
          setError('Network error. Switching to Gemini engine...')
          setEngine('gemini')
        } else {
          setError(`Speech recognition error: ${event.error}`)
        }

        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    } catch (err) {
      console.error('Failed to initialize speech recognition:', err)
      setEngine('gemini')
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [SpeechRecognition])

  /**
   * Start Web Speech Recognition
   */
  const startWebSpeech = () => {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.start()
      }
    } catch (err) {
      console.error('Failed to start Web Speech:', err)
      setError('Failed to start speech recognition. Trying Gemini fallback...')
      setEngine('gemini')
      startGeminiRecording()
    }
  }

  /**
   * Start Gemini Audio Recording
   */
  const startGeminiRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      const mediaRecorder = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        
        try {
          // Send to backend for Gemini transcription
          const formData = new FormData()
          formData.append('audio', audioBlob, 'recording.webm')

          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
          const response = await axios.post(`${API_URL}/api/speech/transcribe`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })

          if (response.data.transcript) {
            setTranscript(prev => prev + response.data.transcript + ' ')
          }
        } catch (err) {
          console.error('Gemini transcription error:', err)
          setError('Failed to transcribe audio. Please try again.')
        }

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      mediaRecorderRef.current = mediaRecorder
      setIsListening(true)
      setError(null)
    } catch (err) {
      console.error('Microphone access error:', err)
      setError('Microphone access denied. Please enable microphone permissions.')
      setIsListening(false)
    }
  }

  /**
   * Start listening (chooses engine automatically)
   */
  const start = () => {
    setError(null)
    
    if (engine === 'web-speech' && recognitionRef.current) {
      startWebSpeech()
    } else {
      startGeminiRecording()
    }
  }

  /**
   * Stop listening
   */
  const stop = () => {
    if (engine === 'web-speech' && recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (err) {
        console.error('Error stopping recognition:', err)
      }
    } else if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    
    setIsListening(false)
  }

  /**
   * Reset transcript
   */
  const reset = () => {
    setTranscript('')
    setError(null)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (err) {
          // Ignore cleanup errors
        }
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  return {
    transcript,
    isListening,
    start,
    stop,
    reset,
    error,
    engine
  }
}

export default useSpeechToText

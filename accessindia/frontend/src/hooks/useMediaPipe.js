import { useEffect, useState, useRef } from 'react'

export const useMediaPipe = (videoRef, onResults) => {
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState(null)

  const handsRef = useRef(null)

  useEffect(() => {
    if (!window.Hands) {
      setError('MediaPipe Hands is not loaded. Check CDN scripts in index.html.')
      return
    }

    try {
      const hands = new window.Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      })

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      })

      hands.onResults((results) => {
        if (onResults) {
          onResults(results)
        }
      })

      handsRef.current = hands
      setIsInitialized(true)
    } catch (err) {
      setError(err.message || 'Failed to initialize MediaPipe Hands.')
    }

    return () => {
      if (handsRef.current) {
        handsRef.current = null
      }
    }
  }, [onResults])

  return { isInitialized, error }
}

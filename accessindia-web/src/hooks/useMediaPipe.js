import { useState, useEffect, useRef } from 'react'

/**
 * useMediaPipe Hook
 * 
 * Initializes MediaPipe Hands for hand landmark detection.
 * Processes video frames and returns detected hand landmarks.
 * 
 * Requires MediaPipe Hands CDN scripts to be loaded in index.html.
 * 
 * @param {React.RefObject} videoRef - Reference to video element
 * @param {Object} options - Configuration options
 * @param {Number} options.maxHands - Maximum number of hands to detect (default: 2)
 * @param {Number} options.minDetectionConfidence - Minimum detection confidence (default: 0.5)
 * @param {Number} options.minTrackingConfidence - Minimum tracking confidence (default: 0.5)
 * 
 * @returns {Object} MediaPipe state
 * @returns {Array} hands - Array of detected hands (each hand has 21 landmarks)
 * @returns {Boolean} isReady - Whether MediaPipe is initialized
 * @returns {String|null} error - Error message if initialization failed
 * @returns {Function} drawLandmarks - Function to draw landmarks on canvas
 */
const useMediaPipe = (videoRef, options = {}) => {
  const [hands, setHands] = useState([])
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState(null)

  const handsRef = useRef(null)
  const cameraRef = useRef(null)

  const {
    maxHands = 2,
    minDetectionConfidence = 0.5,
    minTrackingConfidence = 0.5
  } = options

  /**
   * Initialize MediaPipe Hands
   */
  useEffect(() => {
    // Check if MediaPipe is loaded
    if (typeof window === 'undefined' || !window.Hands) {
      setError('MediaPipe Hands not loaded. Please ensure CDN scripts are included in index.html')
      return
    }

    try {
      const { Hands, HAND_CONNECTIONS } = window

      // Create Hands instance
      const handsInstance = new Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${file}`
        }
      })

      // Configure Hands
      handsInstance.setOptions({
        maxNumHands: maxHands,
        modelComplexity: 1,
        minDetectionConfidence: minDetectionConfidence,
        minTrackingConfidence: minTrackingConfidence
      })

      // Result callback
      handsInstance.onResults((results) => {
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          setHands(results.multiHandLandmarks)
        } else {
          setHands([])
        }
      })

      handsRef.current = handsInstance
      setIsReady(true)
      setError(null)
    } catch (err) {
      console.error('MediaPipe initialization error:', err)
      setError('Failed to initialize MediaPipe Hands')
      setIsReady(false)
    }

    return () => {
      // Cleanup
      if (handsRef.current) {
        handsRef.current.close()
      }
      if (cameraRef.current) {
        cameraRef.current.stop()
      }
    }
  }, [maxHands, minDetectionConfidence, minTrackingConfidence])

  /**
   * Start processing video frames
   */
  useEffect(() => {
    if (!isReady || !handsRef.current || !videoRef?.current) {
      return
    }

    try {
      const { Camera } = window

      if (!Camera) {
        setError('MediaPipe Camera utility not loaded')
        return
      }

      // Create camera instance
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (handsRef.current && videoRef.current) {
            await handsRef.current.send({ image: videoRef.current })
          }
        },
        width: 640,
        height: 480
      })

      cameraRef.current = camera
      camera.start()
    } catch (err) {
      console.error('Camera initialization error:', err)
      setError('Failed to start camera processing')
    }

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop()
      }
    }
  }, [isReady, videoRef])

  /**
   * Draw hand landmarks on canvas
   * 
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
   * @param {Number} width - Canvas width
   * @param {Number} height - Canvas height
   */
  const drawLandmarks = (ctx, width, height) => {
    if (!ctx || hands.length === 0) return

    ctx.clearRect(0, 0, width, height)

    hands.forEach((handLandmarks) => {
      // Draw connections (lines between landmarks)
      if (window.HAND_CONNECTIONS) {
        ctx.strokeStyle = '#00FF00'
        ctx.lineWidth = 2

        window.HAND_CONNECTIONS.forEach(([startIdx, endIdx]) => {
          const start = handLandmarks[startIdx]
          const end = handLandmarks[endIdx]

          if (start && end) {
            ctx.beginPath()
            ctx.moveTo(start.x * width, start.y * height)
            ctx.lineTo(end.x * width, end.y * height)
            ctx.stroke()
          }
        })
      }

      // Draw landmark points
      handLandmarks.forEach((landmark, idx) => {
        const x = landmark.x * width
        const y = landmark.y * height

        // Fingertips (4, 8, 12, 16, 20) - larger and orange
        if ([4, 8, 12, 16, 20].includes(idx)) {
          ctx.fillStyle = '#FF6B00'
          ctx.beginPath()
          ctx.arc(x, y, 6, 0, 2 * Math.PI)
          ctx.fill()
        } else {
          // Other landmarks - smaller and green
          ctx.fillStyle = '#00FF00'
          ctx.beginPath()
          ctx.arc(x, y, 4, 0, 2 * Math.PI)
          ctx.fill()
        }
      })
    })
  }

  return {
    hands,
    isReady,
    error,
    drawLandmarks
  }
}

export { useMediaPipe }
export default useMediaPipe

import { useEffect, useRef, useState, useCallback } from 'react'

export const useMediaPipe = (videoRef, canvasRef) => {
  const [landmarks, setLandmarks] = useState(null)
  const [isReady, setIsReady] = useState(false)
  const cameraRef = useRef(null)

  useEffect(() => {
    let handsInstance = null

    const initMediaPipe = async () => {
      if (window.Hands) {
        handsInstance = new window.Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        })

        handsInstance.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        })

        handsInstance.onResults((results) => {
          if (canvasRef.current && results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const canvasCtx = canvasRef.current.getContext('2d')
            const width = canvasRef.current.width
            const height = canvasRef.current.height

            canvasCtx.save()
            canvasCtx.clearRect(0, 0, width, height)

            const hand = results.multiHandLandmarks[0]
            setLandmarks(hand)

            // Draw connections & landmarks
            if (window.drawConnectors && window.HAND_CONNECTIONS) {
              window.drawConnectors(canvasCtx, hand, window.HAND_CONNECTIONS, { color: '#f97316', lineWidth: 3 })
            }
            if (window.drawLandmarks) {
              window.drawLandmarks(canvasCtx, hand, { color: '#38bdf8', lineWidth: 2, radius: 4 })
            }

            canvasCtx.restore()
          } else {
            setLandmarks(null)
          }
        })

        setIsReady(true)
      } else {
        setTimeout(initMediaPipe, 500)
      }
    }

    initMediaPipe()
  }, [canvasRef])

  const startCamera = useCallback(() => {
    if (videoRef.current && window.Camera) {
      const camera = new window.Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current) {
            // Process frame
          }
        },
        width: 640,
        height: 480
      })
      cameraRef.current = camera
      camera.start()
    }
  }, [videoRef])

  const stopCamera = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.stop()
    }
  }, [])

  return { landmarks, isReady, startCamera, stopCamera }
}

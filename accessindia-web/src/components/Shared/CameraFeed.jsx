import React, { useRef, useEffect, useState } from 'react'
import { Video, VideoOff, Camera as CameraIcon } from 'lucide-react'
import useMediaPipe from '../../hooks/useMediaPipe'
import { classifyGesture, getGestureEmoji, getGestureLabel } from '../../utils/gestureClassifier'

/**
 * CameraFeed Component
 * 
 * Webcam video feed with MediaPipe hand tracking overlay.
 * Displays detected hand landmarks and classified gestures.
 * 
 * @param {Function} onGestureDetected - Callback when gesture is detected: (gesture) => void
 * @param {Boolean} showGestureLabel - Whether to show gesture label on feed (default: true)
 * @param {String} className - Additional CSS classes
 */
const CameraFeed = ({ 
  onGestureDetected,
  showGestureLabel = true,
  className = "" 
}) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [isActive, setIsActive] = useState(false)
  const [cameraError, setCameraError] = useState(null)
  const [currentGesture, setCurrentGesture] = useState('unknown')
  const [gestureConfidence, setGestureConfidence] = useState(0)

  const { hands, isReady, error: mediaPipeError, drawLandmarks } = useMediaPipe(videoRef, {
    maxHands: 2,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7
  })

  /**
   * Start camera
   */
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setIsActive(true)
        setCameraError(null)
      }
    } catch (err) {
      console.error('Camera access error:', err)
      setCameraError('Camera access denied. Please enable camera permissions.')
      setIsActive(false)
    }
  }

  /**
   * Stop camera
   */
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    setIsActive(false)
    setCurrentGesture('unknown')
    setGestureConfidence(0)
  }

  /**
   * Toggle camera on/off
   */
  const toggleCamera = () => {
    if (isActive) {
      stopCamera()
    } else {
      startCamera()
    }
  }

  /**
   * Draw hand landmarks on canvas overlay
   */
  useEffect(() => {
    if (!canvasRef.current || !isActive || hands.length === 0) {
      return
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // Match canvas size to video size
    if (videoRef.current) {
      canvas.width = videoRef.current.videoWidth || 640
      canvas.height = videoRef.current.videoHeight || 480
    }

    // Draw landmarks
    drawLandmarks(ctx, canvas.width, canvas.height)

    // Classify gesture from first hand
    if (hands[0]) {
      const gesture = classifyGesture(hands[0])
      
      if (gesture !== 'unknown') {
        setCurrentGesture(gesture)
        setGestureConfidence(prev => Math.min(prev + 0.1, 1.0)) // Increase confidence
        
        // Callback
        if (onGestureDetected) {
          onGestureDetected(gesture)
        }
      } else {
        setGestureConfidence(prev => Math.max(prev - 0.05, 0)) // Decrease confidence
      }
    }
  }, [hands, isActive, drawLandmarks, onGestureDetected])

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className={`relative ${className}`}>
      {/* Video and Canvas Container */}
      <div className="relative bg-slate-800 rounded-lg overflow-hidden aspect-video max-w-2xl mx-auto">
        {/* Video element */}
        <video
          ref={videoRef}
          className={`w-full h-full object-cover ${!isActive ? 'hidden' : ''}`}
          playsInline
          muted
          aria-label="Camera feed"
        />

        {/* Canvas overlay for landmarks */}
        <canvas
          ref={canvasRef}
          className={`absolute top-0 left-0 w-full h-full ${!isActive ? 'hidden' : ''}`}
          aria-hidden="true"
        />

        {/* Inactive state */}
        {!isActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-zinc-400">
            <CameraIcon size={64} aria-hidden="true" />
            <p className="text-lg">Camera is off</p>
          </div>
        )}

        {/* Gesture label overlay */}
        {showGestureLabel && isActive && currentGesture !== 'unknown' && gestureConfidence > 0.5 && (
          <div 
            className="absolute top-4 left-4 bg-slate-900/90 px-4 py-2 rounded-lg border border-orange-500"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl" aria-hidden="true">
                {getGestureEmoji(currentGesture)}
              </span>
              <div>
                <p className="text-white font-semibold">
                  {getGestureLabel(currentGesture)}
                </p>
                <div className="w-24 h-1 bg-slate-700 rounded-full mt-1">
                  <div 
                    className="h-full bg-orange-500 rounded-full transition-all duration-300"
                    style={{ width: `${gestureConfidence * 100}%` }}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MediaPipe status */}
        {!isReady && isActive && (
          <div className="absolute bottom-4 right-4 bg-slate-900/90 px-3 py-2 rounded-lg text-xs text-zinc-400">
            Initializing hand tracking...
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-4 flex justify-center gap-3">
        <button
          onClick={toggleCamera}
          aria-label={isActive ? "Stop camera" : "Start camera"}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg font-medium
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900
            ${isActive 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-orange-500 hover:bg-orange-600 text-white'
            }
          `}
        >
          {isActive ? (
            <>
              <VideoOff size={20} aria-hidden="true" />
              <span>Stop Camera</span>
            </>
          ) : (
            <>
              <Video size={20} aria-hidden="true" />
              <span>Start Camera</span>
            </>
          )}
        </button>
      </div>

      {/* Error messages */}
      {(cameraError || mediaPipeError) && (
        <div 
          role="alert"
          className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400"
        >
          <p className="font-medium mb-1">Error</p>
          <p className="text-sm">{cameraError || mediaPipeError}</p>
        </div>
      )}

      {/* Instructions */}
      {isActive && !cameraError && !mediaPipeError && (
        <div className="mt-4 p-4 bg-slate-800 rounded-lg">
          <p className="text-zinc-300 text-sm mb-2">
            <strong>Supported Gestures:</strong>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            {['hello', 'help', 'yes', 'no', 'thank_you', 'eat', 'drink', 'stop', 'go', 'bathroom'].map(gesture => (
              <div key={gesture} className="flex items-center gap-2 text-zinc-400">
                <span className="text-lg">{getGestureEmoji(gesture)}</span>
                <span>{getGestureLabel(gesture)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export { CameraFeed }

import React, { useRef, useState, useEffect } from 'react'
import { Camera, CameraOff, Video, RefreshCw } from 'lucide-react'
import { useMediaPipe } from '../../hooks/useMediaPipe'

export function CameraFeed({ onLandmarksDetected }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [isActive, setIsActive] = useState(false)
  const [streamError, setStreamError] = useState(null)

  const { landmarks, startCamera, stopCamera } = useMediaPipe(videoRef, canvasRef)

  useEffect(() => {
    if (landmarks && onLandmarksDetected) {
      onLandmarksDetected(landmarks)
    }
  }, [landmarks, onLandmarksDetected])

  const handleToggleCamera = async () => {
    if (isActive) {
      stopCamera()
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks()
        tracks.forEach((track) => track.stop())
        videoRef.current.srcObject = null
      }
      setIsActive(false)
    } else {
      setStreamError(null)
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' },
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }
        setIsActive(true)
        startCamera()
      } catch (err) {
        console.error('Camera access error:', err)
        setStreamError('Unable to access webcam. Please check permissions.')
      }
    }
  }

  return (
    <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex flex-col items-center justify-center min-h-[380px]">
      {/* Video & Canvas Overlay */}
      <div className="relative w-full h-full flex items-center justify-center bg-slate-900/90">
        <video
          ref={videoRef}
          className={`w-full max-h-[400px] object-cover ${isActive ? 'block' : 'hidden'}`}
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className={`absolute top-0 left-0 w-full h-full pointer-events-none ${isActive ? 'block' : 'hidden'}`}
        />

        {!isActive && (
          <div className="text-center p-6 space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
              <Video className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">MediaPipe Gesture Camera Feed</h4>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Activate webcam to enable real-time 21-point hand landmark tracking and Indian Sign Language classification.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Stream Error Alert */}
      {streamError && (
        <div className="absolute top-4 left-4 right-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl text-xs text-center">
          {streamError}
        </div>
      )}

      {/* Controls Bar */}
      <div className="p-4 bg-slate-900/90 border-t border-slate-800 w-full flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs">
          <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></span>
          <span className="text-slate-300 font-medium">{isActive ? 'Live Stream Active' : 'Camera Standby'}</span>
        </div>

        <button
          onClick={handleToggleCamera}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
            isActive
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20'
              : 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20'
          }`}
        >
          {isActive ? (
            <>
              <CameraOff className="w-4 h-4" />
              <span>Stop Camera</span>
            </>
          ) : (
            <>
              <Camera className="w-4 h-4" />
              <span>Start Sign Language Camera</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

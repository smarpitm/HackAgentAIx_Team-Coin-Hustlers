import React, { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

/**
 * FileDrop Component
 * 
 * Drag-and-drop + click file upload with image preview.
 * Supports JPEG and PNG images up to 4MB.
 * 
 * @param {Function} onFileSelected - Callback when file is selected: (file) => void
 * @param {String} title - Title text for empty state
 * @param {String} description - Description text for empty state
 * @param {String} acceptedTypes - Accepted MIME types (default: "image/jpeg,image/png")
 * @param {Number} maxSizeMB - Maximum file size in MB (default: 4)
 * @param {String} className - Additional CSS classes
 */
const FileDrop = ({ 
  onFileSelected,
  title = "Drag and drop image here",
  description = "or click to browse",
  acceptedTypes = "image/jpeg,image/png",
  maxSizeMB = 4,
  className = "" 
}) => {
  const [preview, setPreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState(null)
  const [fileName, setFileName] = useState(null)
  const fileInputRef = useRef(null)

  const maxSizeBytes = maxSizeMB * 1024 * 1024

  /**
   * Validate and process file
   */
  const processFile = (file) => {
    // Reset error
    setError(null)

    // Validate file type
    if (!acceptedTypes.split(',').includes(file.type)) {
      setError(`Invalid file type. Please upload ${acceptedTypes.replace(/image\//g, '').toUpperCase()} images only.`)
      return
    }

    // Validate file size
    if (file.size > maxSizeBytes) {
      setError(`File size exceeds ${maxSizeMB}MB limit. Please upload a smaller image.`)
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
      setFileName(file.name)
      if (onFileSelected) {
        onFileSelected(file)
      }
    }
    reader.readAsDataURL(file)
  }

  /**
   * Handle file input change
   */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  /**
   * Handle drag events
   */
  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  /**
   * Handle click to browse
   */
  const handleClick = () => {
    fileInputRef.current?.click()
  }

  /**
   * Handle keyboard interaction
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  /**
   * Clear selection
   */
  const handleClear = (e) => {
    e.stopPropagation()
    setPreview(null)
    setFileName(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (onFileSelected) {
      onFileSelected(null)
    }
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Drop zone */}
      <div
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        tabIndex={0}
        role="button"
        aria-label={preview ? "Change image" : "Upload image"}
        className={`
          relative overflow-hidden rounded-2xl p-8 transition-all duration-300 cursor-pointer group
          focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-950
          ${isDragging 
            ? 'bg-gradient-to-b from-cyan-950/40 via-amber-950/30 to-slate-950/80 shadow-2xl shadow-cyan-500/20 border-cyan-400/60' 
            : 'liquid-glass hover:border-amber-400/50 hover:shadow-xl hover:shadow-amber-500/10'
          }
        `}
      >
        {/* SVG Running Dashed Border Loop */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none rounded-2xl"
          aria-hidden="true"
        >
          <rect 
            x="2" 
            y="2" 
            width="calc(100% - 4px)" 
            height="calc(100% - 4px)" 
            rx="14" 
            fill="none" 
            stroke={isDragging ? '#06b6d4' : 'rgba(255, 184, 0, 0.35)'} 
            strokeWidth="2" 
            className="animate-dash-loop"
          />
        </svg>

        {/* Hover / Drag Laser Grid Line Sweeping Overlay */}
        {(isDragging || true) && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
            {/* Sweeping Laser Line */}
            <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06b6d4] animate-laser-sweep" />
          </div>
        )}

        {preview ? (
          // Preview state
          <div className="relative z-10">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-auto max-h-96 object-contain rounded-xl border border-slate-700/60 shadow-lg"
            />
            
            {/* Clear button */}
            <button
              onClick={handleClear}
              aria-label="Remove image"
              className="
                absolute top-3 right-3 p-2.5
                bg-rose-500/90 hover:bg-rose-600 text-white rounded-full
                transition-all duration-200 shadow-lg hover:scale-105
                focus:outline-none focus:ring-2 focus:ring-rose-400
              "
            >
              <X size={18} aria-hidden="true" />
            </button>

            {/* File name */}
            {fileName && (
              <div className="mt-3 text-xs text-amber-300 font-display font-medium text-center truncate tracking-wide">
                {fileName}
              </div>
            )}
          </div>
        ) : (
          // Empty state with 3D Sine Wave Floating Icon
          <div className="relative z-10 flex flex-col items-center justify-center py-4 gap-4 text-center">
            <div className="amber-glass-chip p-4 rounded-2xl shadow-xl animate-sine-float border border-amber-400/40">
              {isDragging ? (
                <ImageIcon size={44} className="text-cyan-400 animate-pulse" aria-hidden="true" />
              ) : (
                <Upload size={44} className="text-amber-400" aria-hidden="true" />
              )}
            </div>
            
            <div>
              <p className="text-white font-display font-bold text-base mb-1 tracking-tight">
                {isDragging ? 'Release to drop building image' : title}
              </p>
              <p className="text-slate-400 text-xs font-sans">
                {description}
              </p>
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/80 px-3 py-1 rounded-full bg-slate-900/60 border border-amber-500/20">
              JPEG or PNG • Max {maxSizeMB}MB
            </span>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes}
          onChange={handleFileChange}
          className="hidden"
          aria-hidden="true"
        />
      </div>

      {/* Error message */}
      {error && (
        <div 
          role="alert"
          className="mt-3 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2"
        >
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

export { FileDrop }
export default FileDrop


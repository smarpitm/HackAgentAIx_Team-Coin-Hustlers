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
          relative border-2 border-dashed rounded-lg p-8
          transition-all duration-200 cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900
          ${isDragging 
            ? 'border-orange-500 bg-orange-500/10' 
            : 'border-slate-600 hover:border-orange-500 hover:bg-slate-800/50'
          }
          ${preview ? 'border-solid' : ''}
        `}
      >
        {preview ? (
          // Preview state
          <div className="relative">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-auto max-h-96 object-contain rounded-lg"
            />
            
            {/* Clear button */}
            <button
              onClick={handleClear}
              aria-label="Remove image"
              className="
                absolute top-2 right-2 p-2
                bg-red-500 hover:bg-red-600 text-white rounded-full
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900
              "
            >
              <X size={20} aria-hidden="true" />
            </button>

            {/* File name */}
            {fileName && (
              <div className="mt-3 text-sm text-zinc-400 text-center truncate">
                {fileName}
              </div>
            )}
          </div>
        ) : (
          // Empty state
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            {isDragging ? (
              <ImageIcon size={48} className="text-orange-500 animate-bounce" aria-hidden="true" />
            ) : (
              <Upload size={48} className="text-zinc-400" aria-hidden="true" />
            )}
            
            <div>
              <p className="text-zinc-300 font-medium mb-1">
                {isDragging ? 'Drop image here' : title}
              </p>
              <p className="text-zinc-500 text-sm">
                {description}
              </p>
            </div>

            <p className="text-xs text-zinc-500">
              JPEG or PNG • Max {maxSizeMB}MB
            </p>
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
          className="mt-3 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-sm"
        >
          {error}
        </div>
      )}
    </div>
  )
}

export { FileDrop }
export default FileDrop

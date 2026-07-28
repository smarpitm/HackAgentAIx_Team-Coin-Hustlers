import React, { useState, useRef } from 'react'
import { UploadCloud, X, CheckCircle2 } from 'lucide-react'

export function FileDrop({ onFileSelected, accept = 'image/*', title = 'Upload Image for Analysis', description = 'Drag & drop or click to upload JPEG/PNG' }) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)
  const dropRef = useRef(null)

  const handleFileChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => { setPreview(reader.result) }
      reader.readAsDataURL(file)
      if (onFileSelected) onFileSelected(file)
    }
  }

  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files?.[0]) handleFileChange(e.dataTransfer.files[0]) }
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = () => setIsDragging(false)

  const clearFile = (e) => { e.stopPropagation(); setPreview(null); setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; if (onFileSelected) onFileSelected(null) }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      fileInputRef.current?.click()
    }
  }

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
        accept={accept}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      />

      {preview ? (
        <div className="relative group rounded-2xl overflow-hidden border-2 border-orange-500/50 bg-slate-800/80 p-2 transition-all duration-300 hover:border-orange-500/70 hover:shadow-lg hover:shadow-orange-500/10">
          <img src={preview} alt={`Preview of ${selectedFile?.name || 'uploaded image'}`} className="w-full h-40 md:h-56 object-cover rounded-xl" />
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={clearFile}
              className="touch-target bg-slate-900/80 hover:bg-rose-600 text-white p-2 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 flex items-center justify-center shadow-lg"
              aria-label="Remove uploaded image"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-3 px-3 pb-2 flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5 font-medium text-orange-400 truncate">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" aria-hidden="true" />
              <span className="truncate">{selectedFile?.name}</span>
            </span>
            <span className="text-slate-400 flex-shrink-0">{(selectedFile?.size / 1024).toFixed(1)} KB</span>
          </div>
        </div>
      ) : (
        <div
          ref={dropRef}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={handleKeyDown}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          role="button"
          tabIndex={0}
          aria-label={`${title}. ${description}. Press Enter to select a file.`}
          className={`border-2 border-dashed rounded-2xl p-6 md:p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center active:scale-[0.98] ${
            isDragging
              ? 'border-orange-500 bg-orange-500/10 scale-[1.02] shadow-lg shadow-orange-500/20'
              : 'border-slate-700 bg-slate-800/40 hover:border-slate-500 hover:bg-slate-800/80 hover:shadow-md'
          }`}
        >
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-orange-500/10 to-amber-400/10 border border-orange-500/20 flex items-center justify-center mb-3 text-orange-400 group-hover:scale-110 transition-transform duration-300">
            <UploadCloud className="w-6 md:w-7 h-6 md:h-7" aria-hidden="true" />
          </div>
          <h3 className="text-sm font-semibold text-slate-200 mb-1">{title}</h3>
          <p className="text-xs text-slate-400 max-w-xs">{description}</p>
        </div>
      )}
    </div>
  )
}

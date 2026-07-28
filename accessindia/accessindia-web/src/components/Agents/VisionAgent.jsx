import React, { useState } from 'react'
import { Eye, FileText, Sparkles, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { visionAPI } from '../../services/api'
import { FileDrop } from '../Shared/FileDrop'
import { TTSButton } from '../Shared/TTSButton'
import { VISION_FALLBACK } from '../../data/fallbacks'

export function VisionAgent({ showToast }) {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(null)

  const handleFile = async (file) => {
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setResult(null)
    setError(null)
    setLoading(true)

    try {
      const data = await visionAPI.analyzeImage(file)
      setResult({ ...data, _fallback: false })
    } catch (err) {
      setResult(VISION_FALLBACK)
      if (showToast) showToast('Vision API unavailable — using demo data', 'success')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-5xl mx-auto space-y-4 md:space-y-6" aria-label="Vision Agent">
      {/* Header */}
      <div className="agent-card p-4 md:p-6 flex items-center gap-3 md:gap-4 animate-fade-in">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-400/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0 shadow-lg shadow-cyan-500/10">
          <Eye className="w-5 md:w-6 h-5 md:h-6" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base md:text-lg font-bold text-white">Vision Agent</h2>
          <p className="text-[11px] md:text-xs text-slate-400">Extract OCR text, scene descriptions, and detect objects using Gemini Vision.</p>
        </div>
        {result?._fallback && <span className="demo-badge flex-shrink-0">Demo</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Left: Upload */}
        <div className="agent-card p-4 md:p-5 space-y-4 animate-slide-in">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            Upload Image
          </h3>
          <FileDrop onFileSelected={handleFile} title="Drop image here" description="JPEG or PNG supported" />
          {preview && !loading && (
            <div className="relative group">
              <img src={preview} alt="Uploaded image preview for vision analysis" className="w-full h-40 md:h-48 object-cover rounded-xl border border-slate-700 transition-all duration-300 group-hover:border-cyan-500/50" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          )}
          {loading && (
            <div className="flex flex-col items-center justify-center py-6 md:py-8 space-y-3">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                <Loader2 className="w-5 h-5 text-cyan-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" aria-label="Analyzing image" />
              </div>
              <p className="text-sm text-cyan-400 animate-pulse">Analyzing image...</p>
            </div>
          )}
        </div>

        {/* Right: Results */}
        <div className="space-y-3 md:space-y-4">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 md:p-4 rounded-2xl text-sm flex items-center gap-3 animate-fade-in" role="alert">
              <AlertCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <>
              <div className="agent-card p-4 md:p-5 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                    <FileText className="w-4 h-4" aria-hidden="true" />
                    <span>Extracted Text</span>
                  </div>
                  <TTSButton text={result.ocr_text || result.description} label="Read Aloud" />
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-mono bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  {result.ocr_text || 'No text detected.'}
                </p>
              </div>

              <div className="agent-card p-4 md:p-5 space-y-3 animate-fade-in" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center justify-between border-b border-slate-700 pb-3 flex-wrap gap-2">
                  <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Scene Description</h4>
                  <TTSButton text={result.description} label="Describe Aloud" />
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">{result.description}</p>
              </div>

              <div className="agent-card p-4 md:p-5 space-y-3 animate-fade-in" style={{ animationDelay: '200ms' }}>
                <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Detected Objects</h4>
                <div className="flex flex-wrap gap-2">
                  {result.detected_items?.map((item, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium flex items-center gap-1.5 hover:bg-cyan-500/20 transition-colors">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          {!result && !error && !loading && (
            <div className="agent-card p-8 md:p-12 text-center text-slate-500 animate-fade-in">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                <Eye className="w-8 md:w-10 h-8 md:h-10 opacity-30" aria-hidden="true" />
              </div>
              <p className="text-sm">Upload an image to analyze.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

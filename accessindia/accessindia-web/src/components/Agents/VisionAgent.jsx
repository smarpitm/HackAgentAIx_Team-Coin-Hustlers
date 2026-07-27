import React, { useState } from 'react'
import { Eye, FileText, Sparkles, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { visionAPI } from '../../services/api'
import { FileDrop } from '../Shared/FileDrop'
import { TTSButton } from '../Shared/TTSButton'

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
      setResult(data)
    } catch (err) {
      setError(err.message || 'Vision analysis failed.')
      if (showToast) showToast(err.message || 'Vision analysis failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="agent-card p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Eye className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Vision Agent</h2>
          <p className="text-xs text-slate-400">Extract OCR text, scene descriptions, and detect objects using Gemini Vision.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Upload */}
        <div className="agent-card p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200">Upload Image</h3>
          <FileDrop onFileSelected={handleFile} title="Drop image here" description="JPEG or PNG supported" />
          {preview && !loading && (
            <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-xl border border-slate-700" />
          )}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
          )}
        </div>

        {/* Right: Results */}
        <div className="space-y-4">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-2xl text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <>
              {/* OCR Text */}
              <div className="agent-card p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                    <FileText className="w-4 h-4" />
                    <span>Extracted Text</span>
                  </div>
                  <TTSButton text={result.ocr_text || result.description} label="Read Aloud" />
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-mono bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  {result.ocr_text || 'No text detected.'}
                </p>
              </div>

              {/* Scene Description */}
              <div className="agent-card p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Scene Description</h4>
                  <TTSButton text={result.description} label="Describe Aloud" />
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">{result.description}</p>
              </div>

              {/* Detected Objects */}
              <div className="agent-card p-5 space-y-3">
                <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Detected Objects</h4>
                <div className="flex flex-wrap gap-2">
                  {result.detected_items?.map((item, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          {!result && !error && !loading && (
            <div className="agent-card p-12 text-center text-slate-500">
              <Eye className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Upload an image to analyze.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { Eye, FileText, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react'
import { visionAPI } from '../../services/api'
import { FileDrop } from '../Shared/FileDrop'
import { TTSButton } from '../Shared/TTSButton'
import { LoadingAgent } from '../Shared/LoadingAgent'

export function VisionAgent() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAnalyze = async () => {
    if (!selectedFile) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await visionAPI.analyzeImage(selectedFile)
      setResult(data)
    } catch (err) {
      console.error('Vision analysis error:', err)
      setError('Failed to process image with Vision Agent. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Vision Agent</h2>
            <p className="text-xs text-slate-400">
              Powered by Gemini 1.5 Flash Vision. Extract OCR text, visual descriptions, and detect key objects for visually impaired users.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Upload */}
        <div className="space-y-4">
          <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-3">Upload Image for OCR & Scene Analysis</h3>
            <FileDrop
              onFileSelected={(file) => {
                setSelectedFile(file)
                setResult(null)
              }}
              title="Select or Drop Scene/Signboard Photo"
              description="Supports JPEG, PNG up to 10MB"
            />

            <button
              onClick={handleAnalyze}
              disabled={!selectedFile || loading}
              className="mt-4 w-full bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-slate-950 font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>{loading ? 'Analyzing with Gemini Vision...' : 'Analyze Image Now'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="space-y-4">
          {loading && <LoadingAgent agentName="Gemini 1.5 Vision Agent" />}

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-2xl flex items-center space-x-3 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="space-y-4 animate-fade-in">
              {/* OCR Text Card */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <div className="flex items-center space-x-2 text-cyan-400 font-semibold text-sm">
                    <FileText className="w-4 h-4" />
                    <span>Extracted OCR Text</span>
                  </div>
                  <TTSButton text={result.ocr_text || result.description} label="Read Text Aloud" />
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-mono bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  {result.ocr_text || 'No printed text detected in image.'}
                </p>
              </div>

              {/* Scene Description Card */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-2">
                <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Scene Description</h4>
                <p className="text-sm text-slate-200 leading-relaxed">{result.description}</p>
              </div>

              {/* Detected Items Card */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Detected Visual Elements</h4>
                <div className="flex flex-wrap gap-2">
                  {result.detected_items?.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium flex items-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!result && !loading && (
            <div className="bg-slate-800/30 border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500">
              <Eye className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Upload an image on the left to display OCR text and vision output here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

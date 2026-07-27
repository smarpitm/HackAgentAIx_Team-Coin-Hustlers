import React, { useState } from 'react'
import { ClipboardCheck, AlertTriangle, Wrench, Loader2, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react'
import { auditAPI } from '../../services/api'
import { FileDrop } from '../Shared/FileDrop'
import { TTSButton } from '../Shared/TTSButton'

export function AuditAgent({ showToast }) {
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
      const data = await auditAPI.analyzeImage(file)
      setResult(data)
    } catch (err) {
      setError(err.message || 'Accessibility audit failed.')
      if (showToast) showToast(err.message || 'Audit failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 71) return { text: 'text-emerald-400', border: 'border-emerald-500/40', bg: 'bg-emerald-500/10' }
    if (score >= 41) return { text: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-500/10' }
    return { text: 'text-rose-400', border: 'border-rose-500/40', bg: 'bg-rose-500/10' }
  }

  const getSeverityStyle = (severity) => {
    switch ((severity || '').toLowerCase()) {
      case 'high': return 'bg-rose-500/10 text-rose-400 border-rose-500/30'
      case 'medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/30'
      case 'low': return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30'
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="agent-card p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <ClipboardCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Accessibility Audit Agent</h2>
          <p className="text-xs text-slate-400">Evaluate buildings against RPwD Act 2016 and CPWD barrier-free guidelines.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Upload */}
        <div className="agent-card p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200">Upload Building Photo</h3>
          <FileDrop onFileSelected={handleFile} title="Drop building image here" description="JPEG or PNG of entrance, ramp, or facility" />
          {preview && !loading && (
            <img src={preview} alt="Building preview" className="w-full h-48 object-cover rounded-xl border border-slate-700" />
          )}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
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
              {/* Score Gauge */}
              <div className="agent-card p-6 text-center space-y-3">
                <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Accessibility Score</span>
                <div className="flex items-center justify-center">
                  <div className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center shadow-xl ${getScoreColor(result.score).border} ${getScoreColor(result.score).bg}`}>
                    <span className={`text-3xl font-extrabold ${getScoreColor(result.score).text}`}>{result.score}</span>
                    <span className="text-[10px] text-slate-400 font-medium">/ 100</span>
                  </div>
                </div>
                {/* Score bar */}
                <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      result.score >= 71 ? 'bg-emerald-500' : result.score >= 41 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${result.score}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400">
                  {result.score >= 71 ? '✅ Compliant with accessibility guidelines'
                    : result.score >= 41 ? '⚠️ Partial compliance - improvements needed'
                    : '❌ Major accessibility barriers detected'}
                </p>
              </div>

              {/* Issues Card */}
              <div className="agent-card p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <h4 className="text-xs font-semibold uppercase text-rose-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Issues ({result.issues.length})
                  </h4>
                  <TTSButton text={`Audit score ${result.score}. Issues: ${result.issues.join('. ')}. Fixes: ${result.fixes.join('. ')}`} label="Read Report" />
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {result.issues.map((issue, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-rose-500/20 text-xs text-rose-200 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                      <span>{typeof issue === 'string' ? issue : issue.description || ''}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fixes Card */}
              <div className="agent-card p-5 space-y-3">
                <h4 className="text-xs font-semibold uppercase text-emerald-400 flex items-center gap-2 border-b border-slate-700 pb-3">
                  <Wrench className="w-4 h-4" />
                  Recommended Fixes ({result.fixes.length})
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {result.fixes.map((fix, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-emerald-500/20 text-xs text-emerald-200 flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span>{typeof fix === 'string' ? fix : fix.description || ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {!result && !error && !loading && (
            <div className="agent-card p-12 text-center text-slate-500">
              <ClipboardCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Upload a building photo to run an accessibility audit.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

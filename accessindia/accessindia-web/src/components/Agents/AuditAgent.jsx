import React, { useState } from 'react'
import { ClipboardCheck, AlertTriangle, Wrench, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { auditAPI } from '../../services/api'
import { FileDrop } from '../Shared/FileDrop'
import { TTSButton } from '../Shared/TTSButton'
import { AUDIT_FALLBACK } from '../../data/fallbacks'

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
      setResult({ ...data, _fallback: false })
    } catch (err) {
      setResult(AUDIT_FALLBACK)
      if (showToast) showToast('Audit API unavailable — using demo data', 'success')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 71) return { text: 'text-emerald-400', border: 'border-emerald-500/40', bg: 'bg-emerald-500/10' }
    if (score >= 41) return { text: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-500/10' }
    return { text: 'text-rose-400', border: 'border-rose-500/40', bg: 'bg-rose-500/10' }
  }

  return (
    <section className="max-w-5xl mx-auto space-y-4 md:space-y-6" aria-label="Accessibility Audit Agent">
      {/* Header */}
      <div className="agent-card p-4 md:p-6 flex items-center gap-3 md:gap-4">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
          <ClipboardCheck className="w-5 md:w-6 h-5 md:h-6" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base md:text-lg font-bold text-white">Accessibility Audit Agent</h2>
          <p className="text-[11px] md:text-xs text-slate-400">Evaluate buildings against RPwD Act 2016 and CPWD barrier-free guidelines.</p>
        </div>
        {result?._fallback && <span className="demo-badge flex-shrink-0">Demo</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Left: Upload */}
        <div className="agent-card p-4 md:p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200">Upload Building Photo</h3>
          <FileDrop onFileSelected={handleFile} title="Drop building image here" description="JPEG or PNG of entrance, ramp, or facility" />
          {preview && !loading && (
            <img src={preview} alt="Building photo uploaded for accessibility audit" className="w-full h-40 md:h-48 object-cover rounded-xl border border-slate-700" />
          )}
          {loading && (
            <div className="flex items-center justify-center py-6 md:py-8">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" aria-label="Auditing accessibility" />
            </div>
          )}
        </div>

        {/* Right: Results */}
        <div className="space-y-3 md:space-y-4">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 md:p-4 rounded-2xl text-sm flex items-center gap-3" role="alert">
              <AlertCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <>
              {/* Score Gauge */}
              <div className="agent-card p-4 md:p-6 text-center space-y-3">
                <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Accessibility Score</span>
                <div className="flex items-center justify-center">
                  <div className={`w-24 h-24 md:w-28 md:h-28 rounded-full border-4 flex flex-col items-center justify-center shadow-xl ${getScoreColor(result.score).border} ${getScoreColor(result.score).bg}`} aria-label={`Score: ${result.score} out of 100`}>
                    <span className={`text-2xl md:text-3xl font-extrabold ${getScoreColor(result.score).text}`}>{result.score}</span>
                    <span className="text-[10px] text-slate-400 font-medium">/ 100</span>
                  </div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden" role="progressbar" aria-valuenow={result.score} aria-valuemin={0} aria-valuemax={100} aria-label={`Accessibility score: ${result.score} percent`}>
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

              {/* Issues */}
              <div className="agent-card p-4 md:p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3 flex-wrap gap-2">
                  <h4 className="text-xs font-semibold uppercase text-rose-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                    Issues ({result.issues.length})
                  </h4>
                  <TTSButton text={`Audit score ${result.score}. Issues: ${Array.isArray(result.issues) ? result.issues.join('. ') : ''}.`} label="Read Report" />
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {result.issues.map((issue, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-rose-500/20 text-xs text-rose-200 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{typeof issue === 'string' ? issue : issue.description || ''}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fixes */}
              <div className="agent-card p-4 md:p-5 space-y-3">
                <h4 className="text-xs font-semibold uppercase text-emerald-400 flex items-center gap-2 border-b border-slate-700 pb-3">
                  <Wrench className="w-4 h-4" aria-hidden="true" />
                  Recommended Fixes ({result.fixes.length})
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {result.fixes.map((fix, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-emerald-500/20 text-xs text-emerald-200 flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0" aria-label={`Fix number ${idx + 1}`}>
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
            <div className="agent-card p-8 md:p-12 text-center text-slate-500">
              <ClipboardCheck className="w-8 md:w-10 h-8 md:h-10 mx-auto mb-3 opacity-30" aria-hidden="true" />
              <p className="text-sm">Upload a building photo to run an accessibility audit.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

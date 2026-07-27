import React, { useState } from 'react'
import { ShieldCheck, AlertTriangle, Wrench, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react'
import { analyzeAudit } from '../../services/api'
import { FileDrop } from '../Shared/FileDrop'
import { TTSButton } from '../Shared/TTSButton'
import { LoadingAgent } from '../Shared/LoadingAgent'

export function AuditAgent() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [auditResult, setAuditResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAudit = async () => {
    if (!selectedFile) return
    setLoading(true)
    setError(null)

    try {
      const data = await analyzeAudit(selectedFile)
      setAuditResult(data)
    } catch (err) {
      console.error('Audit analysis error:', err)
      setError('Failed to audit building image. Check backend connection.')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
    if (score >= 60) return 'text-amber-400 border-amber-500/40 bg-amber-500/10'
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10'
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Accessibility Audit Agent</h2>
            <p className="text-xs text-slate-400">
              Evaluates building entrances, ramps, doorways & infrastructure against RPwD Act 2016 & CPWD Guidelines.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Upload */}
        <div className="space-y-4">
          <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-3">Upload Facility Photo for Audit</h3>
            <FileDrop
              onFileSelected={(file) => {
                setSelectedFile(file)
                setAuditResult(null)
              }}
              title="Select Building/Ramp Image"
              description="Upload photo of entrance ramp, staircase, door, or public facility"
            />

            <button
              onClick={handleAudit}
              disabled={!selectedFile || loading}
              className="mt-4 w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>{loading ? 'Auditing CPWD Compliance...' : 'Run Accessibility Audit'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Audit Score & Findings */}
        <div className="space-y-4">
          {loading && <LoadingAgent agentName="Accessibility Audit Agent (CPWD Rules)" />}

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-2xl flex items-center space-x-3 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {auditResult && (
            <div className="space-y-4 animate-fade-in">
              {/* Score Gauge Card */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 text-center space-y-3">
                <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">CPWD Compliance Score</span>
                <div className="flex items-center justify-center">
                  <div className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center shadow-xl ${getScoreColor(auditResult.score)}`}>
                    <span className="text-3xl font-extrabold">{auditResult.score}</span>
                    <span className="text-[10px] text-slate-400 font-medium">/ 100 Score</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300">
                  {auditResult.score >= 80
                    ? 'Fully Accessible & Compliant with RPwD Guidelines'
                    : 'Requires Infrastructure Improvements for Full Accessibility'}
                </p>
              </div>

              {/* Identified Issues Card */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <h4 className="text-xs font-semibold uppercase text-rose-400 flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Identified Accessibility Barriers ({auditResult.issues.length})</span>
                  </h4>
                  <TTSButton
                    text={`Accessibility score is ${auditResult.score}. Issues found: ${auditResult.issues.join('. ')}`}
                    label="Read Audit Summary"
                  />
                </div>

                <div className="space-y-2">
                  {auditResult.issues.map((issue, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-rose-500/20 text-xs text-rose-200 flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                      <span>{issue}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fix Suggestions Card */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-semibold uppercase text-emerald-400 flex items-center space-x-2 border-b border-slate-700 pb-3">
                  <Wrench className="w-4 h-4" />
                  <span>Recommended Fixes & Standard Retrofits</span>
                </h4>

                <div className="space-y-2">
                  {auditResult.fixes.map((fix, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-emerald-500/20 text-xs text-emerald-200 flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{fix}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!auditResult && !loading && (
            <div className="bg-slate-800/30 border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500">
              <ShieldCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Upload a building photo on the left to run an automated accessibility audit.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

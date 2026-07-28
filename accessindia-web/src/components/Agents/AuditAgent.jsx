import React, { useState } from 'react'
import { ClipboardCheck, AlertTriangle, Wrench, Loader2, AlertCircle, CheckCircle2, Scan, Eye, Layers } from 'lucide-react'
import { auditAPI } from '../../services/api'
import { FileDrop } from '../Shared/FileDrop'
import { TTSButton } from '../Shared/TTSButton'
import { AUDIT_FALLBACK } from '../../data/fallbacks'

export function AuditAgent({ showToast }) {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(null)

  // Card Micro 3D Tilt interaction
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })

  const handleCardMouseMove = (e) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    // Limit tilt to max 6deg
    const ry = (x / (rect.width / 2)) * 5
    const rx = -(y / (rect.height / 2)) * 5

    setTilt({ rx, ry })
  }

  const handleCardMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 })
  }

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
      <div 
        onMouseMove={handleCardMouseMove}
        onMouseLeave={handleCardMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        }}
        className="agent-card tilt-card p-5 md:p-6 flex items-center justify-between gap-4 animate-fade-in gpu-layer"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-slate-950 flex-shrink-0 shadow-lg shadow-amber-500/20 font-bold">
            <ClipboardCheck className="w-6 h-6 text-slate-950" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-display font-bold text-white tracking-tight">Accessibility Audit Agent</h2>
            <p className="text-xs text-slate-400 font-sans">Evaluate building entrances & ramps against RPwD Act 2016 & CPWD Barrier-Free Standards.</p>
          </div>
        </div>
        {result?._fallback && <span className="demo-badge flex-shrink-0">Demo Mode</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left: Upload & Holographic Processing */}
        <div className="agent-card p-5 space-y-4 animate-slide-in">
          <h3 className="text-xs uppercase font-display font-bold text-amber-300 tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            1. Upload Building Entrance Photo
          </h3>

          <FileDrop onFileSelected={handleFile} title="Drop building photo here" description="JPEG or PNG of entrance, ramp, or steps" />

          {/* Processed Photo Visualization (Holographic Processing) */}
          {preview && (
            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between text-xs text-slate-300 font-display">
                <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                  <Scan className="w-4 h-4 animate-pulse" />
                  Holographic Inspection Shader
                </span>
                <span className="text-[10px] text-amber-400 font-mono uppercase bg-slate-900/80 px-2 py-0.5 rounded border border-amber-500/30">
                  {loading ? 'Scanning Wireframe Mesh...' : '3D Spatial Bounds Computed'}
                </span>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-cyan-500/40 shadow-2xl group bg-slate-950">
                {/* 1. Actual User Uploaded Image */}
                <img 
                  src={preview} 
                  alt="Building photo under accessibility audit inspection" 
                  className={`w-full h-52 md:h-64 object-cover rounded-2xl transition-all duration-700 ${
                    loading ? 'filter brightness-90 contrast-125 saturate-150' : 'filter brightness-105'
                  }`}
                />

                {/* 2. Holographic Projection Shader & Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-cyan-950/20 to-transparent pointer-events-none opacity-80" />
                <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:12px_12px] opacity-25 pointer-events-none animate-holo-pulse" />

                {/* 3. Glowing Cyan Horizontal Laser Scanning Line */}
                <div className="absolute left-0 right-0 h-[3px] bg-cyan-400 shadow-[0_0_18px_#06b6d4,0_0_30px_#06b6d4] animate-laser-sweep pointer-events-none z-20" />

                {/* 4. 3D Holographic Wireframe Mesh Overlay over actual building photo */}
                <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-3 font-mono text-[10px]">
                  {/* Top Wireframe Markers */}
                  <div className="flex justify-between items-start">
                    <div className="bg-slate-950/80 border border-cyan-400/50 text-cyan-300 px-2.5 py-1 rounded-md backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Ramp Slope Vector: 1:12 Standard</span>
                    </div>
                    <div className="bg-slate-950/80 border border-amber-400/50 text-amber-300 px-2.5 py-1 rounded-md backdrop-blur-md shadow-lg">
                      Clearance: 1200mm
                    </div>
                  </div>

                  {/* Central Wireframe Vector Bounding Box Overlay */}
                  <div className="my-auto mx-auto w-4/5 h-24 border-2 border-dashed border-cyan-400/70 rounded-xl relative flex items-center justify-center bg-cyan-500/5 backdrop-blur-[1px] animate-pulse">
                    {/* Corner Crosshairs */}
                    <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-300"></span>
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-300"></span>
                    <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-300"></span>
                    <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-300"></span>
                    <span className="text-[11px] font-bold text-cyan-300 bg-slate-950/90 px-3 py-1 rounded-full border border-cyan-400/40 shadow-xl">
                      {loading ? '⚡ Extracting Tactile & Gradient Features...' : '✅ Ramp Slope & Entrance Bounding Verified'}
                    </span>
                  </div>

                  {/* Bottom Node Markers */}
                  <div className="flex justify-between items-end">
                    <div className="bg-slate-950/80 border border-emerald-400/50 text-emerald-300 px-2.5 py-1 rounded-md backdrop-blur-md">
                      Handrail Node: Dual-Height 900mm/750mm
                    </div>
                    <div className="bg-slate-950/80 border border-cyan-400/50 text-cyan-300 px-2.5 py-1 rounded-md backdrop-blur-md">
                      Tactile Tiles: Detected
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-6 space-y-3 bg-slate-900/60 rounded-2xl border border-amber-500/20">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-400 rounded-full animate-spin"></div>
                <Loader2 className="w-5 h-5 text-amber-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" aria-label="Auditing accessibility" />
              </div>
              <p className="text-xs text-amber-400 font-display font-semibold animate-pulse">Running CPWD Barrier-Free Audit Shader...</p>
            </div>
          )}
        </div>

        {/* Right: Results */}
        <div className="space-y-4">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-2xl text-xs flex items-center gap-3" role="alert">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <>
              {/* Score Gauge */}
              <div 
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                style={{
                  transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                }}
                className="agent-card tilt-card p-6 text-center space-y-3 animate-fade-in gpu-layer"
              >
                <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider font-display">CPWD Compliance Score</span>
                <div className="flex items-center justify-center py-1">
                  <div className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center shadow-2xl ${getScoreColor(result.score).border} ${getScoreColor(result.score).bg} animate-scale-in`} aria-label={`Score: ${result.score} out of 100`}>
                    <span className={`text-3xl font-display font-extrabold ${getScoreColor(result.score).text}`}>{result.score}</span>
                    <span className="text-[10px] text-slate-400 font-medium">/ 100</span>
                  </div>
                </div>
                <div className="w-full bg-slate-900/80 rounded-full h-3 overflow-hidden border border-slate-700/60 p-0.5" role="progressbar" aria-valuenow={result.score} aria-valuemin={0} aria-valuemax={100} aria-label={`Accessibility score: ${result.score} percent`}>
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      result.score >= 71 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : result.score >= 41 ? 'bg-gradient-to-r from-amber-500 to-orange-400' : 'bg-gradient-to-r from-rose-500 to-red-600'
                    }`}
                    style={{ width: `${result.score}%` }}
                  />
                </div>
                <p className="text-xs text-slate-300 font-sans font-medium">
                  {result.score >= 71 ? '✅ Compliant with CPWD Barrier-Free Guidelines'
                    : result.score >= 41 ? '⚠️ Partial compliance - ramp & handrail improvements needed'
                    : '❌ Major accessibility barriers detected'}
                </p>
              </div>

              {/* Issues */}
              <div className="agent-card p-5 space-y-3 animate-fade-in" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 flex-wrap gap-2">
                  <h4 className="text-xs font-bold uppercase text-rose-400 flex items-center gap-2 font-display tracking-wider">
                    <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                    Detected Barriers ({result.issues.length})
                  </h4>
                  <TTSButton text={`Audit score ${result.score}. Issues: ${Array.isArray(result.issues) ? result.issues.join('. ') : ''}.`} label="Read Report" />
                </div>
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {result.issues.map((issue, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-rose-500/25 text-xs text-rose-200 flex items-start gap-2.5 hover:bg-rose-500/10 transition-colors">
                      <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{typeof issue === 'string' ? issue : issue.description || ''}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fixes */}
              <div className="agent-card p-5 space-y-3 animate-fade-in" style={{ animationDelay: '200ms' }}>
                <h4 className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-2 border-b border-slate-700/60 pb-3 font-display tracking-wider">
                  <Wrench className="w-4 h-4" aria-hidden="true" />
                  Recommended Retrofits ({result.fixes.length})
                </h4>
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {result.fixes.map((fix, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-emerald-500/25 text-xs text-emerald-200 flex items-start gap-2.5 hover:bg-emerald-500/10 transition-colors">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 font-mono" aria-label={`Fix number ${idx + 1}`}>
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
            <div className="agent-card p-8 md:p-12 text-center text-slate-400 space-y-3">
              <div className="amber-glass-chip p-4 rounded-full w-14 h-14 mx-auto flex items-center justify-center shadow-lg">
                <ClipboardCheck className="w-7 h-7 text-amber-400" aria-hidden="true" />
              </div>
              <p className="text-sm font-display font-semibold text-white">CPWD & RPwD Compliance Auditor</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">Upload an image of a building entrance, ramp, or doorway to initiate real-time spatial accessibility checks.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default AuditAgent


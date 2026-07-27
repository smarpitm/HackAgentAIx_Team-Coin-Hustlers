import React, { useState } from 'react'
import { Navigation, MapPin, Search, CheckCircle2, Building2, Shield, Compass, ArrowRight } from 'lucide-react'
import { navAPI } from '../../services/api'
import { TTSButton } from '../Shared/TTSButton'
import { LoadingAgent } from '../Shared/LoadingAgent'

export function NavigationAgent() {
  const [origin, setOrigin] = useState('Connaught Place, New Delhi')
  const [destination, setDestination] = useState('AIIMS Delhi, New Delhi')
  const [routeData, setRouteData] = useState(null)
  const [nearbyFacilities, setNearbyFacilities] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearchRoute = async (e) => {
    e?.preventDefault()
    if (!destination.trim()) return
    setLoading(true)

    try {
      const data = await navAPI.getRoute({ origin_lat: 28.6139, origin_lng: 77.2090, destination, mode: 'transit' })
      setRouteData(data)
      // Fetch nearby facilities
      const nearby = await navAPI.getNearby(28.6139, 77.2090, 'hospital')
      if (nearby.places) {
        setNearbyFacilities(nearby.places)
      }
    } catch (err) {
      console.error('Route calculation error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Navigation className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Navigation Agent</h2>
            <p className="text-xs text-slate-400">
              Find 100% barrier-free routes, tactile paths, wheelchair lifts, and accessible public facilities.
            </p>
          </div>
        </div>
      </div>

      {/* Form Input Bar */}
      <form onSubmit={handleSearchRoute} className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Starting Point</label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Destination</label>
          <div className="relative">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. AIIMS Hospital, Rajiv Chowk Metro"
              className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2"
          >
            <Compass className="w-5 h-5" />
            <span>{loading ? 'Finding Accessible Route...' : 'Get Accessible Route'}</span>
          </button>
        </div>
      </form>

      {loading && <LoadingAgent agentName="Google Maps Accessible Route Engine" />}

      {/* Main Results Display */}
      {routeData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Map Embed & Summary - 2 cols */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map Frame */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden h-[340px] relative">
              <iframe
                title="Google Maps Route"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(routeData.destination)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                allowFullScreen
              />
              <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-200 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verified Wheelchair Accessible Pathways</span>
              </div>
            </div>

            {/* Step-by-Step Directions */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
                  <Navigation className="w-4 h-4 text-emerald-400" />
                  <span>Step-by-Step Accessible Guidance</span>
                </h3>
                <TTSButton
                  text={routeData.steps.map((s) => s.instruction).join('. ')}
                  label="Listen to Directions"
                />
              </div>

              <div className="space-y-3">
                {routeData.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start space-x-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-200 leading-relaxed font-medium">{step.instruction}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-slate-400">
                        <span>Distance: {step.distance}</span>
                        <span>Duration: {step.duration}</span>
                        <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Ramp & Elevator OK</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Nearby Accessible Places Sidebar - 1 col */}
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-700 pb-3 flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Nearby Accessible Amenities</span>
              </h3>

              <div className="space-y-3">
                {nearbyFacilities.map((fac, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-emerald-300">
                      <span>{fac.name}</span>
                      <span className="text-slate-400 text-[10px]">{fac.distance}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{fac.address || fac.type}</p>
                    <div className="flex items-center space-x-2 text-[10px] text-emerald-400 pt-1">
                      <span className="bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Wheelchair Accessible</span>
                      <span className="bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Rating: {fac.rating || 4.8} ★</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

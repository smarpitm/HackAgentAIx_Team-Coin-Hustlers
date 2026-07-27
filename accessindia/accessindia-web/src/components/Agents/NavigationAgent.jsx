import React, { useState, useEffect, useRef } from 'react'
import { Navigation, Search, MapPin, Loader2, CheckCircle2, Building2, AlertCircle, Compass } from 'lucide-react'
import { navAPI } from '../../services/api'
import { useGeolocation } from '../../hooks/useGeolocation'
import { NAV_FALLBACK, NEARBY_FALLBACK } from '../../data/fallbacks'

export function NavigationAgent({ showToast }) {
  const { lat, lng, error: geoError } = useGeolocation()
  const [destination, setDestination] = useState('')
  const [route, setRoute] = useState(null)
  const [nearby, setNearby] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [demoMode, setDemoMode] = useState(false)
  const mapRef = useRef(null)

  useEffect(() => {
    if (lat && lng && mapRef.current && window.google) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom: 14,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#0f172a' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#334155' }] },
          { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#e2e8f0' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
        ],
      })
      new window.google.maps.Marker({ position: { lat, lng }, map, title: 'Your location' })
    }
  }, [lat, lng])

  const handleSearch = async () => {
    if (!destination.trim()) return
    setLoading(true)
    setError(null)
    setDemoMode(false)

    try {
      const [routeResult, nearbyResult] = await Promise.all([
        lat && lng
          ? navAPI.getRoute({ origin_lat: lat, origin_lng: lng, destination: destination.trim(), mode: 'walking' })
          : Promise.reject(new Error('No location')),
        lat && lng
          ? navAPI.getNearby(lat, lng, 'hospital')
          : Promise.reject(new Error('No location')),
      ])
      setRoute(routeResult)
      setNearby(nearbyResult.places || [])
    } catch (err) {
      setRoute(NAV_FALLBACK)
      setNearby(NEARBY_FALLBACK)
      setDemoMode(true)
      if (showToast) showToast('Navigation API unavailable — using demo data', 'success')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSearch() }

  return (
    <section className="max-w-6xl mx-auto space-y-4 md:space-y-6" aria-label="Navigation Agent">
      {/* Header */}
      <div className="agent-card p-4 md:p-6 flex items-center gap-3 md:gap-4">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
          <Navigation className="w-5 md:w-6 h-5 md:h-6" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base md:text-lg font-bold text-white">Navigation Agent</h2>
          <p className="text-[11px] md:text-xs text-slate-400">Find accessible routes and nearby facilities.</p>
        </div>
        {demoMode && <span className="demo-badge flex-shrink-0">Demo</span>}
      </div>

      {geoError && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 p-3 rounded-xl text-sm flex items-center gap-2" role="alert">
          <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          <span>Geolocation: {geoError}. Using default location.</span>
        </div>
      )}

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" aria-hidden="true" />
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter destination..."
            className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors min-h-[44px]"
            aria-label="Destination"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading || !destination.trim()}
          className="touch-target px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
          aria-label={loading ? 'Searching...' : 'Search routes'}
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : <Search className="w-5 h-5" aria-hidden="true" />}
          <span>{loading ? 'Searching...' : 'Search'}</span>
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-6 md:py-8">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" aria-label="Loading..." />
        </div>
      )}

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-2xl text-sm flex items-center gap-3" role="alert">
          <AlertCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {route && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <div ref={mapRef} className="agent-card h-56 md:h-72 flex items-center justify-center text-slate-500" aria-label="Map showing your location">
              <div className="text-center p-4">
                <MapPin className="w-6 md:w-8 h-6 md:h-8 mx-auto mb-2 opacity-40" aria-hidden="true" />
                <p className="text-sm">Map will appear here when Google Maps API is loaded.</p>
                {lat && lng && <p className="text-xs text-slate-600 mt-1">Location: {lat.toFixed(4)}, {lng.toFixed(4)}</p>}
              </div>
            </div>

            <div className="agent-card p-4 md:p-5">
              <div className="flex flex-wrap items-center justify-between mb-4 pb-3 border-b border-slate-700 gap-2">
                <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                  Route Details
                </h3>
                <div className="flex gap-3 md:gap-4 text-xs text-slate-400">
                  <span>📏 {route.distance}</span>
                  <span>⏱️ {route.duration}</span>
                </div>
              </div>
              <div className="space-y-3">
                {route.steps?.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold flex-shrink-0" aria-label={`Step ${idx + 1}`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-200 font-medium">{step.instruction}</p>
                      <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-1.5 text-xs text-slate-400">
                        <span>📏 {step.distance}</span>
                        <span>⏱️ {step.duration}</span>
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                          Accessible
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="agent-card p-4 md:p-5 space-y-3">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 pb-3 border-b border-slate-700">
                <Building2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                Nearby Facilities
              </h3>
              {nearby.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No facilities found nearby.</p>
              ) : (
                <div className="space-y-3">
                  {nearby.map((place, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
                      <p className="text-xs font-semibold text-emerald-300">{place.name}</p>
                      <p className="text-[11px] text-slate-400">{place.address || ''}</p>
                      <div className="flex flex-wrap items-center gap-2 text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                          {place.rating ? `${place.rating} ★` : 'N/A'}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                          ♿ {place.wheelchair_accessible ? 'Accessible' : 'Unknown'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

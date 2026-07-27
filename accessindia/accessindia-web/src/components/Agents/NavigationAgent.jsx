import React, { useState, useEffect, useRef } from 'react'
import { Navigation, Search, MapPin, Loader2, CheckCircle2, Building2, AlertCircle, Compass } from 'lucide-react'
import { navAPI } from '../../services/api'
import { useGeolocation } from '../../hooks/useGeolocation'

export function NavigationAgent({ showToast }) {
  const { lat, lng, error: geoError } = useGeolocation()
  const [destination, setDestination] = useState('')
  const [route, setRoute] = useState(null)
  const [nearby, setNearby] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const mapRef = useRef(null)

  // Load Google Maps when location is available
  useEffect(() => {
    if (lat && lng && mapRef.current && window.google) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom: 14,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#0f172a' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#334155' }],
          },
          {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#e2e8f0' }],
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#0f172a' }],
          },
        ],
      })
      new window.google.maps.Marker({ position: { lat, lng }, map, title: 'Your location' })
    }
  }, [lat, lng])

  const handleSearch = async () => {
    if (!destination.trim()) return
    if (!lat || !lng) {
      setError('Location not available. Please enable GPS.')
      return
    }
    setLoading(true)
    setError(null)

    try {
      const [routeResult, nearbyResult] = await Promise.all([
        navAPI.getRoute({ origin_lat: lat, origin_lng: lng, destination: destination.trim(), mode: 'walking' }),
        navAPI.getNearby(lat, lng, 'hospital'),
      ])
      setRoute(routeResult)
      setNearby(nearbyResult.places || [])
    } catch (err) {
      setError(err.message || 'Navigation search failed.')
      if (showToast) showToast(err.message || 'Navigation search failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="agent-card p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <Navigation className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Navigation Agent</h2>
          <p className="text-xs text-slate-400">Find accessible routes and nearby facilities.</p>
        </div>
      </div>

      {/* Geolocation status */}
      {geoError && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 p-3 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>Geolocation: {geoError}. Using default location.</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-emerald-400" />
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={lat && lng ? 'Enter destination...' : 'Getting your location...'}
            className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
            disabled={!lat || !lng}
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading || !destination.trim() || !lat || !lng}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          <span>{loading ? 'Searching...' : 'Search'}</span>
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        </div>
      )}

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-2xl text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results Grid */}
      {route && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map + Route Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map Container */}
            <div ref={mapRef} className="agent-card h-72 flex items-center justify-center text-slate-500">
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Map will appear here when Google Maps API is loaded.</p>
                <p className="text-xs text-slate-600 mt-1">Location: {lat?.toFixed(4)}, {lng?.toFixed(4)}</p>
              </div>
            </div>

            {/* Route Summary */}
            <div className="agent-card p-5">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
                <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  Route Details
                </h3>
                <div className="flex gap-4 text-xs text-slate-400">
                  <span>📏 {route.distance}</span>
                  <span>⏱️ {route.duration}</span>
                </div>
              </div>

              <div className="space-y-3">
                {route.steps?.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-200 font-medium">{step.instruction}</p>
                      <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-400">
                        <span>📏 {step.distance}</span>
                        <span>⏱️ {step.duration}</span>
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Accessible
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Nearby Facilities */}
          <div className="space-y-4">
            <div className="agent-card p-5 space-y-3">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 pb-3 border-b border-slate-700">
                <Building2 className="w-4 h-4 text-emerald-400" />
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
                      <div className="flex items-center gap-2 text-[10px]">
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
    </div>
  )
}

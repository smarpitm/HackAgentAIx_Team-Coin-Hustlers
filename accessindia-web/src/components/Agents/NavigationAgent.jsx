import React, { useState, useEffect, useRef } from 'react'
import { Navigation, Search, MapPin, Loader2, CheckCircle2, Building2, AlertCircle, Compass, Maximize2, Minimize2 } from 'lucide-react'
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
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const routeLineRef = useRef(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Initialize Leaflet map when location is available
  useEffect(() => {
    if (!mapContainerRef.current || !window.L) return

    // Default location (New Delhi) if geolocation is denied
    const mapLat = lat || 28.6139
    const mapLng = lng || 77.2090

    // Only create map once
    if (!mapInstanceRef.current) {
      const map = window.L.map(mapContainerRef.current, {
        center: [mapLat, mapLng],
        zoom: 14,
        zoomControl: true,
        attributionControl: true,
      })

      // Light-themed tile layer (CartoDB Voyager — free, no key)
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map)

      // User location marker
      if (lat && lng) {
        const userIcon = window.L.divIcon({
          html: '<div style="width:14px;height:14px;border-radius:50%;background:#f97316;border:3px solid white;box-shadow:0 0 8px rgba(249,115,22,0.6);"></div>',
          iconSize: [14, 14],
          iconAnchor: [7, 7],
          className: '',
        })
        window.L.marker([lat, lng], { icon: userIcon })
          .addTo(map)
          .bindPopup('<b>📍 Your Location</b>')
      }

      mapInstanceRef.current = map
    } else {
      mapInstanceRef.current.setView([mapLat, mapLng], 14)
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [lat, lng])

  // Update map when route/nearby change
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !route) return

    // Clear old markers and route line
    markersRef.current.forEach((m) => map.removeLayer(m))
    markersRef.current = []
    if (routeLineRef.current) {
      map.removeLayer(routeLineRef.current)
      routeLineRef.current = null
    }

    // Draw route polyline if coordinates are available
    if (route.route_coords && route.route_coords.length > 0) {
      const coords = route.route_coords.map((c) => [c[1], c[0]]) // OSRM returns [lng, lat]
      const polyline = window.L.polyline(coords, {
        color: '#10b981',
        weight: 5,
        opacity: 0.8,
        dashArray: '10, 6',
      }).addTo(map)
      routeLineRef.current = polyline
      map.fitBounds(polyline.getBounds(), { padding: [40, 40] })
    }

    // Add destination marker if we have destination coords
    if (route.dest_lat && route.dest_lng) {
      const destIcon = window.L.divIcon({
        html: '<div style="width:16px;height:16px;border-radius:50%;background:#10b981;border:3px solid white;box-shadow:0 0 8px rgba(16,185,129,0.6);"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        className: '',
      })
      const destMarker = window.L.marker([route.dest_lat, route.dest_lng], { icon: destIcon })
        .addTo(map)
        .bindPopup(`<b>🏁 ${destination || 'Destination'}</b>`)
      markersRef.current.push(destMarker)
    }

    // Add nearby facility markers
    nearby.forEach((place) => {
      if (place.lat && place.lng) {
        const facilityIcon = window.L.divIcon({
          html: '<div style="width:12px;height:12px;border-radius:50%;background:#6366f1;border:2px solid white;box-shadow:0 0 6px rgba(99,102,241,0.5);"></div>',
          iconSize: [12, 12],
          iconAnchor: [6, 6],
          className: '',
        })
        const marker = window.L.marker([place.lat, place.lng], { icon: facilityIcon })
          .addTo(map)
          .bindPopup(`<b>${place.name}</b><br/>${place.address || ''}<br/>⭐ ${place.rating || 'N/A'} ${place.wheelchair_accessible ? '♿ Accessible' : ''}`)
        markersRef.current.push(marker)
      }
    })
  }, [route, nearby, destination])

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
      <div className="agent-card p-4 md:p-6 flex items-center gap-3 md:gap-4 animate-fade-in">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-400/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 shadow-lg shadow-emerald-500/10">
          <Navigation className="w-5 md:w-6 h-5 md:h-6" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base md:text-lg font-bold text-white">Navigation Agent</h2>
          <p className="text-[11px] md:text-xs text-slate-400">Find accessible routes and nearby facilities via OpenStreetMap.</p>
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
            className="w-full bg-slate-800/80 backdrop-blur-sm border border-slate-700 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all duration-300 min-h-[44px]"
            aria-label="Destination"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading || !destination.trim()}
          className="touch-target px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-40 text-slate-950 font-bold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 flex items-center justify-center gap-2"
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

      {/* Map + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Leaflet Map Container with fullscreen toggle */}
          <div className="relative">
            <div
              ref={mapContainerRef}
              className={`agent-card rounded-2xl overflow-hidden z-0 transition-all duration-300 ${
                isFullscreen
                  ? 'fixed inset-0 z-50 rounded-none h-screen w-screen'
                  : 'h-56 md:h-72'
              }`}
              style={isFullscreen ? {} : { minHeight: '240px' }}
              aria-label="Interactive map showing your location and route"
            >
              {!window.L && (
                <div className="flex items-center justify-center h-full text-slate-500 text-center p-4">
                  <div>
                    <MapPin className="w-6 md:w-8 h-6 md:h-8 mx-auto mb-2 opacity-40" aria-hidden="true" />
                    <p className="text-sm">Map loading...</p>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                setIsFullscreen((prev) => !prev)
                // Invalidate map size after transition so tiles re-render
                setTimeout(() => {
                  mapInstanceRef.current?.invalidateSize()
                }, 350)
              }}
              className={`absolute top-3 right-3 touch-target p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-600 shadow-lg backdrop-blur-md transition-all ${
                isFullscreen ? 'z-[60]' : 'z-10'
              }`}
              aria-label={isFullscreen ? 'Exit fullscreen map' : 'Expand map to fullscreen'}
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen map'}
            >
              {isFullscreen
                ? <Minimize2 className="w-5 h-5" aria-hidden="true" />
                : <Maximize2 className="w-5 h-5" aria-hidden="true" />
              }
            </button>
          </div>

          {/* Route Steps */}
          {route && (
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
          )}
        </div>

        {/* Nearby Facilities (right sidebar) */}
        {route && (
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
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5 cursor-pointer hover:border-emerald-500/40 transition-colors"
                      onClick={() => {
                        if (place.lat && place.lng && mapInstanceRef.current) {
                          mapInstanceRef.current.setView([place.lat, place.lng], 16)
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`View ${place.name} on map`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && place.lat && place.lng && mapInstanceRef.current) {
                          mapInstanceRef.current.setView([place.lat, place.lng], 16)
                        }
                      }}
                    >
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
        )}
      </div>
    </section>
  )
}

export const VISION_FALLBACK = {
  ocr_text: 'PLATFORM 3 — NEW DELHI RAILWAY STATION\nAccessible Elevator & Tactile Pathway Ahead',
  description: 'A bustling railway platform with a bright yellow tactile guidance path. An illuminated sign points toward an accessible elevator and barrier-free ramp.',
  detected_items: [
    'Yellow Tactile Paving',
    'Platform Direction Signboard',
    'Wheelchair Ramp Indicator',
    'Passenger Seating Area',
    'Elevator Door',
  ],
  confidence: 0.90,
  _fallback: true,
}

export const NAV_FALLBACK = {
  distance: '2.3 km',
  duration: '28 min',
  steps: [
    { instruction: 'Start at current location', distance: '0 km', duration: '0 min' },
    { instruction: 'Head north on Main Road towards the junction', distance: '0.5 km', duration: '6 min' },
    { instruction: 'Turn right onto Park Avenue', distance: '1.0 km', duration: '12 min' },
    { instruction: 'Continue straight past the traffic signal', distance: '0.6 km', duration: '8 min' },
    { instruction: 'Arrive at destination on the left', distance: '0.2 km', duration: '2 min' },
  ],
  _fallback: true,
}

export const NEARBY_FALLBACK = [
  {
    name: 'City Hospital',
    address: '123 Healthcare Ave, New Delhi',
    rating: 4.5,
    lat: 28.615,
    lng: 77.210,
    wheelchair_accessible: true,
  },
  {
    name: 'Accessible Pharmacy',
    address: '456 Wellness Road, New Delhi',
    rating: 4.2,
    lat: 28.612,
    lng: 77.207,
    wheelchair_accessible: true,
  },
]

export const AUDIT_FALLBACK = {
  score: 68,
  issues: [
    'Entrance ramp slope exceeds 1:12 maximum recommended gradient',
    'Missing continuous handrails on right side of the ramp',
    'No tactile warning blocks at the top and bottom of ramp landing',
    'Entrance door width is 800mm (CPWD minimum requirement is 900mm)',
  ],
  fixes: [
    'Re-grade ramp to achieve standard 1:12 slope ratio with non-slip flooring',
    'Install dual-height continuous stainless steel handrails (760mm & 900mm height)',
    'Lay yellow hazard warning tactile tiles 300mm before ramp top/bottom landing',
    'Widen primary entrance doorway to at least 950mm with automatic sensor sliding',
  ],
  _fallback: true,
}

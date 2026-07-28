# AccessIndia AI - Implementation Fix Plan

## 📋 Overview
Based on README.md analysis, the project correctly uses:
- ✅ **Leaflet.js** for maps (not Google Maps)
- ✅ **OpenStreetMap** tiles (CartoDB Voyager)
- ✅ **Nominatim** for geocoding
- ✅ **OSRM** for routing
- ✅ **Overpass API** for nearby places
- ✅ **Web Speech API** for STT/TTS
- ✅ **MediaPipe Hands** for sign language

**Current Status**: Backend 85% complete, Frontend 30% complete

---

## 🎯 Implementation Strategy

### Phase 1: Core Components (2-3 hours) ✅ START HERE
Build shared components needed by all agents

### Phase 2: Agent UIs (3-4 hours)
Build the 5 agent interfaces one by one

### Phase 3: Integration & Testing (1-2 hours)
Wire everything together and test

### Phase 4: Polish & Accessibility (1 hour)
Final touches, accessibility testing

**Total Estimated Time**: 7-10 hours

---

## 📦 PHASE 1: CORE COMPONENTS (Priority 1)

### Task 1.1: FileDrop Component ⏱️ 30 min
**File**: `src/components/Shared/FileDrop.jsx`
**Purpose**: Drag-and-drop + click file upload with image preview
**Used by**: Vision Agent, Audit Agent

**Requirements**:
- Drag-and-drop zone
- Click to browse files
- Accept only images (JPEG, PNG)
- Show image preview after selection
- Max size validation (4MB)
- Clear/remove image button
- Accessible keyboard navigation
- `aria-label` on all interactive elements

**Dependencies**: None
**Status**: ❌ Missing

---

### Task 1.2: TTSButton Component ⏱️ 20 min
**File**: `src/components/Shared/TTSButton.jsx`
**Purpose**: Text-to-speech playback button
**Used by**: All agent responses, Vision OCR, Audit reports

**Requirements**:
- 🔊 Speaker icon button
- Takes `text` prop
- Uses Web Speech Synthesis API
- Shows speaking state (animated icon)
- Pause/resume functionality
- Cancel on unmount
- `aria-label="Read aloud"`

**Dependencies**: `useTextToSpeech` hook
**Status**: ❌ Missing

---

### Task 1.3: LoadingAgent Component ⏱️ 15 min
**File**: `src/components/Shared/LoadingAgent.jsx`
**Purpose**: Loading indicator with agent name
**Used by**: All agents during API calls

**Requirements**:
- Animated dots (...)
- Shows agent name: "Vision Agent is analyzing..."
- Orange spinning loader
- Accessible `role="status"` and `aria-live="polite"`

**Dependencies**: None
**Status**: ❌ Missing

---

### Task 1.4: CameraFeed Component ⏱️ 45 min
**File**: `src/components/Shared/CameraFeed.jsx`
**Purpose**: Webcam video feed with MediaPipe hand tracking overlay
**Used by**: Communication Agent (Sign Language tab)

**Requirements**:
- Video element for webcam
- Canvas overlay for hand landmarks
- Start/stop camera buttons
- MediaPipe Hands integration
- Hand landmark visualization
- Permission error handling
- `aria-label` on controls

**Dependencies**: `useMediaPipe` hook, MediaPipe Hands CDN
**Status**: ❌ Missing

---

### Task 1.5: useTextToSpeech Hook ⏱️ 20 min
**File**: `src/hooks/useTextToSpeech.js`
**Purpose**: Web Speech Synthesis wrapper hook
**Used by**: TTSButton, all agents

**API**:
```javascript
const { speak, cancel, speaking } = useTextToSpeech()
```

**Features**:
- `speak(text)` - Start TTS playback
- `cancel()` - Stop TTS
- `speaking` - Boolean state
- Auto-cancel on unmount
- Rate: 1.0, Pitch: 1.0, Voice: English (IN)

**Dependencies**: Web Speech API
**Status**: ❌ Missing

---

### Task 1.6: useSpeechToText Hook ⏱️ 45 min
**File**: `src/hooks/useSpeechToText.js`
**Purpose**: **Dual-engine** speech recognition (Web Speech + Gemini fallback)
**Used by**: Orchestrator Chat, Communication Agent

**API**:
```javascript
const { transcript, isListening, start, stop, reset, error } = useSpeechToText()
```

**Features**:
- **Primary**: Web Speech API (webkitSpeechRecognition)
- **Fallback**: MediaRecorder → upload to `/api/speech/transcribe`
- Continuous listening
- Interim results
- Language: 'en-IN' (Indian English)
- Error handling with auto-fallback

**Dependencies**: Web Speech API, MediaRecorder API, `/api/speech/transcribe` endpoint
**Status**: ❌ Missing

---

### Task 1.7: useGeolocation Hook ⏱️ 15 min
**File**: `src/hooks/useGeolocation.js`
**Purpose**: Get user's current location
**Used by**: Navigation Agent

**API**:
```javascript
const { location, loading, error } = useGeolocation()
// location: { lat: 28.6139, lng: 77.2090 } or null
```

**Features**:
- Uses `navigator.geolocation.getCurrentPosition()`
- Default fallback: Delhi coordinates (28.6139, 77.2090)
- Error handling
- Permission request
- Loading state

**Dependencies**: Geolocation API
**Status**: ❌ Missing

---

### Task 1.8: useMediaPipe Hook ⏱️ 30 min
**File**: `src/hooks/useMediaPipe.js`
**Purpose**: MediaPipe Hands hand landmark detection
**Used by**: CameraFeed, Communication Agent

**API**:
```javascript
const { hands, isReady, error } = useMediaPipe(videoRef)
// hands: array of hand landmark arrays
```

**Features**:
- Load MediaPipe Hands from CDN
- Initialize with video element
- Return hand landmarks array
- Hand gesture classification support
- Cleanup on unmount

**Dependencies**: MediaPipe Hands CDN (already in index.html)
**Status**: ❌ Missing

---

### Task 1.9: gestureClassifier Utility ⏱️ 20 min
**File**: `src/utils/gestureClassifier.js`
**Purpose**: Classify hand landmarks into gestures
**Used by**: Communication Agent

**API**:
```javascript
const gesture = classifyGesture(landmarks)
// Returns: 'hello' | 'help' | 'yes' | 'no' | 'thank_you' | 'unknown'
```

**Features**:
- Simple landmark-based classification
- 10 gestures: 👋 hello, 🆘 help, 👍 yes, 👎 no, 🙏 thank_you, 🍽️ eat, 🚰 drink, 🛑 stop, 🚶 go, 🚻 bathroom
- Template matching or angle-based logic
- Pre-trained gesture templates

**Dependencies**: None (pure math)
**Status**: ❌ Missing

---

## 📦 PHASE 2: AGENT UIs (Priority 2)

### Task 2.1: OrchestratorChat Component ⏱️ 1 hour
**File**: `src/components/Agents/OrchestratorChat.jsx`
**Route**: `/`

**Requirements**:
- WhatsApp-like chat UI
- Message input + send button
- Microphone button (useSpeechToText)
- File drop zone (optional image upload)
- Message bubbles (user: right, bot: left)
- Agent badge on bot responses (Vision Agent, Navigation Agent, etc.)
- Confidence score badge
- TTS button on each bot message
- Loading state (LoadingAgent)
- Scroll to bottom on new message
- Quick action chips (voice query samples)

**Dependencies**: TTSButton, LoadingAgent, useSpeechToText, FileDrop (optional)
**Status**: ❌ Missing

---

### Task 2.2: VisionAgent Component ⏱️ 45 min
**File**: `src/components/Agents/VisionAgent.jsx`
**Route**: `/vision`

**Requirements**:
- FileDrop for image upload
- "Analyze Image" button
- Loading state
- Results display:
  - OCR Text section (with TTS button)
  - Scene Description section (with TTS button)
  - Detected Items list
  - Confidence score badge
- Clear/upload new image button

**Dependencies**: FileDrop, TTSButton, LoadingAgent, `/api/vision/analyze`
**Status**: ❌ Missing

---

### Task 2.3: CommunicationAgent Component ⏱️ 1.5 hours
**File**: `src/components/Agents/CommunicationAgent.jsx`
**Route**: `/communication`

**Requirements**:
- **Two tabs**: Speech | Sign Language
- **Speech Tab**:
  - Microphone button (dual-engine useSpeechToText)
  - Editable transcript panel (can type/edit)
  - 4 Quick Voice Preset buttons:
    - "Find nearest hospital"
    - "Where is wheelchair ramp?"
    - "Is elevator available?"
    - "Where is accessible restroom?"
  - "Ask AI" button (sends to orchestrator)
  - TTS playback button
  - Hint badge: "💡 Tip: Edit transcript or use quick presets"
- **Sign Language Tab**:
  - CameraFeed component
  - Live gesture classification
  - Detected gesture display (large text)
  - Gesture history log
  - Start/stop camera buttons

**Dependencies**: useSpeechToText, CameraFeed, useMediaPipe, gestureClassifier, TTSButton
**Status**: ❌ Missing

---

### Task 2.4: NavigationAgent Component ⏱️ 2 hours
**File**: `src/components/Agents/NavigationAgent.jsx`
**Route**: `/navigation`

**Requirements**:
- **Leaflet.js map** (interactive, light CartoDB Voyager theme)
- Fullscreen toggle button (⤢ / ⤡)
- Destination search input (with autocomplete via Nominatim)
- "Get Route" button
- Route display:
  - Distance + Duration
  - Step-by-step directions list
  - Accessibility notes on each step
  - Route polyline on map (orange)
- Markers:
  - 🟠 Your location (from useGeolocation)
  - 🟢 Destination
  - 🟣 Nearby facilities
- **Nearby Facilities Search**:
  - Type selector (hospital, pharmacy, clinic, bank, etc.)
  - Radius slider (100m - 5000m)
  - Facility cards with:
    - Name, address, distance
    - Wheelchair accessible badge
    - Click to pan map
- Loading states
- Error handling (offline fallback)

**Dependencies**: useGeolocation, Leaflet.js, LoadingAgent, `/api/nav/route`, `/api/nav/nearby`
**Status**: ❌ Missing

---

### Task 2.5: AuditAgent Component ⏱️ 1 hour
**File**: `src/components/Agents/AuditAgent.jsx`
**Route**: `/audit`

**Requirements**:
- FileDrop for building image upload
- "Analyze Accessibility" button
- Loading state
- Results display:
  - **Animated score gauge** (0-100, circular progress)
    - 🟢 71-100: Compliant
    - 🟡 41-70: Partial
    - 🔴 0-40: Major barriers
  - **Issues section**: List of issues with:
    - Title
    - Severity badge (critical, major, minor)
    - Description
  - **Fixes section**: Numbered list with:
    - Title
    - Cost estimate
    - Description
  - TTS "Read Full Report" button
  - Summary text
- Clear/upload new image button

**Dependencies**: FileDrop, TTSButton, LoadingAgent, `/api/audit/analyze`
**Status**: ❌ Missing

---

## 📦 PHASE 3: INTEGRATION & TESTING (Priority 3)

### Task 3.1: Update App.jsx Routes ⏱️ 10 min
**File**: `src/App.jsx`

Replace placeholder components with actual agent components:
```jsx
import OrchestratorChat from './components/Agents/OrchestratorChat'
import VisionAgent from './components/Agents/VisionAgent'
import CommunicationAgent from './components/Agents/CommunicationAgent'
import NavigationAgent from './components/Agents/NavigationAgent'
import AuditAgent from './components/Agents/AuditAgent'

// Update routes
<Route path="/" element={<OrchestratorChat />} />
<Route path="/vision" element={<VisionAgent />} />
<Route path="/communication" element={<CommunicationAgent />} />
<Route path="/navigation" element={<NavigationAgent />} />
<Route path="/audit" element={<AuditAgent />} />
```

**Status**: ⏳ Pending Phase 2 completion

---

### Task 3.2: Install Frontend Dependencies ⏱️ 5 min
**File**: `package.json`

Add missing dependencies:
```json
{
  "dependencies": {
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1"
  }
}
```

Run: `npm install`

**Status**: ⏳ To do

---

### Task 3.3: Add Leaflet CSS ⏱️ 5 min
**File**: `index.html` or `src/main.jsx`

Add Leaflet CSS:
```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
```

**Status**: ⏳ To do

---

### Task 3.4: End-to-End Testing ⏱️ 30 min
Test each agent workflow:
1. **Chat**: Send message → get routing response
2. **Vision**: Upload image → see OCR + description
3. **Communication**: Speak → see transcript → send to AI
4. **Navigation**: Enter destination → see route + map
5. **Audit**: Upload building photo → see score + issues

**Status**: ⏳ Pending Phase 2 completion

---

## 📦 PHASE 4: POLISH & ACCESSIBILITY (Priority 4)

### Task 4.1: Mobile Responsiveness ⏱️ 20 min
- Test on mobile viewport (375px, 768px, 1024px)
- Add mobile bottom navigation (if needed)
- Ensure touch targets ≥ 44×44px
- Test map fullscreen on mobile

**Status**: ⏳ To do

---

### Task 4.2: Keyboard Navigation ⏱️ 15 min
- Test Tab navigation through all interactive elements
- Ensure focus visible (orange outline)
- Test Enter key on all buttons
- Add skip-to-content link

**Status**: ⏳ To do

---

### Task 4.3: Screen Reader Testing ⏱️ 15 min
- Test with NVDA (Windows) or VoiceOver (Mac)
- Verify all ARIA labels read correctly
- Check `aria-live` regions announce updates
- Test image alt text

**Status**: ⏳ To do

---

### Task 4.4: Error Handling UI ⏱️ 20 min
- Create toast notification component
- Add error alerts for API failures
- Show user-friendly error messages
- Add retry buttons

**Status**: ⏳ To do

---

## 🎯 EXECUTION ORDER

### IMMEDIATELY (Start with Phase 1 - Core Components)
1. ✅ useTextToSpeech.js (20 min)
2. ✅ TTSButton.jsx (20 min)
3. ✅ LoadingAgent.jsx (15 min)
4. ✅ FileDrop.jsx (30 min)
5. ✅ useGeolocation.js (15 min)
6. ✅ useSpeechToText.js (45 min)
7. ✅ useMediaPipe.js (30 min)
8. ✅ gestureClassifier.js (20 min)
9. ✅ CameraFeed.jsx (45 min)

**Total Phase 1**: ~3.5 hours

### NEXT (Phase 2 - Agent UIs, build in order)
10. ✅ VisionAgent.jsx (45 min) - Easiest, no complex dependencies
11. ✅ AuditAgent.jsx (1 hour) - Similar to Vision
12. ✅ OrchestratorChat.jsx (1 hour) - More complex
13. ✅ NavigationAgent.jsx (2 hours) - Most complex (Leaflet integration)
14. ✅ CommunicationAgent.jsx (1.5 hours) - Dual tabs

**Total Phase 2**: ~6 hours

### FINALLY (Phase 3 & 4)
15. ✅ Update App.jsx routes
16. ✅ Install dependencies (leaflet)
17. ✅ Test end-to-end
18. ✅ Polish & accessibility

**Total Phase 3 & 4**: ~1.5 hours

---

## ✅ SUCCESS CRITERIA

A component/feature is DONE when:
- ✅ Code written and runs without errors
- ✅ No console warnings/errors
- ✅ Works with AND without API key (graceful fallback)
- ✅ Responsive on mobile + desktop
- ✅ Keyboard accessible (Tab + Enter navigation)
- ✅ ARIA labels on all interactive elements
- ✅ Error handling in place
- ✅ Loading states implemented

---

## 🚀 LET'S START!

**Starting with**: Phase 1, Task 1.5 - useTextToSpeech hook (simplest, no dependencies)

**Next 5 tasks**:
1. useTextToSpeech.js ⏱️ 20 min
2. TTSButton.jsx ⏱️ 20 min
3. LoadingAgent.jsx ⏱️ 15 min
4. FileDrop.jsx ⏱️ 30 min
5. useGeolocation.js ⏱️ 15 min

**Let's build!** 🛠️

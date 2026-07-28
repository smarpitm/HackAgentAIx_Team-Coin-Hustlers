# AccessIndia AI — Manual Testing Guide

> **Version:** 1.0.0 | **Last Updated:** July 28, 2026  
> **Hackathon:** HackAgentAIx 2026 — Track 2: Multi-Agent Collaboration  
> **Team:** Coin Hustlers

---

## 📋 Table of Contents

1. [Prerequisites & Setup](#1-prerequisites--setup)
2. [Quick-Start Test Flow](#2-quick-start-test-flow)
3. [Backend API Testing (curl / Postman)](#3-backend-api-testing-curl--postman)
4. [Frontend UI Testing (Step-by-Step)](#4-frontend-ui-testing-step-by-step)
   - 4.1 App Load & Navigation
   - 4.2 Orchestrator Chat
   - 4.3 Vision Agent
   - 4.4 Communication Agent
   - 4.5 Navigation Agent
   - 4.6 Accessibility Audit Agent
5. [Fallback / Demo Mode Testing](#5-fallback--demo-mode-testing)
6. [Mobile Responsiveness](#6-mobile-responsiveness)
7. [Accessibility (WCAG AA) Audit](#7-accessibility-wcag-aa-audit)
8. [Troubleshooting Guide](#8-troubleshooting-guide)
9. [Test Summary Sheet](#9-test-summary-sheet)

---

## 1. Prerequisites & Setup

### 1.1 Environment Requirements

| Item | Requirement |
|------|-------------|
| Node.js | v18+ |
| Python | 3.10+ |
| Browser | Chrome 120+ / Firefox 120+ / Edge 120+ |
| OS | Windows / macOS / Linux |
| Camera | Required for Sign Language tab |
| Microphone | Required for Speech-to-Text |
| Location | Required for Navigation (GPS or browser geolocation) |

### 1.2 Start the Backend

```bash
# Navigate to the API directory
cd accessindia/accessindia-api

# Create virtual environment (one time)
python -m venv venv
source venv/bin/activate        # Linux/macOS
# OR venv\Scripts\activate      # Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file with your Gemini API key
echo "GEMINI_API_KEY=your_gemini_key_here" > .env
echo "CORS_ORIGINS=http://localhost:5173" >> .env

# Start the backend server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### 1.3 Start the Frontend

```bash
# Navigate to the web directory
cd accessindia/accessindia-web

# Install dependencies
npm install

# Start dev server
npm run dev
```

**Expected output:**
```
VITE v5.x.x  ready in 500ms
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.x.x:5173/
```

### 1.4 Verify Both Are Running

- **Backend health check:** Open `http://localhost:8000/health` — should return `{"status":"ok","service":"accessindia-ai"}`
- **Frontend:** Open `http://localhost:5173/` — should show dark-themed AccessIndia AI interface
- **API Docs:** Open `http://localhost:8000/docs` — should show Swagger UI with all 4 endpoint groups

### 1.5 Running Automated Tests (Before Manual Testing)

Run automated tests first to confirm base functionality:

```bash
# Backend tests
cd accessindia/accessindia-api
pytest tests/ -v --tb=short

# Frontend tests
cd accessindia/accessindia-web
npx vitest --run
```

**Expected:** All tests pass (green). Any failure means something is broken — fix before proceeding.

---

## 2. Quick-Start Test Flow

For a quick 5-minute smoke test, run through this sequence:

1. Open `http://localhost:5173/` → see dark theme, sidebar, header
2. Type "Hello, what can you do?" in chat → see general response
3. Navigate to **Vision** → upload any JPEG/PNG → see OCR + description
4. Navigate to **Communication** → click Speech tab → tap microphone → speak → see transcript
5. Navigate to **Navigation** → search "AIIMS Delhi" → see map + route steps
6. Navigate to **Audit** → upload a building photo → see score + issues + fixes
7. Open Chrome DevTools (F12) → **Console** tab → verify **zero errors**
8. Toggle **mobile view** (iPhone SE) → verify bottom nav bar appears

---

## 3. Backend API Testing (curl / Postman)

### 3.1 Health Check

```bash
curl http://localhost:8000/health
```

**Expected Response (200):**
```json
{"status":"ok","service":"accessindia-ai"}
```

### 3.2 Chat / Orchestrator

```bash
# Test 1: Vision intent
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "I cannot read this medicine label"}'

# Test 2: Navigation intent
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Find a hospital near me"}'

# Test 3: Audit intent
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Is this building wheelchair accessible?"}'

# Test 4: General intent
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, what can you do?"}'
```

**Expected Response Shape (200):**
```json
{
  "intent": "read_text",
  "agent": "vision",
  "confidence": 0.88,
  "message": "Routing to Vision Agent to analyze visual elements or extract text.",
  "data": null
}
```

**Verification Matrix:**

| Input | Expected `agent` | Expected `intent` | Min `confidence` |
|-------|------------------|-------------------|------------------|
| "I can't read this label" | `vision` | `read_text` | 0.50 |
| "Find a hospital near me" | `navigation` | `navigation_query` | 0.50 |
| "Navigate to AIIMS Delhi" | `navigation` | `navigation_query` | 0.50 |
| "Is this building accessible?" | `audit` | `accessibility_audit` | 0.50 |
| "Hello, what can you do?" | `general` | `general_greeting` | 0.50 |
| "Translate this to text" | `communication` | `communication_assist` | 0.50 |

### 3.3 Vision /analyze

```bash
# Test valid image upload
curl -X POST http://localhost:8000/api/vision/analyze \
  -F "file=@sample.jpg"

# Test invalid file type (expect 400)
curl -X POST http://localhost:8000/api/vision/analyze \
  -F "file=@test.txt;type=text/plain"

# Test missing file (expect 422)
curl -X POST http://localhost:8000/api/vision/analyze
```

**Expected Success Response (200):**
```json
{
  "ocr_text": "Platform 3 — New Delhi Railway Station",
  "description": "A bustling railway platform with tactile guidance path...",
  "detected_items": ["Yellow Tactile Paving", "Wheelchair Ramp"],
  "confidence": 0.90
}
```

**Expected Error Responses:**
- Invalid type → `{"detail": "Invalid file type 'text/plain'. Only JPEG and PNG images are supported."}`
- Missing file → `{"detail": [{"type": "missing", ...}]}` (422)

### 3.4 Navigation /route

```bash
# Test route with valid coordinates
curl -X POST http://localhost:8000/api/nav/route \
  -H "Content-Type: application/json" \
  -d '{
    "origin_lat": 28.6139,
    "origin_lng": 77.2090,
    "destination": "AIIMS Delhi",
    "mode": "walking"
  }'
```

**Expected Response (200):**
```json
{
  "distance": "2.3 km",
  "duration": "28 min",
  "steps": [
    {"instruction": "Head north on Main Road...", "distance": "0.5 km", "duration": "6 min"},
    {"instruction": "Turn right onto Park Avenue...", "distance": "1.0 km", "duration": "12 min"}
  ]
}
```

### 3.5 Navigation /nearby

```bash
# Test nearby search
curl "http://localhost:8000/api/nav/nearby?lat=28.6139&lng=77.2090&radius=2000&type=hospital"

# Test invalid coordinates (expect 422)
curl "http://localhost:8000/api/nav/nearby?lat=999&lng=77.2090"
```

**Expected Response (200):**
```json
{
  "places": [
    {
      "name": "City Hospital",
      "address": "123 Healthcare Ave",
      "rating": null,
      "lat": 28.615,
      "lng": 77.210,
      "wheelchair_accessible": true
    }
  ]
}
```

### 3.6 Audit /analyze

```bash
# Test valid building image
curl -X POST http://localhost:8000/api/audit/analyze \
  -F "file=@building.jpg"

# Test invalid file type (expect 400)
curl -X POST http://localhost:8000/api/audit/analyze \
  -F "file=@test.txt;type=text/plain"
```

**Expected Response (200):**
```json
{
  "score": 68,
  "issues": ["Entrance ramp slope exceeds 1:12...", "Missing handrails..."],
  "fixes": ["Re-grade ramp to 1:12 slope...", "Install dual-height handrails..."]
}
```

---

## 4. Frontend UI Testing (Step-by-Step)

### 4.1 App Load & Navigation

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1.1 | Open `http://localhost:5173/` | Dark theme loads (slate-900 background, white text) | ✅ / ❌ |
| 1.2 | Press **Tab** key once | "Skip to content" link appears at top of page | ✅ / ❌ |
| 1.3 | Observe left sidebar | Shows "AccessIndia AI" brand with orange icon | ✅ / ❌ |
| 1.4 | Check sidebar items | 5 nav items: Central Orchestrator, Vision, Communication, Navigation, Accessibility Audit | ✅ / ❌ |
| 1.5 | Click **Vision Agent** in sidebar | URL changes to `/vision`, header shows "Vision Agent", sidebar item highlights orange | ✅ / ❌ |
| 1.6 | Click **Communication Agent** | URL changes to `/communication` | ✅ / ❌ |
| 1.7 | Click **Navigation Agent** | URL changes to `/navigation` | ✅ / ❌ |
| 1.8 | Click **Accessibility Audit** | URL changes to `/audit` | ✅ / ❌ |
| 1.9 | Click **Central Orchestrator** (Chat) | URL changes to `/` | ✅ / ❌ |
| 1.10 | Open DevTools → Console | **Zero errors, zero warnings** | ✅ / ❌ |

### 4.2 Orchestrator Chat

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 2.1 | Navigate to `/` (Chat) | Welcome message displays with sparkle icon and intro text | ✅ / ❌ |
| 2.2 | Type "Hello, what can you do?" and press Enter | Message appears in orange bubble on right; agent response appears in slate bubble on left | ✅ / ❌ |
| 2.3 | Check agent response | Shows agent badge (e.g., "AI Assistant"), confidence %, and TTS button | ✅ / ❌ |
| 2.4 | Type "I can't read this medicine label" | Agent response shows "Vision Agent" badge | ✅ / ❌ |
| 2.5 | Type "Find a hospital near me" | Agent response shows "Navigation Agent" badge | ✅ / ❌ |
| 2.6 | Type "Is this building accessible?" | Agent response shows "Audit Agent" badge | ✅ / ❌ |
| 2.7 | Click **TTS button** on any agent response | Browser speaks the text aloud; button changes to "Stop" | ✅ / ❌ |
| 2.8 | Click **mic button** (microphone icon) | Button turns orange with pulse animation; transcript appears in input | ✅ / ❌ |
| 2.9 | Say "Hello" into microphone | Speech transcript appears in the orange banner above input | ✅ / ❌ |
| 2.10 | Click mic button again | Mic stops, listening indicator disappears | ✅ / ❌ |
| 2.11 | **Stop backend server** → send a message | Fallback message appears: "Unable to connect to backend. Using demo mode." | ✅ / ❌ |
| 2.12 | **Restart backend** → send another message | Normal response resumes | ✅ / ❌ |

### 4.3 Vision Agent

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 3.1 | Navigate to `/vision` | Header shows "Vision Agent", two-column layout with upload on left, results on right | ✅ / ❌ |
| 3.2 | Drag & drop a JPEG image onto the upload zone | Image preview appears; loading spinner shows briefly | ✅ / ❌ |
| 3.3 | Wait for analysis | "Extracted Text" card shows OCR text; "Scene Description" card shows description; "Detected Objects" shows tagged items | ✅ / ❌ |
| 3.4 | Click **TTS button** on Extracted Text card | Browser reads OCR text aloud | ✅ / ❌ |
| 3.5 | Click **TTS button** on Scene Description | Browser reads description aloud | ✅ / ❌ |
| 3.6 | Click the **X** button on the image preview | Image preview clears; back to upload state | ✅ / ❌ |
| 3.7 | Click the upload zone to open file picker | File dialog opens | ✅ / ❌ |
| 3.8 | **Stop backend** → upload an image | Demo data loads; "Demo" badge appears in header | ✅ / ❌ |
| 3.9 | Try uploading a `.txt` file | Should be rejected by file input (accept="image/*") | ✅ / ❌ |

### 4.4 Communication Agent

#### Speech Tab

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 4.1 | Navigate to `/communication` | Two tabs: "Speech" and "Sign Language" with Speech active | ✅ / ❌ |
| 4.2 | Click the large **microphone button** | Button pulses orange; text shows "Listening... Tap to stop" | ✅ / ❌ |
| 4.3 | Speak "Hello, how are you?" | Transcript appears in the right panel | ✅ / ❌ |
| 4.4 | Click **TTS button** below transcript | Browser reads the transcript aloud | ✅ / ❌ |
| 4.5 | Click microphone button again | Listening stops | ✅ / ❌ |

#### Sign Language Tab

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 4.6 | Click **Sign Language** tab | Tab switches; camera feed container appears | ✅ / ❌ |
| 4.7 | Click **Start Camera** button | Browser asks for camera permission; grant it | ✅ / ❌ |
| 4.8 | Wait for camera to activate | Live video feed appears; status shows "Live Stream Active" | ✅ / ❌ |
| 4.9 | Show a hand gesture to camera | A detected gesture card appears with emoji, label, and confidence % | ✅ / ❌ |
| 4.10 | Check the **Supported Gestures** grid | Lists 6 gestures: Hello, Yes, No, Peace, Wait, I Love You | ✅ / ❌ |
| 4.11 | Click **Stop Camera** | Camera feed stops; status shows "Camera Standby" | ✅ / ❌ |

### 4.5 Navigation Agent

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 5.1 | Navigate to `/navigation` | Header shows "Navigation Agent"; search bar + map visible | ✅ / ❌ |
| 5.2 | Allow browser geolocation (or deny) | If denied, amber warning shows "Using default location" | ✅ / ❌ |
| 5.3 | Type "AIIMS Delhi" in search bar and press Enter | Loading spinner; route appears below map with distance, duration, and numbered steps | ✅ / ❌ |
| 5.4 | Check the Leaflet map | User location marker (orange dot) visible; destination marker (green dot) visible; dashed green route line drawn | ✅ / ❌ |
| 5.5 | Check route steps | Each step shows: step number, instruction, distance, duration, green "Accessible" checkmark | ✅ / ❌ |
| 5.6 | Check **Nearby Facilities** card | Shows place cards with name, address, rating, and wheelchair accessibility status | ✅ / ❌ |
| 5.7 | Click a nearby facility card | Map centers on that facility's location (zoomed in) | ✅ / ❌ |
| 5.8 | **Stop backend** → search again | Demo route data loads; "Demo" badge appears | ✅ / ❌ |

### 4.6 Accessibility Audit Agent

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 6.1 | Navigate to `/audit` | Header shows "Accessibility Audit Agent"; two-column layout | ✅ / ❌ |
| 6.2 | Upload a building/ramp photo | Image preview appears; loading spinner | ✅ / ❌ |
| 6.3 | Wait for audit results | Score circle appears with number (0-100) and color coding | ✅ / ❌ |
| 6.4 | Verify score bar | Progress bar fills from 0% to the score value with animation | ✅ / ❌ |
| 6.5 | Check score interpretation | Text below score: "✅ Compliant" / "⚠️ Partial compliance" / "❌ Major barriers" | ✅ / ❌ |
| 6.6 | Check **Issues** card | Lists identified barriers; total issue count shown | ✅ / ❌ |
| 6.7 | Check **Fixes** card | Shows numbered, actionable recommendations | ✅ / ❌ |
| 6.8 | Click **TTS button** on Issues/Fixes | Browser reads the audit report aloud | ✅ / ❌ |
| 6.9 | **Stop backend** → upload again | Demo audit data loads; "Demo" badge in header | ✅ / ❌ |

---

## 5. Fallback / Demo Mode Testing

All agents have built-in fallback data when the backend is unreachable. Test each:

| Agent | Trigger | Fallback Behavior | Verify |
|-------|---------|-------------------|--------|
| **Chat** | Stop backend, send message | "Unable to connect to backend. Using demo mode." | ✅ / ❌ |
| **Vision** | Stop backend, upload image | Vision fallback data loads (Platform 3 text) | ✅ / ❌ |
| **Navigation** | Stop backend, search | Nav fallback route (2.3 km, 28 min, 5 steps) | ✅ / ❌ |
| **Audit** | Stop backend, upload image | Audit fallback data (score 68, 4 issues, 4 fixes) | ✅ / ❌ |
| **All** | While using fallback | **"Demo" badge** appears in agent header | ✅ / ❌ |

---

## 6. Mobile Responsiveness

Test using Chrome DevTools Device Toolbar (Ctrl+Shift+M).

| Device | Width | Expected Behavior | Pass/Fail |
|--------|-------|-------------------|-----------|
| iPhone SE | 375px | Bottom nav bar visible; sidebar hidden; text scales | ✅ / ❌ |
| iPhone 14 Pro | 390px | Bottom nav bar; touch targets ≥ 44px; cards stack | ✅ / ❌ |
| Pixel 7 | 412px | Same as above; no horizontal scroll | ✅ / ❌ |
| iPad Mini | 768px | Sidebar may appear; bottom nav hidden; responsive grid | ✅ / ❌ |
| iPad Pro | 1024px | Full desktop layout with sidebar | ✅ / ❌ |

**Mobile Checklist:**
- [ ] Sidebar collapses to 5-icon bottom tab bar
- [ ] All buttons have minimum 44×44px touch target
- [ ] Chat bubbles are full width on mobile
- [ ] Input field is fixed at bottom with mic + send buttons
- [ ] Image previews scale to screen width (no overflow)
- [ ] Map container resizes proportionally (min 240px height)
- [ ] Score gauge scales down on small screens
- [ ] No horizontal scroll bars anywhere
- [ ] Font sizes remain readable (no text cutoff)
- [ ] Bottom nav active state visible

---

## 7. Accessibility (WCAG AA) Audit

### 7.1 Keyboard Navigation

| Test | Action | Expected | Pass/Fail |
|------|--------|----------|-----------|
| Skip link | Press Tab on page load | "Skip to content" appears, press Enter → focus moves to main | ✅ / ❌ |
| Tab order | Press Tab repeatedly | Focus moves: sidebar → header → main content → in logical order | ✅ / ❌ |
| Enter key | Focus a nav item, press Enter | Navigates to that page | ✅ / ❌ |
| Escape | Focus a file preview X button, press Escape | Closes / removes file | ✅ / ❌ |
| Arrow keys | In chat, up/down arrows | Navigate through message history (future) | ✅ / ❌ |
| All buttons | Tab through all interactive elements | Every button receives visible focus ring | ✅ / ❌ |

### 7.2 Screen Reader Checks

| Test | Expected | Pass/Fail |
|------|----------|-----------|
| Page has `<h1>` with app name | ✅ Yes | ✅ / ❌ |
| Skip-to-content link is first focusable element | ✅ Yes | ✅ / ❌ |
| All icon buttons have `aria-label` | ✅ Yes (Mic, Send, TTS, Camera, etc.) | ✅ / ❌ |
| All images have `alt` text | ✅ Yes | ✅ / ❌ |
| Status messages use `role="alert"` or `aria-live` | ✅ Yes | ✅ / ❌ |
| Tab panels use `role="tablist"` + `role="tab"` | ✅ Yes (Communication Agent) | ✅ / ❌ |
| Progress bars use `role="progressbar"` | ✅ Yes (Audit score) | ✅ / ❌ |
| Color is never sole indicator | ✅ Icons + text accompany colors | ✅ / ❌ |

### 7.3 Color Contrast

Check these critical text elements:

| Element | Foreground | Background | Ratio | Min Required | Pass/Fail |
|---------|-----------|------------|-------|--------------|-----------|
| Body text | #f4f4f5 (zinc-100) | #0f172a (slate-900) | ~15:1 | 4.5:1 | ✅ / ❌ |
| Muted text | #9ca3af (gray-400) | #0f172a (slate-900) | ~7:1 | 4.5:1 | ✅ / ❌ |
| Button text | #ffffff (white) | #f97316 (orange-500) | ~4.5:1 | 4.5:1 | ✅ / ❌ |
| Card text | #f4f4f5 (zinc-100) | #1e293b (slate-800) | ~13:1 | 4.5:1 | ✅ / ❌ |

---

## 8. Troubleshooting Guide

### Backend Issues

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| `ModuleNotFoundError` | Missing dependencies | `pip install -r requirements.txt` |
| `Gemini API 429` | Rate limited | Wait 60s, retry, or check API key quota |
| `CORS error` in browser | Backend CORS misconfigured | Update `CORS_ORIGINS` in `.env` |
| `Port 8000 already in use` | Another process on that port | `lsof -ti:8000 \| xargs kill -9` (macOS/Linux) |
| Pydantic validation error | Request doesn't match models | Check JSON payload matches model schema |
| Route returns fallback data | OSRM/Nominatim API timeout | Retry; APIs are free and rate-limited |

### Frontend Issues

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Blank white screen | JS import error | Check browser console; verify all file paths |
| Map not loading | Leaflet CDN blocked | Check network tab; verify `window.L` exists |
| Camera not working | HTTP (not HTTPS) | Use `localhost` or HTTPS; check permissions |
| Mic not working | HTTP or browser permissions | Use `localhost` or HTTPS; allow mic access |
| Speech-to-text not working | Browser not supported | Use Chrome; `window.SpeechRecognition` required |
| Gestures not detecting | MediaPipe CDN not loaded | Check `window.Hands` exists; verify index.html scripts |
| "Demo" data keeps showing | Backend not running | Start backend: `uvicorn app.main:app --reload` |
| Dark theme broken | Tailwind content paths wrong | Verify `tailwind.config.js` includes all source files |

---

## 9. Test Summary Sheet

### Quick Reference — All API Endpoints

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/health` | Health check | None |
| POST | `/api/chat` | Intent classification | None |
| POST | `/api/vision/analyze` | Image OCR + description | None (Gemini key on server) |
| POST | `/api/nav/route` | Get walking directions | None |
| GET | `/api/nav/nearby` | Find nearby facilities | None |
| POST | `/api/audit/analyze` | Accessibility score | None (Gemini key on server) |

### Final Sign-Off Checklist

- [ ] **All 6 API endpoints** return correct responses (Section 3)
- [ ] **All 5 agents** render and function correctly (Section 4)
- [ ] **Fallback data** works for all 4 fallback scenarios (Section 5)
- [ ] **Mobile responsive** — tested on 375px–1024px widths (Section 6)
- [ ] **Keyboard accessible** — full Tab flow works (Section 7.1)
- [ ] **Zero console errors** — DevTools Console clean
- [ ] **Automated tests pass** — `pytest` + `vitest` all green (Section 1.5)

---

### Test Results

| Section | Total Checks | Passed | Failed | Not Tested | Score |
|---------|-------------|-------|--------|------------|-------|
| 4.1 App Load & Navigation | 10 | | | | /10 |
| 4.2 Orchestrator Chat | 12 | | | | /12 |
| 4.3 Vision Agent | 9 | | | | /9 |
| 4.4 Communication Agent | 11 | | | | /11 |
| 4.5 Navigation Agent | 8 | | | | /8 |
| 4.6 Audit Agent | 9 | | | | /9 |
| 5 Fallback Testing | 5 | | | | /5 |
| 6 Mobile Responsiveness | 9 | | | | /9 |
| 7 Accessibility | 16 | | | | /16 |
| **TOTAL** | **89** | | | | **/89** |

---

**Tested by:** _________________ **Date:** _________________ **Overall Result:** ✅ / ❌

*This guide was prepared by Buffy — AI Agent for Team Coin Hustlers*

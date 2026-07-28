<p align="center">
  <img src="https://img.shields.io/badge/🇮🇳_AccessIndia_AI-Multi--Agent_Accessibility_Platform-orange?style=for-the-badge&labelColor=0f172a" alt="AccessIndia AI" />
</p>

<h1 align="center">♿ AccessIndia AI</h1>

<p align="center">
  <b>A Multi-Agent AI Ecosystem for Universal Accessibility in India</b><br/>
  <sub>Powered by Google Gemini 2.5 Flash · Leaflet.js · OpenStreetMap · MediaPipe · Web Speech API</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Built_with-React_18-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/AI_Engine-Gemini_2.5_Flash-4285F4?style=flat-square&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Maps-Leaflet.js_+_OSM-199900?style=flat-square&logo=openstreetmap&logoColor=white" />
  <img src="https://img.shields.io/badge/Compliance-RPwD_Act_2016-FF6F00?style=flat-square" />
  <img src="https://img.shields.io/badge/WCAG-AA_Compliant-228B22?style=flat-square" />
  <img src="https://img.shields.io/badge/Tests-29_Passing-brightgreen?style=flat-square" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/API_Keys_Required-Only_Gemini_(Free)-blueviolet?style=flat-square" />
  <img src="https://img.shields.io/badge/Maps_&_Routing-100%25_Free-success?style=flat-square" />
</p>

## 🏆 Team Coin Hustlers

> *Building technology that breaks barriers, not people.*

## 🧠 What is AccessIndia AI?

**AccessIndia AI** is a multi-agent AI-powered accessibility platform designed to empower **80+ million persons with disabilities in India**. It combines five specialized AI agents into a single, cohesive ecosystem that can:

- 👁️ **See** — Extract text from signs, documents, and medicine labels via OCR and describe visual scenes for blind users
- 🗣️ **Communicate** — Bridge speech and sign language barriers with real-time recognition and synthesis
- 🗺️ **Navigate** — Find wheelchair-accessible walking routes and nearby accessible hospitals, pharmacies, and transit stops
- 📋 **Audit** — Evaluate buildings against India's **RPwD Act 2016** and **CPWD Barrier-Free Guidelines** using just a photo
- 🤖 **Orchestrate** — A central AI brain that understands user intent and automatically routes requests to the right specialist agent

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    AccessIndia AI Platform                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              React 18 Web Client                    │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────────────┐ │    │
│  │  │ Sidebar  │ │  Header  │ │  Mobile Bottom Nav   │ │    │
│  │  └──────────┘ └──────────┘ └──────────────────────┘ │    │
│  │                                                     │    │
│  │  ┌──────────────────────────────────────────────┐   │    │
│  │  │            5 Agent Views (Routes)            │   │    │
│  │  │  / Chat  /vision  /communication             │   │    │
│  │  │          /navigation  /audit                 │   │    │
│  │  └──────────────────────────────────────────────┘   │    │
│  │                                                     │    │
│  │  Shared: TTSButton │ FileDrop │ CameraFeed │ Loading│    │
│  │  Hooks:  useSpeechToText │ useTextToSpeech          │    │
│  │          useMediaPipe │ useGeolocation              │    │
│  │  State:  Zustand (useAppStore)                      │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │ Axios                           │
│                           ▼                                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              FastAPI Backend (Python)               │    │
│  │                                                     │    │
│  │  Routers:  /api/chat  /api/vision/analyze           │    │
│  │            /api/nav/route  /api/nav/nearby          │    │
│  │            /api/audit/analyze  /health              │    │
│  │                                                     │    │
│  │  Agents:  Orchestrator │ Vision │ Navigation │ Audit│    │
│  │                                                     │    │
│  │  AI:       Google Gemini 2.5 Flash (generative AI)  │    │
│  │  Maps:     Nominatim + OSRM + Overpass (all free)   │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🤖 The Five Agents

### 1. 🧠 Central Orchestrator (`/`)
The **brain** of AccessIndia AI. Uses Gemini 2.5 Flash to classify user intent from natural language and automatically routes requests to the optimal specialist agent with confidence scoring.

**Features:**
- Natural language intent classification (vision, navigation, communication, audit)
- Agent badge + confidence score display on every response
- Speech-to-Text microphone input (Web Speech API)
- Text-to-Speech audio playback on all agent responses
- Graceful offline fallback with heuristic rule engine

### 2. 👁️ Vision Agent (`/vision`)
Extracts text and describes visual scenes for blind and visually impaired users using **Gemini 2.5 Flash multimodal vision**.

**Features:**
- OCR text extraction from signs, documents, medicine labels, signboards
- Rich scene description (2-3 sentences of vivid, context-aware narration)
- Detected objects list (ramps, elevators, tactile paving, obstacles)
- Drag-and-drop image upload with preview
- TTS "Read Aloud" for extracted text and descriptions

### 3. 🗣️ Communication Agent (`/communication`)
Bridges communication barriers for deaf, mute, and speech-impaired users.

**Features:**
- **Speech Tab**: Real-time speech-to-text transcription via `webkitSpeechRecognition`
- **Sign Language Tab**: Live webcam hand gesture detection via MediaPipe Hands
- Supported gestures: Hello/Namaste 👋, Yes 👍, No 👎, Peace ✌️, Wait ☝️, ILY 🤟
- TTS playback of transcribed speech
- Zero external API keys required (100% browser-native + CDN)

### 4. 🗺️ Navigation Agent (`/navigation`)
Finds wheelchair-accessible walking routes and nearby accessible facilities using **100% free OpenStreetMap infrastructure**.

**Features:**
- Interactive dark-themed Leaflet.js map (CartoDB Dark Matter tiles)
- Walking route calculation via OSRM (Open Source Routing Machine)
- Destination geocoding via Nominatim (biased to India)
- Nearby hospital/pharmacy/clinic search via Overpass API
- Route polyline drawing with step-by-step accessible directions
- Custom markers: 🟠 Your location · 🟢 Destination · 🟣 Nearby facilities
- Clickable facility cards that auto-pan the map
- No Google Maps API key required

### 5. 📋 Accessibility Audit Agent (`/audit`)
Evaluates building photos against India's **RPwD Act 2016** and **CPWD Harmonised Guidelines for Barrier-Free Built Environment**.

**Features:**
- Upload building entrance/ramp/staircase photos
- AI-powered compliance scoring (0-100) with color-coded gauge:
  - 🟢 **71-100**: Compliant
  - 🟡 **41-70**: Partial compliance
  - 🔴 **0-40**: Major barriers detected
- Specific issues identification (steep ramp >1:12, narrow doorway <900mm, missing tactile paving)
- Numbered actionable fix recommendations
- TTS "Read Report" for full audit summary
- Animated score progress bar

## ♿ Accessibility Compliance (WCAG AA)

AccessIndia AI is built **accessibility-first**:

| Standard | Implementation |
| :--- | :--- |
| **WCAG 2.4.1** Skip Navigation | Skip-to-content link on first Tab press |
| **WCAG 2.4.7** Focus Visible | Orange focus rings on all interactive elements |
| **WCAG 2.5.5** Touch Target | Minimum 44×44px touch targets on all buttons |
| **WCAG 1.4.3** Contrast | High-contrast dark theme (slate-900 background, white text) |
| **WCAG 1.3.1** Semantic HTML | Proper `<section>`, `<nav>`, `<main>`, `role` attributes |
| **WCAG 4.1.2** ARIA Labels | All icon buttons have descriptive `aria-label` attributes |
| **WCAG 1.1.1** Alt Text | All images have meaningful `alt` descriptions |
| **Screen Reader** | `aria-live` regions for dynamic content updates |

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite 5 | UI framework with fast HMR |
| **Styling** | Tailwind CSS 3.4 | Utility-first responsive design |
| **State** | Zustand 4.5 | Lightweight global state management |
| **Routing** | React Router 6 | Client-side SPA navigation |
| **Icons** | Lucide React | Accessible SVG icon library |
| **HTTP** | Axios | API client with interceptors |
| **Backend** | FastAPI + Uvicorn | High-performance async Python API |
| **AI Model** | Google Gemini 2.5 Flash | Multimodal generative AI (text + vision) |
| **Maps** | Leaflet.js 1.9.4 | Interactive map rendering |
| **Tiles** | CartoDB Dark Matter | Dark-themed OpenStreetMap tiles |
| **Geocoding** | Nominatim (OSM) | Free address-to-coordinate lookup |
| **Routing** | OSRM | Free walking route calculation |
| **Places** | Overpass API (OSM) | Free nearby facility search |
| **Hand Tracking** | MediaPipe Hands | Real-time hand landmark detection |
| **Speech** | Web Speech API | Browser-native STT & TTS |
| **Testing** | Vitest + Pytest | Frontend & backend test suites |

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥ 18.x
- **Python** ≥ 3.10
- **Google Gemini API Key** (free from [Google AI Studio](https://aistudio.google.com/))

### 1. Clone the Repository

```bash
git clone https://github.com/smarpitm/HackAgentAIx_Team-Coin-Hustlers.git
cd HackAgentAIx_Team-Coin-Hustlers
```

### 2. Configure Environment

Create `accessindia/accessindia-api/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=8000
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000
```

> 💡 **That's it!** Only one API key needed. Maps, routing, geocoding, speech, and sign language are all 100% free.

### 3. Start the Backend

```bash
cd accessindia/accessindia-api
pip install -r requirements.txt
python -m app.main
```

Backend runs at `http://localhost:8000`

### 4. Start the Frontend

```bash
cd accessindia/accessindia-web
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

## 🧪 Testing

### Backend (Pytest) — 13 tests

```bash
cd accessindia/accessindia-api
pytest -v
```

```
tests/test_audit.py      ✅ 2 passed  (invalid format, valid image audit)
tests/test_chat.py       ✅ 4 passed  (vision/nav/audit/general intent routing)
tests/test_health.py     ✅ 1 passed  (health check endpoint)
tests/test_navigation.py ✅ 3 passed  (route calc, nearby search, coord validation)
tests/test_vision.py     ✅ 3 passed  (invalid format, no file, valid image OCR)
```

### Frontend (Vitest) — 16 tests

```bash
cd accessindia/accessindia-web
npm test
```

```
gestureClassifier.test.js  ✅ 4 passed
useTextToSpeech.test.js    ✅ 3 passed
useSpeechToText.test.js    ✅ 3 passed
VisionAgent.test.jsx       ✅ 3 passed
App.test.jsx               ✅ 3 passed
```

## 📁 Project Structure

```
accessindia/
├── accessindia-api/                 # FastAPI Backend
│   ├── app/
│   │   ├── agents/
│   │   │   ├── orchestrator.py      # Central AI intent classifier
│   │   │   ├── vision_agent.py      # Gemini Vision OCR + scene description
│   │   │   ├── navigation_agent.py  # Nominatim + OSRM + Overpass routing
│   │   │   └── audit_agent.py       # RPwD/CPWD compliance auditor
│   │   ├── routers/
│   │   │   ├── chat.py              # POST /api/chat
│   │   │   ├── vision.py            # POST /api/vision/analyze
│   │   │   ├── navigation.py        # POST /api/nav/route + GET /api/nav/nearby
│   │   │   └── audit.py             # POST /api/audit/analyze
│   │   ├── utils/
│   │   │   └── prompts.py           # Gemini system prompts
│   │   ├── config.py                # Environment settings
│   │   ├── models.py                # Pydantic request/response schemas
│   │   └── main.py                  # FastAPI app entry point
│   ├── tests/                       # Pytest test suite
│   └── requirements.txt
│
├── accessindia-web/                 # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Agents/
│   │   │   │   ├── OrchestratorChat.jsx
│   │   │   │   ├── VisionAgent.jsx
│   │   │   │   ├── CommunicationAgent.jsx
│   │   │   │   ├── NavigationAgent.jsx
│   │   │   │   └── AuditAgent.jsx
│   │   │   ├── Layout/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Header.jsx
│   │   │   └── Shared/
│   │   │       ├── TTSButton.jsx
│   │   │       ├── FileDrop.jsx
│   │   │       ├── CameraFeed.jsx
│   │   │       └── LoadingAgent.jsx
│   │   ├── hooks/
│   │   │   ├── useSpeechToText.js
│   │   │   ├── useTextToSpeech.js
│   │   │   ├── useMediaPipe.js
│   │   │   └── useGeolocation.js
│   │   ├── services/
│   │   │   └── api.js               # Axios API client
│   │   ├── store/
│   │   │   └── useAppStore.js        # Zustand global state
│   │   ├── data/
│   │   │   └── fallbacks.js          # Demo mode fallback data
│   │   ├── utils/
│   │   │   └── gestureClassifier.js  # Hand gesture classification
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tests/                        # Vitest test suite
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
```

## 🌐 API Endpoints

| Method | Endpoint | Description |
| :---: | :--- | :--- |
| `GET` | `/health` | System health check |
| `POST` | `/api/chat` | Orchestrator — classify intent & route to agent |
| `POST` | `/api/vision/analyze` | Vision — OCR + scene description from image |
| `POST` | `/api/nav/route` | Navigation — walking route via OSRM |
| `GET` | `/api/nav/nearby` | Navigation — nearby accessible facilities |
| `POST` | `/api/audit/analyze` | Audit — RPwD compliance score from building photo |

## 💰 Cost Breakdown

| Component | Provider | Cost |
| :--- | :--- | :---: |
| AI (Chat, Vision, Audit) | Google Gemini 2.5 Flash | **Free Tier** |
| Map Tiles | CartoDB / OpenStreetMap | **Free** |
| Walking Routes | OSRM | **Free** |
| Geocoding | Nominatim | **Free** |
| Nearby Search | Overpass API | **Free** |
| Speech Recognition | Web Speech API | **Free** |
| Text-to-Speech | Web Speech Synthesis | **Free** |
| Sign Language Detection | MediaPipe Hands | **Free** |

> **Total running cost: $0/month** (only Gemini API key required, free tier is sufficient)

## 📜 Regulatory Alignment

This platform is built in alignment with:

- **🇮🇳 Rights of Persons with Disabilities (RPwD) Act, 2016** — India's landmark disability rights legislation mandating accessibility in public buildings, transport, and digital services.
- **🏗️ CPWD Harmonised Guidelines for Barrier-Free Built Environment** — India's architectural standards for ramp gradients (≤1:12), door widths (≥900mm), tactile paving, handrail heights, and elevator accessibility.
- **🌐 WCAG 2.1 Level AA** — Web Content Accessibility Guidelines ensuring the platform itself is usable by persons with disabilities.

<p align="center">
  <b>Built with ❤️ by Team Coin Hustlers</b><br/>
  <sub>HackAgentAIx International Hackathon 2026</sub>
</p>

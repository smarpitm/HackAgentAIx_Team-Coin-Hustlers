# Quick Fix Checklist - AccessIndia AI

## ✅ COMPLETED FIXES

- [x] **Fixed Gemini model name**: Changed `gemini-2.5-flash` → `gemini-1.5-flash`
- [x] **Fixed config.py**: Migrated to pydantic-settings v2 pattern
- [x] **Removed speech router import**: Backend now starts without error
- [x] **Added Pillow**: Image processing dependency added
- [x] **Created frontend .env**: API URL configured
- [x] **Updated google-generativeai**: Upgraded to >=0.8.0

---

## 🔴 CRITICAL - DO NEXT (4-6 hours)

### Frontend Components
- [ ] **FileDrop.jsx** - Drag-and-drop image upload component
- [ ] **VisionAgent.jsx** - Image analysis UI (upload → display OCR/description)
- [ ] **AuditAgent.jsx** - Accessibility audit UI (upload → score gauge + issues)
- [ ] **NavigationAgent.jsx** - Route finder UI (search → map → directions)
- [ ] **OrchestratorChat.jsx** - Chat interface (message input → responses)

### Web Speech API
- [ ] **useSpeechToText.js** - Hook for speech recognition
- [ ] **useTextToSpeech.js** - Hook for text-to-speech
- [ ] **TTSButton.jsx** - Button to read text aloud
- [ ] **LoadingAgent.jsx** - Loading spinner component

---

## 🟠 HIGH PRIORITY - BEFORE DEMO (3-4 hours)

### Backend Fixes
- [ ] **Audit response format**: Return structured `{title, severity, description}`
- [ ] **Chat file upload**: Support multimodal chat (text + image)
- [ ] **MIME type detection**: Auto-detect JPEG vs PNG

### Frontend Enhancements
- [ ] **Error toast notifications**: Show user-friendly errors
- [ ] **Google Maps embed**: Visual map in Navigation page
- [ ] **CameraFeed.jsx**: Video feed for sign language (bonus)

### Testing
- [ ] **Test with real Gemini API key**: Verify all agents work
- [ ] **Test image uploads**: Check vision and audit endpoints
- [ ] **Test navigation**: Verify routes work for Indian cities

---

## 🟡 MEDIUM PRIORITY - NICE TO HAVE (2-3 hours)

### Code Cleanup
- [ ] **Remove duplicate models**: Clean up `models.py`
- [ ] **Randomize nav fallback**: Generate dynamic mock routes
- [ ] **Add docstrings**: Document all functions
- [ ] **Add Indian standards**: Update audit prompt with RPwD Act references

### Testing & Quality
- [ ] **Mock Gemini API**: Add mocked tests
- [ ] **Increase test coverage**: Aim for 80%
- [ ] **Screen reader test**: Verify accessibility
- [ ] **Keyboard navigation test**: Test Tab/Enter navigation

---

## 🎯 PRE-DEMO CHECKLIST

### Environment Setup
- [ ] Backend `.env` has `GEMINI_API_KEY` (get from Google AI Studio)
- [ ] Frontend `.env` has `VITE_API_URL=http://localhost:8000`
- [ ] Both servers running: Backend (8000), Frontend (5173)

### Feature Testing
- [ ] **Chat**: Send message → get agent routing response
- [ ] **Vision**: Upload image → see OCR text + description
- [ ] **Audit**: Upload building image → see score + issues + fixes
- [ ] **Navigation**: Enter destination → see route steps
- [ ] **Health**: `/health` endpoint returns 200

### Demo Script
- [ ] Prepare 2-3 sample images (text sign, building entrance)
- [ ] Write demo narrative (persona: person with disability)
- [ ] Test full user journey (chat → vision → nav → audit)
- [ ] Prepare fallback demo (if APIs fail)
- [ ] Time demo (aim for 5-7 minutes)

---

## 📋 IMMEDIATE ACTION PLAN

### Hour 1-2: Core Frontend
```bash
cd accessindia-web/src/components/Shared
# Create:
# - FileDrop.jsx (file upload with drag-drop)
# - TTSButton.jsx (speak text aloud)
# - LoadingAgent.jsx (loading spinner)
```

### Hour 3-4: Agent UIs
```bash
cd accessindia-web/src/components/Agents
# Create:
# - VisionAgent.jsx (image → OCR)
# - AuditAgent.jsx (image → score)
# - NavigationAgent.jsx (destination → route)
```

### Hour 5-6: Web Speech API
```bash
cd accessindia-web/src/hooks
# Create:
# - useSpeechToText.js
# - useTextToSpeech.js
# - useGeolocation.js
```

### Hour 7-8: Integration & Testing
```bash
# Wire up components to API
# Test each feature end-to-end
# Fix bugs
# Polish UI
```

---

## 🚀 LAUNCH COMMANDS

### Start Backend
```bash
cd accessindia-api
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn app.main:app --reload --port 8000
```

### Start Frontend
```bash
cd accessindia-web
npm run dev
```

### Run Tests
```bash
# Backend
cd accessindia-api
pytest tests/ -v

# Frontend
cd accessindia-web
npm test
```

---

## 🔧 TROUBLESHOOTING

### Backend won't start
- [ ] Check `.env` file exists
- [ ] Run `pip install -r requirements.txt`
- [ ] Check port 8000 not in use: `lsof -i :8000`

### Frontend won't start
- [ ] Run `npm install`
- [ ] Check `.env` file exists
- [ ] Check port 5173 not in use

### Vision/Audit not working
- [ ] Verify `GEMINI_API_KEY` in `.env`
- [ ] Check API quota at Google AI Studio
- [ ] Test with small image (<1MB)

### Navigation not working
- [ ] Check internet connection (uses OSM APIs)
- [ ] Try fallback route (should always work)
- [ ] Check destination is in India

---

## 📞 GETTING HELP

### Error Messages

**"ModuleNotFoundError: No module named 'app.routers.speech'"**
→ Already fixed. Update `app/main.py`

**"gemini-2.5-flash not found"**
→ Already fixed. Check `app/agents/*.py` for correct model name

**"GEMINI_API_KEY is required"**
→ Add to `accessindia-api/.env`

**"CORS error"**
→ Check backend running on port 8000
→ Verify frontend .env has correct `VITE_API_URL`

### Resources
- Backend docs: http://localhost:8000/docs
- Gemini API: https://ai.google.dev/
- OSM APIs: https://nominatim.org/, https://project-osrm.org/
- React docs: https://react.dev/

---

## ✅ DEFINITION OF DONE

A feature is "done" when:
- [ ] Code written and tested locally
- [ ] No console errors
- [ ] Works with AND without API key (fallback)
- [ ] Responsive on mobile/desktop
- [ ] Keyboard accessible
- [ ] Error handling in place

Demo is "ready" when:
- [ ] All 4 agents have working UIs
- [ ] Can upload images successfully
- [ ] Can see results displayed
- [ ] Backend + Frontend run without errors
- [ ] Demo script tested end-to-end

---

**Priority**: Focus on getting ONE complete feature working end-to-end first (Vision Agent recommended), then move to others.

**Time Estimate**: 6-8 hours to completion

**Good luck, Team Coin Hustlers! 🚀**

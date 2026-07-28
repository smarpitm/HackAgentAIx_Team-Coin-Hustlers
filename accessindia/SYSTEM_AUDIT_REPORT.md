# AccessIndia AI - System Audit Report

**Date:** January 2025  
**Team:** Coin Hustlers  
**Hackathon:** HackAgentAIx 2026

---

## Executive Summary

This audit identifies **critical flaws**, **hardcoded outputs**, **missing features**, and **implementation gaps** in the AccessIndia AI multi-agent platform.

### Severity Levels
- 🔴 **CRITICAL**: System-breaking, must fix immediately
- 🟠 **HIGH**: Major functionality issue, fix before demo
- 🟡 **MEDIUM**: Quality/UX issue, fix if time permits
- 🟢 **LOW**: Nice-to-have improvement

---

## 1. BACKEND ISSUES

### 1.1 Configuration Issues 🔴 CRITICAL

**Problem**: `config.py` uses wrong pattern for pydantic-settings v2
```python
# CURRENT (WRONG)
class Settings(BaseSettings):
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    class Config:
        env_file = ".env"
```

**Issues**:
- Using `os.getenv()` defeats the purpose of pydantic-settings
- Default empty string `""` means missing API key won't raise error
- Not using `SecretStr` for sensitive data (as per requirements)

**Fix Required**:
```python
from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False
    )
    
    gemini_api_key: SecretStr = Field(..., description="Gemini API key")
    google_maps_api_key: SecretStr = Field(..., description="Google Maps API key") 
    cors_origins: str = Field(default="http://localhost:5173")
    port: int = Field(default=8000)
```

---

### 1.2 Orchestrator Issues 🟠 HIGH

**Problem 1**: Uses wrong Gemini model name
```python
model = genai.GenerativeModel("gemini-2.5-flash")  # ❌ WRONG
```
Should be:
```python
model = genai.GenerativeModel("gemini-1.5-flash")  # ✅ CORRECT
```

**Problem 2**: Hardcoded fallback messages
```python
"message": "Hello! I am AccessIndia AI Orchestrator. How can I assist you today?..."
```
This is acceptable for fallback, but should be configurable.

**Problem 3**: Missing image handling in orchestrator
The `has_image` parameter exists but image bytes are never passed to Gemini for multimodal analysis.

---

### 1.3 Vision Agent Issues 🟠 HIGH

**Problem 1**: Wrong model name (same as orchestrator)
```python
model = genai.GenerativeModel("gemini-2.5-flash")  # ❌
```

**Problem 2**: Hardcoded MIME type
```python
"mime_type": "image/jpeg",  # Always assumes JPEG
```
Should detect actual image type from file header or accept PNG too.

**Problem 3**: Empty fallback response
```python
return {
    "ocr_text": "",
    "description": "Unable to analyze image at this time.",
    "detected_items": [],
    "confidence": 0.0
}
```
Provides no value to user when API fails.

---

### 1.4 Audit Agent Issues 🟠 HIGH

**Problem 1**: Wrong model name
```python
model = genai.GenerativeModel("gemini-2.5-flash")  # ❌
```

**Problem 2**: Simplified response format
Audit agent returns `List[str]` for issues/fixes instead of structured objects with severity, cost, etc.

**Expected**:
```python
{
    "issues": [
        {"title": "No ramp", "severity": "critical", "description": "..."}
    ],
    "fixes": [
        {"title": "Install ramp", "cost": "₹50,000-₹75,000", "description": "..."}
    ]
}
```

**Actual**:
```python
{
    "issues": ["Unable to analyze..."],  # Just strings
    "fixes": ["Please try..."]
}
```

---

### 1.5 Navigation Agent Issues 🟢 LOW

**✅ GOOD**: Uses free OSM APIs (Nominatim + OSRM + Overpass)  
**✅ GOOD**: Has working fallback  
**✅ GOOD**: Returns structured step-by-step directions

**Minor Issue**: Fallback route is completely hardcoded
```python
def _fallback_route(self):
    return NavRouteResponse(
        distance="2.3 km",  # Always same values
        duration="28 min",
        steps=[...] # Always same 5 steps
    )
```

Better: Generate randomized mock data based on origin/dest distance.

---

### 1.6 Models.py Issues 🟡 MEDIUM

**Problem**: Duplicate/inconsistent model definitions

There are TWO sets of navigation models:
1. `NavRouteRequest`, `NavRouteStep`, `NavRouteResponse` (used by navigation_agent)
2. `NavRequest`, `NavStep`, `NavResponse` (unused, different structure)

**Fix**: Remove unused models, consolidate.

Also TWO chat models:
1. `ChatRequest`, `ChatResponse` (used)
2. `ChatMessageRequest`, `OrchestratorResponse` (unused)

**Fix**: Delete unused models to reduce confusion.

---

### 1.7 Missing Router 🔴 CRITICAL

**Problem**: `app/routers/speech.py` is imported in `main.py` but doesn't exist!

```python
# main.py line 7
from app.routers import chat, vision, navigation, audit, speech  # ❌ speech doesn't exist
```

**Impact**: Backend won't start - `ModuleNotFoundError: No module named 'app.routers.speech'`

**Fix**: Either:
1. Create `app/routers/speech.py` with TTS/STT endpoints
2. Remove import from main.py (communication is frontend-only using Web Speech API)

---

### 1.8 Prompt Engineering Issues 🟡 MEDIUM

**app/utils/prompts.py**

**Problem 1**: VISION_PROMPT asks for JSON but doesn't enforce it
```python
VISION_PROMPT = """...
Return ONLY valid JSON:
{
  "ocr_text": "...",
  ...
}"""
```
Gemini often adds markdown code fences. Current code strips them, but could fail.

**Better approach**: Use JSON mode or add stricter parsing.

**Problem 2**: AUDIT_PROMPT is very generic
Doesn't reference specific Indian accessibility standards like:
- RPwD Act 2016
- CPWD Guidelines
- NBC 2016 accessibility codes

**Enhancement**: Add specific compliance criteria to prompt.

---

## 2. FRONTEND ISSUES

### 2.1 Missing Component Files 🔴 CRITICAL

The skeleton created placeholder structure but **no actual React components** were implemented!

**Missing**:
- `src/components/Agents/OrchestratorChat.jsx`
- `src/components/Agents/VisionAgent.jsx`
- `src/components/Agents/CommunicationAgent.jsx`
- `src/components/Agents/NavigationAgent.jsx`
- `src/components/Agents/AuditAgent.jsx`
- `src/components/Shared/FileDrop.jsx`
- `src/components/Shared/TTSButton.jsx`
- `src/components/Shared/LoadingAgent.jsx`
- `src/components/Shared/CameraFeed.jsx`
- `src/hooks/useSpeechToText.js`
- `src/hooks/useTextToSpeech.js`
- `src/hooks/useGeolocation.js`
- `src/hooks/useMediaPipe.js`
- `src/utils/gestureClassifier.js`

**Current App.jsx** just shows "Coming Soon" placeholders!

---

### 2.2 Missing .env File 🔴 CRITICAL

Frontend needs `.env` file:
```bash
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

Without this, API calls will fail.

---

### 2.3 API Service Issues 🟠 HIGH

**src/services/api.js**

**Problem 1**: `sendChat()` doesn't use the `file` parameter
```javascript
export const sendChat = async (message, file = null) => {
  try {
    const response = await api.post('/api/chat', { message })  // ❌ ignores file
    return response.data
  }
```

**Fix**: Add file upload support:
```javascript
export const sendChat = async (message, file = null) => {
  try {
    const formData = new FormData()
    formData.append('message', message)
    if (file) formData.append('file', file)
    
    const response = await api.post('/api/chat', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  }
```

**Problem 2**: No error handling UI
Errors are caught but only logged to console. Should show toast/alert to user.

---

### 2.4 Store Issues 🟡 MEDIUM

**src/store/useAppStore.js**

**Issue**: Store structure is good, but `activeAgent` is never used anywhere since no agent components exist yet.

---

## 3. INFRASTRUCTURE ISSUES

### 3.1 Requirements.txt Issues 🟠 HIGH

**Missing dependencies**:
```
Pillow  # Required for image processing in Vision/Audit agents
```

**Version conflicts**:
- Uses `google-generativeai==0.3.2` (very old)
- Should use `google-generativeai>=0.8.0` for latest Gemini features

---

### 3.2 Testing Issues 🟡 MEDIUM

**Backend tests** (`tests/test_*.py`) exist but are incomplete:
- Tests assume API keys are available
- No mocking of Gemini API
- No tests for navigation fallback logic

**Frontend tests**: Don't match actual component structure

---

### 3.3 CORS Configuration 🟡 MEDIUM

**config.py**:
```python
CORS_ORIGINS: str = "http://localhost:5173,..."
```

**main.py**:
```python
allow_origins=settings.CORS_ORIGINS.split(","),
```

This works but is fragile. Better to use `List[str]` in settings.

---

## 4. ACCESSIBILITY COMPLIANCE ISSUES

### 4.1 Missing ARIA Labels 🟠 HIGH

**Current Sidebar.jsx**:
```jsx
<NavLink to={path} aria-label={`Navigate to ${label}`}>
```
✅ Good!

But other components don't exist yet, so can't audit them.

### 4.2 Keyboard Navigation 🟡 MEDIUM

No keyboard shortcuts implemented for common actions:
- No `Tab` navigation testing
- No `Enter` key handling on interactive elements
- No focus trap in modals

---

## 5. SECURITY ISSUES

### 5.1 API Key Exposure 🔴 CRITICAL

**Problem**: If frontend calls backend and backend logs errors, API keys could leak in logs.

**Fix**: Already using `SecretStr` in requirements.md, but not in actual config.py.

### 5.2 No Rate Limiting 🟡 MEDIUM

Backend has no rate limiting. In production, this could be abused.

**Recommendation**: Add `slowapi` or similar for rate limiting.

---

## 6. FEATURE COMPLETENESS

### 6.1 Working Features ✅

| Feature | Status | Notes |
|---------|--------|-------|
| Backend API structure | ✅ Complete | All routers defined |
| Orchestrator (fallback) | ✅ Working | Keyword-based routing works |
| Navigation (OSM) | ✅ Working | Uses free APIs |
| Health check | ✅ Working | `/health` endpoint |
| CORS | ✅ Working | Configured correctly |

### 6.2 Partially Working Features ⚠️

| Feature | Status | Issues |
|---------|--------|--------|
| Vision Agent | ⚠️ Partial | Wrong model name, needs API key |
| Audit Agent | ⚠️ Partial | Wrong model name, simplified output |
| Orchestrator (AI) | ⚠️ Partial | Wrong model name |
| Frontend Layout | ⚠️ Partial | Sidebar/Header done, no content |

### 6.3 Missing Features ❌

| Feature | Status | Priority |
|---------|--------|----------|
| Frontend Agent UIs | ❌ Missing | 🔴 CRITICAL |
| Speech-to-Text | ❌ Missing | 🔴 CRITICAL |
| Text-to-Speech | ❌ Missing | 🔴 CRITICAL |
| Sign Language | ❌ Missing | 🟠 HIGH |
| Communication Router | ❌ Missing | 🟡 MEDIUM |
| File Upload UI | ❌ Missing | 🔴 CRITICAL |
| Google Maps embed | ❌ Missing | 🟠 HIGH |

---

## 7. HARDCODED OUTPUTS - DETAILED LIST

### 7.1 Orchestrator Fallback Messages
```python
# orchestrator.py lines 40-80
"Routing to Vision Agent to analyze visual elements..."
"Routing to Navigation Agent to find wheelchair-accessible paths..."
"Hello! I am AccessIndia AI Orchestrator. How can I assist you today?..."
```
**Status**: ✅ ACCEPTABLE (these are fallback messages)

### 7.2 Navigation Fallback Route
```python
# navigation_agent.py _fallback_route()
distance="2.3 km"
duration="28 min"
steps=[
    "Start at current location",
    "Head north on Main Road...",
    ...
]
```
**Status**: 🟡 IMPROVE (should randomize based on input)

### 7.3 Vision/Audit Fallback
```python
# vision_agent.py
"Unable to analyze image at this time."

# audit_agent.py
"Unable to analyze accessibility at this time."
```
**Status**: ✅ ACCEPTABLE (graceful degradation)

---

## 8. PRIORITY FIX LIST

### Must Fix Before Demo (🔴 CRITICAL)

1. **Fix config.py** - Use proper pydantic-settings pattern with SecretStr
2. **Remove speech router import** - Backend won't start
3. **Fix Gemini model names** - Change "gemini-2.5-flash" → "gemini-1.5-flash"
4. **Add Pillow to requirements.txt**
5. **Create frontend .env file**
6. **Build core frontend components**:
   - FileDrop.jsx
   - VisionAgent.jsx
   - AuditAgent.jsx
   - NavigationAgent.jsx
   - OrchestratorChat.jsx

### Fix Before Submission (🟠 HIGH)

7. **Fix audit agent response format** - Return structured issues/fixes
8. **Add image MIME type detection**
9. **Fix sendChat() to handle file uploads**
10. **Add error toast/alert UI**
11. **Implement Web Speech API hooks**
12. **Add Google Maps embed**

### Nice to Have (🟡 MEDIUM)

13. **Improve navigation fallback** - Randomized mock data
14. **Clean up duplicate models** in models.py
15. **Add Indian accessibility standards** to audit prompt
16. **Improve error messages** with actionable guidance
17. **Add rate limiting**
18. **Mock Gemini API in tests**

---

## 9. TESTING CHECKLIST

### Backend Testing

- [ ] Health check returns 200
- [ ] Chat endpoint without API key uses fallback
- [ ] Chat endpoint with API key calls Gemini
- [ ] Vision endpoint rejects non-image files
- [ ] Vision endpoint handles large files
- [ ] Audit endpoint returns score 0-100
- [ ] Navigation route returns step-by-step directions
- [ ] Nearby search returns list of places
- [ ] CORS allows localhost:5173

### Frontend Testing

- [ ] App loads without errors
- [ ] Sidebar navigation works
- [ ] Can upload image file
- [ ] Can send chat message
- [ ] Loading states show correctly
- [ ] Error messages display
- [ ] TTS button reads text aloud
- [ ] STT captures speech
- [ ] Keyboard navigation works
- [ ] Screen reader compatible

---

## 10. RECOMMENDATIONS

### Architecture
✅ **Good**: Separation of agents, clear routing logic  
✅ **Good**: Fallback strategies for API failures  
✅ **Good**: Using free APIs (OSM) where possible  

⚠️ **Improve**: Add logging/telemetry for debugging  
⚠️ **Improve**: Add health checks for external APIs  
⚠️ **Improve**: Separate prompts into versioned files  

### Code Quality
✅ **Good**: Type hints in Python  
✅ **Good**: Pydantic models for validation  
✅ **Good**: Clear file structure  

⚠️ **Improve**: Add docstrings to all functions  
⚠️ **Improve**: Add unit tests for all agents  
⚠️ **Improve**: Use environment-based configs  

### Accessibility
✅ **Good**: ARIA labels on navigation  
✅ **Good**: Focus styles in CSS  
✅ **Good**: Semantic HTML planned  

⚠️ **Improve**: Test with screen reader  
⚠️ **Improve**: Add skip links  
⚠️ **Improve**: Ensure color contrast ratios  

---

## 11. ESTIMATED FIX TIME

| Priority | Tasks | Time Est. |
|----------|-------|-----------|
| 🔴 Critical | 6 items | 4-6 hours |
| 🟠 High | 6 items | 3-4 hours |
| 🟡 Medium | 6 items | 2-3 hours |
| **Total** | **18 items** | **9-13 hours** |

---

## CONCLUSION

The AccessIndia AI platform has a **solid architectural foundation** but **requires significant implementation work** to be demo-ready:

**✅ Strengths**:
- Well-structured multi-agent design
- Proper fallback mechanisms
- Good use of free APIs (OSM)
- Clean separation of concerns

**❌ Critical Gaps**:
- Wrong Gemini model names (will cause API failures)
- Missing speech router (prevents backend startup)
- No frontend agent UIs (only placeholders)
- Configuration issues with pydantic-settings

**🎯 Recommendation**: Focus on the 6 critical fixes first to get a **working end-to-end demo**, then iterate on high-priority items.

---

**Audit completed by**: Kiro AI  
**Next steps**: Address critical issues, then test end-to-end flow

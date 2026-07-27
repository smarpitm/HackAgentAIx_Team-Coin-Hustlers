# AccessIndia AI — End-to-End Test Checklist

> Before submission, manually verify each item below. Mark with ✅ or ❌.

## 1. App Load & Theme
- [ ] App loads with dark theme (`bg-slate-900`, white text)
- [ ] Skip-to-content link appears on first tab press
- [ ] Header displays correct agent title for each route

## 2. Sidebar & Navigation
- [ ] Desktop sidebar shows all 5 agents: Chat, Vision, Communication, Navigation, Audit
- [ ] Mobile bottom nav bar shows 5 icon tabs (hidden on desktop)
- [ ] Clicking each nav item navigates to the correct route
- [ ] Active nav item is highlighted in orange

## 3. Chat (Orchestrator)
- [ ] Welcome message displays when chat is empty
- [ ] Type a message → orchestrator responds
- [ ] Agent response shows agent name badge and confidence score
- [ ] TTS button reads agent response aloud
- [ ] Mic button toggles speech-to-text
- [ ] Speech transcript appears in input field
- [ ] Offline/API error shows friendly fallback message

## 4. Vision Agent
- [ ] Upload an image → OCR text + description + detected objects appear
- [ ] Image preview displays before analysis
- [ ] TTS button reads OCR text and description
- [ ] Loading spinner shows during analysis
- [ ] API unavailable → demo data loads with "Demo" badge
- [ ] FileDrop accepts drag-and-drop and click-to-upload

## 5. Communication Agent
- [ ] Speech tab: mic button records → transcript appears
- [ ] Transcript can be read aloud with TTS
- [ ] Sign tab: camera activates on button click → detected gesture shows
- [ ] Tab switching works (Speech ↔ Sign Language)
- [ ] Supported gestures grid displays correctly

## 6. Navigation Agent
- [ ] Search for a destination → route details appear
- [ ] Step-by-step directions show numbered steps with distance & duration
- [ ] Nearby facilities card lists places with rating
- [ ] Geolocation status shows (or fallback message if denied)
- [ ] API unavailable → demo route data loads with "Demo" badge
- [ ] All step cards display accessible checkmark

## 7. Audit Agent
- [ ] Upload a building photo → score gauge animates to result
- [ ] Score bar fills from 0% to score value
- [ ] Color coding: red (0-40), amber (41-70), green (71-100)
- [ ] Issues card lists identified barriers
- [ ] Fixes card shows numbered recommendations
- [ ] TTS reads audit report
- [ ] API unavailable → demo audit data loads with "Demo" badge

## 8. Mobile Responsiveness
- [ ] Sidebar collapses to bottom tab bar on screens < 768px
- [ ] All buttons have minimum 44px touch target
- [ ] Font sizes are readable on small screens (no overflow)
- [ ] Image previews scale to screen width
- [ ] Chat bubbles are full width on mobile
- [ ] Score gauge scales proportionally
- [ ] All cards stack vertically on narrow screens

## 9. Accessibility (WCAG AA)
- [ ] Skip-to-content link works (first Tab press)
- [ ] All icon buttons have `aria-label`
- [ ] All images have `alt` text
- [ ] Color is never the sole indicator (paired with icon or text)
- [ ] Focus-visible rings appear on all interactive elements
- [ ] Tab order is logical through the page
- [ ] Contrast ratio sufficient for all text (4.5:1 minimum)

## 10. Error Handling
- [ ] Backend offline → chat shows friendly message
- [ ] Vision API fails → demo data loads gracefully
- [ ] Navigation API fails → demo route shows
- [ ] Audit API fails → demo audit shows
- [ ] "Demo" badge appears when using fallback data
- [ ] Toast notification appears for non-critical errors

## 11. Console
- [ ] Zero console errors (open DevTools Console)
- [ ] Zero uncaught exceptions in any agent

---

**Tested by:** _________________ **Date:** _________________ **Result:** ✅ / ❌

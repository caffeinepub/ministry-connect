# Specification

## Summary
**Goal:** Build a mobile-first ministry prayer app where signed-in users can submit prayers and receive deterministic, compassionate “AI-style” responses, and review their prayer history.

**Planned changes:**
- Create a mobile-first React UI with consistent navigation: Home, Submit Prayer, Prayer History, Prayer Detail.
- Add Internet Identity sign-in/sign-out and gate prayer submission/history behind authentication.
- Implement Submit Prayer flow with multiline input, submit action, and loading/error states; display the generated response after submit.
- Build a single Motoko-actor backend that stores prayers per authenticated principal and returns stored data only to its owner.
- Implement deterministic on-chain response generation using templates + keyword/category matching (no external AI/LLM calls).
- Add Prayer History (newest-first list) and Prayer Detail (prayer text, timestamps, response text, response timestamp if stored).
- Define and apply a calm, contemplative visual theme using Tailwind and existing UI components (without editing read-only component sources).
- Add required static theme images under `frontend/public/assets/generated` and render them in the UI (hero/background on Home; icon/mark in header or Home branding).

**User-visible outcome:** Users can sign in with Internet Identity, submit a prayer request, immediately see a ministry-appropriate generated response, and browse/view their own past prayers and responses in a calm, mobile-friendly interface.

Foldrone Play v0.3.3
Corrected modern rebuild.

Key changes:
- Switching Play/Studio while media is playing never hides, destroys or replaces the active media element.
- Studio becomes a floating creator dock over the shared player instead of replacing the playback surface.
- Foldrone Play branding appears in the header and cinematic media-preparation screen.
- Modern icon-based player HUD with PiP, fullscreen, captions, framing and close controls.
- Sound and Video modes cycle directly while watching. Each change produces a temporary top-right mode capsule.
- Video framing: Original, Fit Screen, Fill Screen, zoom and X/Y adjustment, plus Back to Original.
- Native playback remains the default path. Audio processing is only attached after an enhancement mode is explicitly selected.
- Service-worker cache is v0.3.3.
- Spatial audio and AI video are intentionally not falsely claimed as fully implemented. The current web foundation uses safe browser-capable processing and is ready for dedicated Media Core engines.

Foldrone Play v0.3.1
Clean web foundation.

Goals:
- Single source of truth for top-level UI. No JS-injected duplicate panels.
- Native media playback path remains untouched unless enhancement is explicitly selected.
- Clean media lifecycle when switching/reopening files.
- Cinematic "Preparing Media…" state.
- Responsive, overflow-safe layout across phone/tablet/desktop/ultrawide.
- Play / Studio are modes, not separate apps.
- Adaptive capability snapshot prepared for the shared Adaptive Experience Engine.
- Audio/video enhancement controls are architectural placeholders with conservative local browser processing.
- Spatial/3D/AI features are capability-gated future Media Core modules, not falsely claimed to be fully implemented by this web build.

Deployment:
npx wrangler deploy

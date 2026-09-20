FOLDRONE PLAY v0.4.7 — PRECISION MICRO REFINEMENT

Changes
- Homepage headline: “Unbound Playback | One Fluid Space”
- Homepage description: “The next evolution in media playback. Intelligent audio tuning and crisp visuals, crafted for absolute clarity.”
- Removed the “drop media or subtitle files anywhere” instruction and global drag/drop handling.
- Kept the CC+ Load Subtitles control as the single visible subtitle action; removed the separate CC button.
- Load Subtitles supports local SRT/VTT/ASS/SSA selection.
- Added an online subtitle provider chooser with OpenSubtitles, SubDL, Addic7ed, Podnapisi and DownSub links.
- Existing CC engine, subtitle matching and auto-CC behavior remain unchanged.
- URL input continues to clear immediately after submission.
- Preserved universal responsive player, audio-only visualizer, touch playback zones, queue/transport controls, PWA and existing cinematic experience.
- Added a Cloudflare Worker security layer with CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-Frame-Options and controlled iframe origins.
- No provider API key or secret is shipped to the browser.
- Added /api/health for a minimal deployment health check.

Security architecture
- Browser code contains no provider credentials.
- Online subtitle API integrations should use server-side/provider adapters with secrets stored as Cloudflare Worker secrets.
- CSP permits only the external origins required by current media/embedding functionality.
- Provider pages are opened with noopener/noreferrer semantics.

Subtitle note
The online provider chooser intentionally does not scrape or proxy third-party subtitle sites from the browser. Automatic provider search/download can be added through a server-side adapter once the selected provider credentials and terms permit it.

Cloudflare
- Worker entry: worker.js
- Static assets binding: ASSETS
- Wrangler deploy: npx wrangler deploy

- Updated browser/media-session artwork to the current Foldrone Play mark.
- Transport controls are icon-only: Previous, Stop, Next, Mute, Repeat and Fullscreen labels removed.
- Added long-press text/image selection protection for the central Foldrone Play mark.
- No landscape framing/animation behavior changed.


Phase 1 completion refinement
- Preserves the v0.4.7 UI and CC+ workflow.
- Fixes the mobile top-action row so the Fullscreen control remains fully inside the player.
- Adds CC subtitle timing offset controls without changing the CC+ button.
- Supports -0.1s / +0.1s fine adjustment, -1s / +1s coarse adjustment, and Reset.
- Timing is session-local and applied to the active subtitle track without modifying the source subtitle file.
- Embedded and locally loaded text tracks are supported where the browser exposes writable cue timing.
- Playback, audio, video, PWA, URL, casting behavior, and existing security architecture are otherwise unchanged.

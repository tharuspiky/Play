FOLDRONE PLAY v0.4.6 — UNBOUND PLAYBACK MICRO REFINEMENT

Changes
- Homepage headline: “Unbound Playback | One Fluid Space”
- Homepage description: “The next evolution in media playback. Intelligent audio tuning and crisp visuals, crafted for absolute clarity.”
- Removed the “drop media or subtitle files anywhere” instruction and global drag/drop handling.
- Added a dedicated Load Subtitles control.
- Load Subtitles supports local SRT/VTT/ASS/SSA selection.
- Added an online subtitle provider chooser with OpenSubtitles, SubDL, Addic7ed, Podnapisi and DownSub links.
- Kept CC itself as the direct cycle control.
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

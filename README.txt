Foldrone Play v0.4.3 — Cinematic Adaptive Pass

Changes:
- Removed the intrusive CC popover. CC is now a pure cycle control.
- Subtitle files can be dropped anywhere while a video is open.
- Removed duplicate bottom playback-speed button; top speed control remains.
- Stronger, more audible Sound modes with persistent Web Audio routing and safer PiP/background resume.
- Video Quality modes now visibly differentiate Original Quality / Natural / Enhanced / Ultra Quality.
- Homepage uses the supplied Foldrone Labs artwork.
- Homepage ambient weather animation uses geolocation + Open-Meteo when permission is granted; otherwise time/ambient adaptation remains active.
- Removed landscape lock control.
- Preparing Media keeps the supplied Foldrone artwork.
- Width remains a cycle: Original → Fit Screen → Fill Screen → Wide.
- Public URL playback supports direct media URLs plus official embeds where providers permit them.

Important capability notes:
- Browser/PWA PiP support is platform controlled. The player now resumes its audio context around PiP/background transitions, but a browser cannot be forced to provide PiP when the platform denies it.
- Online subtitle auto-download requires a subtitle provider/API. v0.4.3 keeps the local/embedded CC engine provider-neutral rather than scraping protected services.
- YouTube/TikTok/Facebook embeds remain provider-controlled and cannot be wrapped with overlays that obscure their own player UI.

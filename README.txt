FOLDRONE PLAY v0.3 COMPLETE
=============================

This is the COMPLETE root project, not a patch fragment.

Files:
- index.html        complete UI
- styles.css        complete UI styles
- v03.js            adaptive media layer
- sw.js             refreshed service worker
- manifest.webmanifest
- wrangler.jsonc
- Foldrone Play + Studio logo assets
- Play/Studio PNG icons

IMPORTANT:
1. Upload/replace these files in the ROOT of the existing GitHub repo.
2. Commit to main.
3. Cloudflare Worker should redeploy automatically.
4. If iPhone Safari shows an older version, close/reopen the tab or clear the site's cached PWA/service worker.

Privacy/bandwidth:
- Local media is played from the selected local file and is not uploaded for playback.
- Weather is optional and makes a small API request only after location permission.
- Casting uses platform routing where available. A true Foldrone local-file receiver is a future Media Core component.
- Cloud AI/ASR is not silently invoked.

v0.3 includes:
- responsive landscape video rendering
- local SRT/VTT auto-matching
- CC controls
- audio boost
- ambient UI fallback
- optional weather context
- Google Cast sender integration where supported
- AirPlay routing where supported
- Studio voice recording foundation

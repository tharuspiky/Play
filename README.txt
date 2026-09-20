FOLDRONE PLAY v0.4.2 — CINEMATIC / ADAPTIVE PLAYBACK PASS

Changes:
• Fixed the repeat sound-delay bug by keeping one AudioContext and one MediaElementSource per media element. Sound modes are now rewired instead of cloning/recreating the media element.
• Removed landscape lock control.
• Screen Width is now a direct cycle: Original → Fit Screen → Fill Screen → Wide → Original.
• Playback Speed is visible in the player action row as well as the bottom HUD.
• Renamed/clarified video enhancement as Video Quality: Original Quality → Natural → Enhanced → Ultra Quality.
• Replaced the old black player background with a peacock/aurora adaptive media backdrop. For local video, Foldrone samples a frame and uses a blurred ambient backdrop behind the content.
• Preparing screen uses the supplied Foldrone Labs image as the startup/preparing artwork.
• CC remains a direct cycle toggle and supports drag/drop or file-picker subtitle loading.
• CC supports embedded tracks and sidecar SRT/VTT/ASS/SSA matching.
• Public URL entry added. Direct media URLs play natively; YouTube/TikTok/Facebook URLs use provider embeds when the provider permits embedding.
• No fake cast discovery or overlay.

Online subtitle note:
Automatic local/embedded subtitle selection is implemented. A truly automatic online subtitle download requires a provider API and terms-compliant access. This build opens an OpenSubtitles search for manual selection rather than pretending a no-key universal downloader exists.

Public URL note:
A generic webpage URL cannot always be converted into a raw media stream because many platforms protect their media URLs. Foldrone uses official/embed-compatible players for supported platforms instead of scraping or bypassing those restrictions.

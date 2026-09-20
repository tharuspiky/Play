Foldrone Play v0.4.1
PLAY-ONLY STABILITY / CONTROL PASS

Fixes from v0.4:
- Removed the fake/automatic "Play on nearby device" capsule. It was appearing merely because a browser API existed, not because a receiver had actually been discovered. Casting is intentionally silent until a real transport/discovery layer exists.
- Fixed Original Sound after enhanced modes. Once a MediaElementSource is created, Original now uses a unity-gain bypass path to the AudioContext destination instead of disconnecting the source and muting the media.
- CC is now a true on-player cycle control: Auto -> available embedded/sidecar language tracks -> Off.
- Auto CC checks embedded tracks and selected sidecar subtitle files.
- SRT and VTT sidecars are parsed/attached. Matching sidecars must be selected with the video on browsers that cannot access the containing folder.
- PiP is capability-gated using WebKit presentation-mode support where available, then the standard PiP API. Unsupported PiP is visually disabled instead of looking broken.
- Peacock-feather palette is applied directly to control surfaces and glyphs so icons remain readable on black.
- Screen framing remains Original / Fit / Fill / Zoom / Pan / Back to Original.
- Studio remains completely outside Play and is not present in the UI.

Web platform notes:
- Browser PiP support is platform/container dependent.
- WebVTT/TextTrack is used for timed captions.
- Generic LAN casting is not claimed without a real receiver/transport.

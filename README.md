# Foldrone Play Web + Mobile Foundation v0.2

**One player. Any media. Always evolving.**

This build is the cross-platform web foundation for Foldrone Play.

## What works now

- Mobile and desktop browser UI
- Local file picker for video, audio and image media
- Drag and drop on compatible desktop browsers
- Local object-URL playback with no upload requirement
- Video controls: play/pause, seek, skip, volume, mute, speed, fullscreen, PiP where supported
- Audio playback
- Image viewing
- Responsive mobile controls
- Installable PWA shell
- Offline app shell caching
- Foldra entry point and future intelligence contracts
- Capability manifest scaffold

## Important codec boundary

The browser build can only decode formats supported by the browser/device media stack. Selecting a file does not guarantee that a browser can decode it. The product architecture therefore separates the UI from the future native Foldrone Media Core.

## Target architecture

```text
Foldrone Play
├── Shared Product/UI Concepts
├── Foldrone Media Core API
│   ├── Playback
│   ├── Subtitle Engine
│   ├── Timeline
│   ├── Codec Registry
│   └── Capability Manager
├── Web Adapter
│   └── Browser Media APIs
├── Mobile Adapter
│   └── Native Media Engine
├── Desktop Adapter
│   └── Native Media Engine
└── Foldra Intelligence API
    ├── Local AI
    ├── Cloud AI
    └── Hybrid AI
```

The next native milestone is to implement the Media Core behind this same product contract rather than expanding browser-specific code indefinitely.

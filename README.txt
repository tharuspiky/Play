Foldrone Play v0.4
PLAY-ONLY CLEAN BUILD

Removed:
- Studio mode/UI. Studio will be introduced separately at studio.foldrone.com after Play is finalized.

Fixed / added:
- Sound cycling now restores the native media path when returning to Original.
- Sound and Video can be changed live while watching.
- Top-right transient mode confirmation capsule.
- Real browser PiP where the browser exposes it, with native WebKit fallback where available.
- Fullscreen control plus automatic immersive/fullscreen attempt on landscape transition.
- Landscape lock/unlock control using Screen Orientation API when supported.
- Modern visible icon controls with a peacock-feather inspired palette.
- Screen Framing: Original, Fit Screen, Fill Screen, zoom, horizontal/vertical adjustment, Back to Original.
- Caption engine foundation: embedded text tracks + external SRT/VTT sidecar matching.
- Auto CC checks embedded tracks and selected matching subtitle files. Sinhala filename preference is supported when multiple matching sidecars exist.
- Adaptive AirPlay playback-target capsule where WebKit exposes its native picker.
- No fake Google Cast discovery: arbitrary LAN device discovery is browser-restricted and needs a proper receiver/transport architecture.
- Cinematic preparation screen with Foldrone Play branding.
- Responsive player intended for portrait/landscape devices.
- Cache version v0.4.

Still intentionally engine-gated:
- True AI super-resolution
- Genuine object-based spatial audio
- 3D/VR rendering
- automatic speech-to-Sinhala/Tamil/English captions from raw media
- full Google Cast receiver stack

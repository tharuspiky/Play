Foldrone Play v0.4.4 • Universal Cinematic Adaptive Pass

Key changes:
- iOS/WebKit PiP-safe native media audio path. Web Audio enhancement is not instantiated on iPhone/iPad so Safari/Brave PiP can retain native media audio.
- Clear labelled Mute/Unmute control.
- Previous / Stop / Play / Back 10 / Forward 10 / Next / Repeat controls. Repeat cycles Off → Repeat Once → Repeat Track → Repeat All.
- Multi-file queue with Previous/Next and Repeat All.
- URL input clears immediately after a URL is accepted.
- Landscape video uses the full available viewport with aspect-ratio-safe contain/cover modes.
- Width cycles Original → Fit Screen → Fill Screen → Wide.
- Video Quality cycles Original Quality → Natural → Enhanced Quality → Ultra Quality.
- Sound cycles Original → Enhanced → Cinema → Spatial on browsers that support Web Audio.
- Supplied Foldrone artwork is integrated into the landing background and supplied logo artwork is used in the header.
- Weather ambience remains an environmental layer rather than a card.
- CC remains a direct cycle control and supports drag/drop sidecars.

Important platform note:
Web browsers cannot guarantee audio processing through iOS PiP when a media element is routed through Web Audio. v0.4.4 prioritizes native iOS media/PiP reliability over browser-side DSP on iOS.

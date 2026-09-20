Foldrone Play v0.4.5
Universal Cinematic Experience Pass

Key changes:
- Uses supplied full Foldrone Play header logo and supplied transparent Foldrone Play mark.
- Landing environment no longer uses the previous large background artwork. The Play mark is integrated into the ambient background.
- Audio-only playback gets a cinematic animated Foldrone Play visual instead of a blank stage.
- Preparing Media uses the supplied Play mark with animated glow/rings.
- Sound and Video Quality controls are always visible above transport controls on mobile.
- Play/Pause can be triggered by touching the center of the media stage.
- Touch left 30% seeks back 10 seconds; right 30% seeks forward 10 seconds.
- Transport controls have stronger Play priority and intentionally relaxed/staggered visual rhythm.
- Clear speaker mute/unmute control.
- CC remains cycle-based with no popup.
- Universal viewport sizing uses small viewport units and landscape-specific sizing.
- Weather animation is scoped to the landing environment and does not cover playback.
- Subtitle renderer no longer depends on a removed popup panel.

Platform note:
On iOS/iPadOS, native media playback is intentionally kept free of Web Audio processing to protect PiP/background playback reliability. Safari/WebKit still controls whether PiP audio remains active after the browser is minimized.

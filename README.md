# WasmVideoEncoder
A videoencoder for the browser using FFmpeg with WebAssembly

Currently encodes raw image and audio data, and muxes into a mp4/mp3 format.

Wasm: 2.5MB, JS: 120KB
Encodes at: (capped at 60fps)

2k video ~20FPS in Firefox, ~13FPS in Chrome 
720p at 37FPS in Firefox, 27 FPS in Chrome
480p at cap (60FPS) in Firefox, cap in Chrome

Example usage in src/Canvas.js

### TODOs
- Fix/Add build to project
- Better animations demo
- Custom sound for demo
- Offscreen Canvas example for demo
- Fix worker memory usage ( reads the canvas faster than it encodes -> frames stack up -> memory out of bounds ) 
- input checking
- smaller wasm/js
- better README
- h265/vp9/vp8/other codec support
- benchmarks

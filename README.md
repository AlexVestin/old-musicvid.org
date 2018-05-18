# WasmVideoEncoder
A video encoder for the browser using FFmpeg with WebAssembly in super early development

[Demo website](https://alexvestin.github.io/WasmVideoEncoder/)
Currently encodes raw image and audio data, and muxes into an libx264 format.

Currently a placeholder project for the encoder, using this git for a video editor, making additions to the encoder when needed.
However it will be moved to a seperate when the editor/encoder are readyn for use.


### TODOs
- Add working example
- Move videoediting stuff to new repo
- ~~Fix/Add build to project~~ (src/webassembly/build/em)
- ~~Better animations demo~~
- ~~Custom sound option for demo~~
- ~~Fix worker memory usage ( reads the canvas faster than it encodes -> frames stack up -> memory out of bounds )~~
- input checking
- ~~~smaller wasm/js~~
- better README
  - benchmarks
  - images
- h265/vp9/vp8/other codec support (sort of)
- ~~interleaved audio/video writing ~~
- ~~C code improvements (memory management, simplify code)~~
- Offscreen Canvas example for demo

### LICENSE
- ffmpeg/libx is under GPL/LGPL
- lame is LGPL
- The rest is MIT (of the code I wrote)

### Build
Makefile & patches from ffmpeg.js / videoencoder.js
~~

# WasmVideoEncoder
A video encoder for the browser using FFmpeg with WebAssembly in super early development

[Demo website](https://alexvestin.github.io/WasmVideoEncoder/)

Currently encodes raw image and audio data, and muxes into a mp4/mp3 format.

Wasm: 1985KB, JS: 25KB (or 730KB respectively 10KB when zipped!)

### Example usage
Example is using the worker version, which has reversed control (ie. the encoder calls for the animation function when it's ready to encode another frame)

Place `worker.js WasmVideoEncoder2.js WasmVideoEncoder2.wasm` in your public/static folder and copy the `src/VideoEncoder` folder to your place of choice

```
import VideoEncoder from './VideoEncoder/VideoEncoderWorker'

let framesEncoded = 0
let saveVideoCallback = (file) => {
  const blob = new Blob([file], { type: 'video/mp4' });
  window.navigator.msSaveOrOpenBlob(blob);
}

let animate = () => {
    let pixels = readPixels()
    videoEncoder.addFrame(pixels)
    
    if(++framesEncoded > 250) {
      videoEncoder.stop(saveVideoCallback)
    }
}

let encoderLoadedCallback = () => {
    let videoConfig = {
        w: 720,
        h: 480,
        fps: 25,
        bitrate: 400000,
        presetIdx: 0 // ultrafast preset
    }
    videoEncoder.init(videoConfig, undefined /* audioconfig */, animate)
}

videoEncoder = new VideoEncoder(encoderLoadedCallback)
```

### TODOs
- Add working example
- New threading structure using multiple web-workers instead of one
- Move videoediting stuff to new repo
- ~~Fix/Add build to project~~ (src/webassembly/build/em)
- ~~Better animations demo~~
- Custom sound option for demo
- ~~Fix worker memory usage ( reads the canvas faster than it encodes -> frames stack up -> memory out of bounds )~~
- input checking
- ~~~smaller wasm/js~~
- better README
  - benchmarks
  - images
- h265/vp9/vp8/other codec support
- interleaved audio/video writing
- C code improvements (memory management, simplify code)
- Offscreen Canvas example for demo

### LICENSE
- ffmpeg/mp4 is under GPL
- mp3 is under LGPL
- The rest is MIT

### Build
Makefile & patches from ffmpeg.js / videoencoder.js

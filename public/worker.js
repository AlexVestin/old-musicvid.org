importScripts("wasmglue.js")

let encodedFrames = 0
let initialized = false
let startTime

Module["onRuntimeInitialized"] = () => { 
    postMessage({action: "loaded"})
};

openVideo = (config) => {
    let { w, h, fps, bitrate } = config
    Module._open_video(w, h, fps, bitrate);
}

openAudio = (config) => {
    const { bitrate, left, right, samplerate } = config; 
    try {
      var left_p = Module._malloc(left.length * 4)
      Module.HEAPF32.set(left, left_p >> 2)
      
      var right_p = Module._malloc(right.length * 4)
      Module.HEAPF32.set(right, right_p >> 2)
      Module._open_audio(left_p, right_p, left.length, samplerate, 2, bitrate)

    }catch(err) {
      console.log(err)
    }
}

writeHeader = () => {
    Module._write_header();
    postMessage({action: "initialized"})
    initialized = true
} 

close_stream = () => {
    var video_p, size;
    size = Module._close_stream();
    video_p = Module._get_buffer();
    return  new Uint8Array(Module.HEAPU8.subarray(video_p, video_p + size))
}

addFrame = (buffer) => {
    let buf = new Uint8Array(buffer)
    if(initialized) {
        if(encodedFrames === 0)
            startTime = performance.now()
        try {
            var encodedBuffer_p = Module._malloc(buf.length)
            Module.HEAPU8.set(buf, encodedBuffer_p)
            Module._add_frame(encodedBuffer_p)
        }finally {
            Module._free(encodedBuffer_p)
            encodedFrames++;
        }
    }
}

close = () => {
    console.log("frames encoded: ", encodedFrames, " seconds taken: ", (performance.now() - startTime) / 1000)
    Module._write_audio_frame()
    let vid = close_stream()
    const blob = new Blob([vid], { type: 'video/mp4' });
    Module._free_buffer();
    postMessage({action: "return", data: blob})
}

onmessage = (e) => {
    const { data } = e
    if(data.action === undefined){
        addFrame(data)
        return
    }
        

    switch(data.action) {
        case "init":
            openVideo(data.data.videoConfig)
            openAudio(data.data.audioConfig)
            writeHeader()
            postMessage({action: "initialized"})
            break;
        case "addFrame":
            addFrame(data.data)
            break;
        case "close":
            close(data.data)
            break;
        default:
            console.log("unknown command")
    }
}
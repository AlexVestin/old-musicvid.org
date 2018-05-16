importScripts("WasmEncoder.js")

let Module = {}
WasmEncoder(Module)

console.log("nw ")
let encodedFrames = 0
let initialized = false
let startTime, frameSize
let useAudio = false

Module["onRuntimeInitialized"] = () => { 
    postMessage({action: "loaded"})
};

openVideo = (config) => {
    let { w, h, fps, bitrate, presetIdx } = config

    Module._open_video(w, h, fps, bitrate, presetIdx, 1, 1 );
    frameSize = w*h*4
}


let wLeft, wRight, durationInSamples

addAudioFrame = () => {
    console.log(wLeft, wRight, durationInSamples)
    wLeft = wLeft.subarray(0, durationInSamples)
    wRight = wRight.subarray(0, durationInSamples )
    var left_p = Module._malloc(wLeft.length * 4)
    Module.HEAPF32.set(wLeft, left_p >> 2)
    var right_p = Module._malloc(wRight.length * 4)
    Module.HEAPF32.set(wRight, right_p >> 2)

    console.log("?????")
    Module._add_audio_frame(left_p, right_p, wLeft.length)
    console.log("added audio")
}




openAudio = (config) => {
    const { bitrate, left, right, samplerate, duration } = config; 
    durationInSamples = Math.floor(duration * samplerate )
    wLeft = left
    wRight = right
    try {
        
      Module._open_audio(samplerate, 2, bitrate, 1)
      console.log("opened audio")
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
    var video_p, size_p, size;
    video_p = Module._close_stream(size_p);
    size = Module.HEAP32[size_p >> 2]
    return  new Uint8Array(Module.HEAPU8.subarray(video_p, video_p + size))
}

addFrame = (buffer) => {
    try {
        var encodedBuffer_p = Module._malloc(buffer.length)
        Module.HEAPU8.set(buffer, encodedBuffer_p)
        Module._add_video_frame(encodedBuffer_p)
    }finally {
        Module._free(encodedBuffer_p)
        encodedFrames++;
    }
    //hack to avoid memory leaks
   postMessage(buffer.buffer, [buffer.buffer])
   postMessage({action: "ready"})
}

close = () => {
    if(useAudio) addAudioFrame()
    let vid = close_stream()
    Module._free_buffer();
    postMessage({action:"return", data: vid.buffer})
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
            if(data.data.audioConfig !== null){
                openAudio(data.data.audioConfig)
                useAudio = true
            }else {
                useAudio = false
            }
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
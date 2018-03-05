
export default class VideoEncoder {
    constructor(onload){
        this.Module = {}
        window.WasmVideoEncoder(this.Module)

        this.isWorker = false
        this.encodedFrames = 0
        this.initialized = false
        
        this.onload = onload
        this.Module["onRuntimeInitialized"] = () => { 
            this.onload()
        };

    }

    init = (videoConfig, audioConfig, oninit) => {
        this.openVideo(videoConfig)
        this.openAudio(audioConfig)
        this.writeHeader()
        oninit()
    }

    addFrame = (pixels) => {
        this.add_frame(pixels)
    }

    close = (onsuccess) => {
        this.closeStreams(onsuccess)
    }

    openVideo = (config) => {
        let { w, h, fps, bitrate } = config
        this.Module._open_video(w, h, fps, bitrate);
    }
    
    openAudio = (config) => {
        const {Module} = this

        let { bitrate, left, right, samplerate, duration } = config; 
        let durationInBytes = Math.floor(duration * samplerate)
        left = left.subarray(0, durationInBytes)
        right = right.subarray(0, durationInBytes)
        
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
        this.Module._write_header();
        this.initialized = true
    } 
    
    close_stream = () => {
        const {Module} = this
        var video_p, size;
        size = Module._close_stream();
        video_p = Module._get_buffer();
        return  new Uint8Array(Module.HEAPU8.subarray(video_p, video_p + size))
    }
    
    add_frame = (buffer) => {
        const { Module } = this
        if(this.initialized) {
            if(this.encodedFrames === 0)
                this.startTime = performance.now()
            try {
                var encodedBuffer_p = Module._malloc(buffer.length)
                Module.HEAPU8.set(buffer, encodedBuffer_p)
                Module._add_frame(encodedBuffer_p, 1)
            }finally {
                Module._free(encodedBuffer_p)
                this.encodedFrames++;
            }
        }
    }
    
    closeStreams = (onsuccess) => {
        console.log("frames encoded: ", this.encodedFrames, " seconds taken: ", (performance.now() - this.startTime) / 1000)
        this.Module._write_audio_frame()
        let vid = this.close_stream()
        this.Module._free_buffer();
        onsuccess(vid)
    }
}
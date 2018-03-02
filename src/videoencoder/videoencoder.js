import WasmVideoEncoder from './WasmVideoEncoder'

export default class VideoEncoder {
    constructor(onload){
        //this.worker = new Worker("worker.js")
        //this.worker.postMessage({action: "init", data:config})
        //this.worker.onmessage = this.onmessage;
        this.onload = onload
        this.Module = WasmVideoEncoder()
        this.Module["onRuntimeInitialized"] = () => { 
            this.onload()
        };
    }

    openVideo = (config) => {
        let { w, h, fps, bitrate } = config
        this.Module._open_video(w, h, fps, bitrate);
    }

    writeHeader = () => {
        this.Module._write_header();
        this.initialized = true
    } 

    openAudio = (config) => {
        const { bitrate, sound } = config; 
        const { left, right, sampleRate } = sound
        const { Module } = this;  

        try {
          var left_p = Module._malloc(left.length * 4)
          Module.HEAPF32.set(left, left_p >> 2)
          
          var right_p = Module._malloc(right.length * 4)
          Module.HEAPF32.set(right, right_p >> 2)
  
          Module._open_audio(left_p, right_p, left.length, sampleRate, 2, bitrate)
        }catch(err) {
          console.log(err)
        }
        finally {
          this.left_p  = left_p;
          this.right_p  = right_p;   
          this.moduleLoaded = true;
        }
    }

    close_stream = () => {
        const { Module } = this;
        var video_p, size;
        try {
          size = Module._close_stream();
          video_p = Module._get_buffer();
          var buf = Buffer.from(Module.buffer, video_p, size)
          return Buffer.from(buf)
        }finally {
          //Module._free(video_p)
        }
    }

    encode(buffer){
        if(this.initialized) {
            if(this.encodedFrames === 0)
                this.startTime = performance.now()
            
            const { Module } = this
            try {
                var encodedBuffer_p = Module._malloc(buffer.length)
                Module.HEAPU8.set(buffer, encodedBuffer_p)
                Module._add_frame(encodedBuffer_p)
            }finally {
                Module._free(encodedBuffer_p)
                this.encodedFrames++;
            }
        }
    }

    close = () => {
        console.log("frames encoded: ", this.encodedFrames, " seconds taken: ", (performance.now() -this.startTime) / 1000)
        console.log("encoding audio...")
        this.Module._write_audio_frame()
        let vid = this.close_stream()
        const blob = new Blob([vid], { type: 'video/mp4' });
        this.Module._free_buffer();
        //this.Module._free(this.right_p)
        //this.Module._free(this.left_p)

        return blob;
    }
}
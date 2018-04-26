//import WasmVideoEncoder from './WasmVideoEncoder'

export default class Demuxer {
    constructor(onload){
        // in the public folder
        this.worker = new Worker("demuxworker.js")
        this.worker.onmessage = this.onmessage;
        this.onload = onload;

        this.awaitingFrame = false;
        this.extractAudio = 0
        
        this.frames = []
        this.currentFrame = 0
    }
    init = (buffer, bufferLength, keepAudio, oninit) => {
        this.worker.postMessage({action: "init", keepAudio: keepAudio})
        this.worker.postMessage(buffer, [buffer.buffer])
        this.oninit = oninit
    }


    setFrame = (frameId) => {
        this.currentFrame = frameId
        this.worker.postMessage({action: "set_frame", value: frameId})

        this.frames = this.frames.filter(e => e.frameId >= frameId && Math.abs(frameId - e.frameId) < 7)
    }

    sendFrame = (pixels) => {
        this.worker.postMessage(pixels, [pixels.buffer])
    }

    getFrame = (onframe, frameId) => {
        this.frames = this.frames.filter(e => e.frameId >= frameId)
        const frame = this.frames.find(e => e.frameId === frameId)
        if (frame) {
            onframe(frame.data, false)
            return
        }

        this.worker.postMessage({action: "get_frame"})
        this.onframe = onframe;
    }

    close = (onsuccess) => { 
        this.worker.postMessage({action: "close"})
    }
    
    onmessage = (e) => {
        const { data } = e;
        if(data.action === undefined) {
            if(this.extractAudio === 2) {
                this.audioLeft = data
                this.extractAudio--;
            }else if (this.extractAudio === 1) {
                this.oninit({videoInfo: this.videoInfo, audio: {bitrate: this.bitrate, left: this.audioLeft, right: data}})
                this.extractAudio--;
            }else {
                this.frames.push({frameId: this.currentFrame, data: data })
                this.currentFrame++;
                this.onframe(data, true)
            }
        }

        switch(data.action){
            case "loaded":
                this.onload()
                break;
            case "init":
                const { info } = data
                this.videoInfo = {
                    fps: info[0] / info[1],
                    width: info[2],
                    height: info[3],
                    format: info[4],
                    bitrate: info[5]
                }

                this.worker.postMessage( {action: "extract_audio"})
                break;
            case "frame_decoded":
                this.awaitingFrame = true
                break;
            case "audio_extracted":
                this.bitrate = data.info
                this.extractAudio = 2; 
                break;
            case "return":
                this.onsuccess(data.data)
                break;
            case "error":
                break;
            default:
                
                
        }
    }
}
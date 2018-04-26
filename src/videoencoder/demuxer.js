//import WasmVideoEncoder from './WasmVideoEncoder'

export default class Demuxer {
    constructor(onload){
        // in the public folder
        this.worker = new Worker("demuxworker.js")
        this.worker.onmessage = this.onmessage;
        this.onload = onload;

        this.awaitingFrame = false;
    }
    init = (buffer, bufferLength, keepAudio, oninit) => {
        this.worker.postMessage({action: "init", keepAudio: keepAudio})
        this.worker.postMessage(buffer, [buffer.buffer])
        this.oninit = oninit
    }


    sendFrame = (pixels) => {
        this.worker.postMessage(pixels, [pixels.buffer])
    }

    getFrame = (onframe) => {
        this.worker.postMessage({action: "get_frame"})
        this.onframe = onframe;
    }

    close = (onsuccess) => { 
        this.worker.postMessage({action: "close"})
    }
    
    onmessage = (e) => {
        const { data } = e;
        if(data.action === undefined) {
            this.onframe(data)
        }

        switch(data.action){
            case "loaded":
                this.onload()
                break;
            case "init":
                const { info } = data
                const f = {
                    fps: info[0] / info[1],
                    width: info[2],
                    height: info[3],
                    format: info[4],
                    bitrate: info[5]
                }

                this.oninit(f)
                break;
            case "frame_decoded":
                this.awaitingFrame = true
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
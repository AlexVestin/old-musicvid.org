//import WasmVideoEncoder from './WasmVideoEncoder'

export default class Demuxer {
    constructor(onload){
        // in the public folder
        this.worker = new Worker("demuxworker.js")
        this.worker.onmessage = this.onmessage;
        this.onload = onload;
    }
    init = (buffer, bufferLength, keepAudio) => {
        this.worker.postMessage({action: "init", keepAudio: keepAudio})
        this.worker.postMessage(buffer, [buffer.buffer])
    }


    sendFrame = (pixels) => {
        this.worker.postMessage(pixels, [pixels.buffer])
    }

    getFrame = () => {
        
    }

    close = (onsuccess) => { 
        this.worker.postMessage({action: "close"})
    }
    
    onmessage = (e) => {
        const { data } = e;
        switch(data.action){
            case "loaded":
                this.onload()
                break;
            case "initialized":
                this.oninit()
                break;
            case "ready":
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
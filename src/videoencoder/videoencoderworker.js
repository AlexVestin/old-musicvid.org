//import WasmVideoEncoder from './WasmVideoEncoder'

export default class VideoEncoder {
    constructor(onload){

        // in the public folder
        this.worker = new Worker("worker.js")
        this.worker.onmessage = this.onmessage;

        this.onload = onload
        this.isWorker = true

        this.bufferSize = 1
        this.framesInBuffer = -1
        this.buffer = new Uint8Array()
        this.encoding = false
    }

    init = (videoConfig, audioConfig, oninit, getPixels) => {
        this.worker.postMessage({action: "init", data: {audioConfig, videoConfig}})
        this.oninit = oninit
        this.getPixels = getPixels

        this.requested = false
        this.count = 0
    }

    sendFrame = (pixels) => {
        this.encoding = true
        this.worker.postMessage(pixels, [pixels.buffer])
        pixels = null
    }

    addFrame = (pixels, frame) => {
        this.requested = false

        if(!this.encoding){
            if(!this.bufferSet) {
                this.sendFrame(pixels)
            }else {
                this.sendFrame(this.buffer)
                this.buffer = pixels
            }
            
            if(!this.requested) {
                requestAnimationFrame(this.getPixels)
                this.requested = true
            }

        }else{
            if(this.bufferSet){
                this.bufferSet = false
                this.sendFrame(this.buffer)
            }
            
            this.bufferSet = true
            this.buffer = pixels
        }        
    }

    close = (onsuccess) => {                
        this.worker.postMessage({action: "close"})
        this.onsuccess = onsuccess
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
                this.encoding = false
                if(this.bufferSet) {
                    this.bufferSet = false
                    this.sendFrame(this.buffer)
                }
                    
                if(!this.requested)
                    requestAnimationFrame(this.getPixels)
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
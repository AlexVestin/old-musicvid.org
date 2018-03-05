//import WasmVideoEncoder from './WasmVideoEncoder'

export default class VideoEncoder {
    constructor(onload){
        this.worker = new Worker("worker.js")
        this.worker.onmessage = this.onmessage;
        this.onload = onload
        this.isWorker = true

        this.bufferSize = 50
        this.framesInBuffer = 0
        this.buffer = new Uint8Array()
        this.encoding = false
    }

    init = (videoConfig, audioConfig, oninit, getPixels) => {
        this.worker.postMessage({action: "init", data: {audioConfig, videoConfig}})
        this.oninit = oninit
        this.getPixels = getPixels
    }
    concat = (pixels) => {
        let tmp = new Uint8Array(pixels.length + this.buffer.length)
        tmp.set(this.buffer)
        tmp.set(pixels, this.buffer.length)
        this.buffer = tmp
    }

    addFrame = (pixels) => {
        this.concat(pixels)
        if(!this.encoding){
            this.worker.postMessage(this.buffer, [this.buffer.buffer])
            this.encoding = true;

            this.framesInBuffer = 0
            this.buffer = new Uint8Array()
        }
        else {
            if(++this.framesInBuffer < this.bufferSize)
                this.addFrame()
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
                this.encoding = false;
                this.getPixels()
                break;
            case "return":
                this.onsuccess(data.data)
                break;
            case "error":
                console.log(data.data)
                break;
            default:
                
                
        }
    }
}
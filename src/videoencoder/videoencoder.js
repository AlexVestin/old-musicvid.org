//import WasmVideoEncoder from './WasmVideoEncoder'

export default class VideoEncoder {
    constructor(onload){
        this.worker = new Worker("worker.js")
        this.worker.onmessage = this.onmessage;
        this.onload = onload
    }

    init = (videoConfig, audioConfig, oninit) => {
        this.worker.postMessage({action: "init", data: {audioConfig, videoConfig}})
        this.oninit = oninit
    }

    addFrame = (pixels) => {
        this.worker.postMessage(pixels.buffer, [pixels.buffer])
    }

    close = (onsuccess) => {
        this.worker.postMessage({action: "close"})
        this.onsuccess = onsuccess
    }
    
    onmessage = (e) => {
        const { data } = e;
        if(data.action === undefined)
            this.onsuccess(data) 
        switch(data.action){
            case "loaded":
                this.onload()
                break;
            case "initialized":
                this.oninit()
                break;
            case "error":
                console.log(data.data)
                break;
            default:
                console.log("unknown action")
        }
    }
}


export default class VideoEncoder {
    constructor(config){
        this.worker = new Worker("worker.js")
        this.worker.postMessage({action: "init", data:config})

        this.worker.onmessage = this.onmessage;
    }

    onmessage = (e) => {
        console.log(e)
    }

    addFrame = (pixels) => {
        this.worker.postMessage({action: "addFrame", data: pixels})
    } 

    closeStream = (callback) => {
        this.worker.postMessage({action: "closeStream", data: callback})
    }
}

importScripts("Demux2.js")
let Module = Demuxer()

Module["onRuntimeInitialized"] = () => { 
    postMessage({action: "loaded"})
};




var initBuffer = false
onmessage = (e) => {
    const { data } = e
    if(initBuffer) {
        try {

            console.log(data, data.length)
            var buffer_p = Module._malloc(data.length)
            Module.HEAPU8.set(data, buffer_p)
            Module._init_muxer(buffer_p, data.length, 0)
        }finally {
            //Module._free(buffer_p)
            initBuffer = false;
        }
    }

    
    switch(data.action) {
        case "init":
            initBuffer = true;
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

importScripts("Demux3.js")
let Module = Demuxer()

Module["onRuntimeInitialized"] = () => { 
    postMessage({action: "loaded"})
};


function getNextFrame() {
    var buf;
    var size = 0, data = 0;
    var size_p   = Module._malloc(4)

    var buffer_p = 0;
    buffer_p = Module._get_next_frame(size_p)
    var bufferSize = Module.HEAP32[size_p >> 2]
    initBuffer = false;

    var s = new Uint8Array( Module.HEAPU8.subarray(buffer_p, buffer_p + bufferSize) )
    Module._free(buffer_p)
    return s
} 


var initBuffer = false
onmessage = (e) => {
    const { data } = e
    if(initBuffer) {
        try {
            var buffer_p = Module._malloc(data.length)
            Module.HEAPU8.set(data, buffer_p)
            Module._init_muxer(buffer_p, data.length, 0)
            //need to deocde a frame to find pixel fmt etc
            getNextFrame();
            //return to first
            Module._set_frame(0)
            postMessage({action: "init"})
        }finally {
            //Module._free(buffer_p)
            initBuffer = false;
        }

        return;
    }

    switch(data.action) {
        case "init":
            initBuffer = true;
            break;
        case "get_frame":
            const d = getNextFrame()
            postMessage({action: "frame_decoded"})
            postMessage(d, [d.buffer]);
            break;
        case "close":
            close(data.data)
            break;
        default:
            console.log("unknown command")
    }
}
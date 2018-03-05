
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

export default class Sound {
    constructor(filename){
        this.soundDataBuffer = []
        this.startTime = -1
        this.loaded = false
        this.dest = audioCtx.createMediaStreamDestination()
        this.stream = this.dest.stream

        this.Module  = {};
        window.KissFFT(this.Module)
        this.Module["onRuntimeInitialized"] = () => { 
            this.onModuleLoaded()
        };

        this.loadSound(filename, (data) => this.fftData = data)
    }

    onModuleLoaded = () => {
        this.moduleLoaded = true
    }

    play = () => {
        this.source = audioCtx.createBufferSource();
        this.source.buffer = this.buffer;
        //video output
        this.source.connect(this.dest);
        //speaker output
        this.source.connect(audioCtx.destination)
        this.source.start(0)
        this.startTime = performance.now();
    }

    getSpectrum = () => {
        let audio_p, size_p, size = 0;

        const { left } = this;
        console.log(this.Module)
        try {
            audio_p = this.Module._malloc(left.length * 4)
            size_p = this.Module._malloc(4)
            
            this.Module.HEAPF32.set(left, audio_p >> 2)

            let size = this.Module._set_audio(audio_p, left.length)
            let buf_p = this.Module._get_buffer()
            let buf = this.Module.HEAPU8.subarray(buf_p, buf_p + size)
            console.log(buf)
        }finally {

        }
    }

    loadSound = (filename, callback) => {
        let that = this
        var reader = new FileReader();
            reader.onload = function(ev) {
                audioCtx.decodeAudioData(ev.target.result, function(buffer) {
                    that.buffer = buffer; 
                    that.left = new Float32Array(buffer.getChannelData(0))
                    that.right = new Float32Array(buffer.getChannelData(1))
                    that.sampleRate = buffer.sampleRate
                    that.channles = 2
                    that.duration = buffer.duration;

                    if(that.moduleLoaded){
                        that.getSpectrum()
                    }

                    if(that.onload !== undefined)
                        that.onload()
                });
            }
        
        reader.onerror = (err) => { console.log(err) }
        fetch(filename).then(function(response) {
            return response.blob();
        }).then(function(audioBlob) {
            reader.readAsArrayBuffer(audioBlob);
        });
    }
}

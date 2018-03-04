
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
        this.loadSound(filename, (data) => this.fftData = data)
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

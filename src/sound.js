import BaseItem from "./views/canvas/three/items/item";

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

export default class Sound extends BaseItem {
    constructor(config, onload){
        super(config.file.name)

        this.defaultConfig.sampleRate = {value: 0, type: "Number", tooltip: "", editable: false}
        this.defaultConfig.channels = {value: 0, type: "Number",  tooltip: "", editable: false}
        this.defaultConfig.duration = {value: 0, type: "Number", tooltip: "Duration in seconds", editable: false}

        this.onload = onload
        this.soundDataBuffer = []
        this.startTime = -1
        this.loaded = false
        this.dest = audioCtx.createMediaStreamDestination()
        this.stream = this.dest.stream
        this.fftSize = 4096

        this.Module  = {};
        window.KissFFT(this.Module)
        this.Module["onRuntimeInitialized"] = () => { 
            this.onModuleLoaded()
        };

        this.loadSound(config.file, (data) => this.fftData = data)


        this.ac = new AudioContext()
        this.lastIdx = -1
    }

    onModuleLoaded = () => {
        this.moduleLoaded = true
        this.Module._init_r(this.fftSize)
    }

    stop = () => {
        this.playing = false
        if(this.bs)
            this.bs.stop()
    }

    load = (time) => {
        const idx = Math.floor(time*this.sampleRate)
        const left = this.left.subarray(idx, idx + this.sampleRate)
        const right = this.right.subarray(idx, idx + this.sampleRate)

        var ab = this.ac.createBuffer(2, left.length, this.sampleRate)
        this.bs = this.ac.createBufferSource();
        ab.getChannelData(0).set(left);
        ab.getChannelData(1).set(right);
        this.bs.buffer = ab
    }

    play = (time, fps) => {
        if(!this.playing) {
            const idx = Math.floor(time*this.sampleRate)
            const left = this.left.subarray(idx, this.left.length -1)
            const right = this.right.subarray(idx, this.right.length-1)
            
            var ab = this.ac.createBuffer(2, left.length, this.sampleRate)
            this.bs = this.ac.createBufferSource();
            ab.getChannelData(0).set(left);
            ab.getChannelData(1).set(right);
            
            this.bs.buffer = ab;
            this.bs.connect(this.ac.destination);
            this.bs.start(0);

            this.playing = true
        }else {
            if(this.bs)
                this.bs.stop()
                
            this.playing = false
        }

        /*
        this.source = audioCtx.createBufferSource();
        this.source.buffer = this.buffer;
        //video output
        this.source.connect(this.dest);
        //speaker output
        this.source.connect(audioCtx.destination)
        this.source.start(0)
        this.startTime = performance.now();
        */
    }

    getFrequencyData2 = (time) => {
        let  bins = []

        if(this.left !== undefined) {
            let windowSize = this.fftSize;
            let idx = Math.floor(time * this.sampleRate)
            let data = this.left.subarray(idx, idx + windowSize)
            let audio_p, size = 0;
            let fftData
            try {   
                audio_p = this.Module._malloc(windowSize*4);
                this.Module.HEAPF32.set(data, audio_p >> 2)
                let buf_p = this.Module._fft_r(audio_p, windowSize, 1)
                fftData = new Float32Array(this.Module.HEAPU8.buffer, buf_p, windowSize/2)  
            }finally {
                this.Module._free(audio_p)
                bins = new Array(size)
                let last_upper = 0
                let lower, upper, avg

                for(var i = 0; i < size; i++) {
                    lower = last_upper
                    upper = (i+1)*(i+1)
                    avg = 0
                    for(var j = lower; j < upper; j++) {
                        avg += fftData[j] 
                    }

                    bins[i] = avg / (upper-lower)
                    last_upper = upper  
                }
            }
        }


        return bins
    }

    getFrequencyBins = (time) => {
        return this.getFrequencyData(time)
    }

    getFrequencyData = (time) => {
        let bins = []
        if(this.left !== undefined && this.dfdf === undefined) {

            let windowSize = this.fftSize, nr_bins = 64;
            let idx = Math.floor(time * this.sampleRate)

            let data = this.left.subarray(idx, idx + windowSize)
            let audio_p;

            try {   
                audio_p = this.Module._malloc(windowSize*4);
                this.Module.HEAPF32.set(data, audio_p >> 2)
                
                let buf_p = this.Module._fft_r_bins(audio_p, windowSize, nr_bins, 1)
                bins = new Float32Array(this.Module.HEAPU8.buffer, buf_p, nr_bins)  

            }finally {
                this.Module._free(audio_p)
            }
        }

        return bins
        
    }

    loadSound = (file, callback) => {
        let that = this
        var reader = new FileReader();
            reader.onload = function(ev) {
                audioCtx.decodeAudioData(ev.target.result, function(buffer) {
                    that.buffer = buffer; 
                    that.left = new Float32Array(buffer.getChannelData(0))
                    that.right = new Float32Array(buffer.getChannelData(1))

                    that.defaultConfig.sampleRate.value = buffer.sampleRate
                    that.defaultConfig.channels.value = buffer.numberOfChannels
                    that.defaultConfig.duration.value = buffer.duration * 100
                                        
                    that.sampleRate = buffer.sampleRate
                    that.channels = 2
                    that.duration = buffer.duration;

                    if(that.onload !== undefined)
                        that.onload()
                });
            }
        
        reader.onerror = (err) => { console.log(err) }
        //fix ability to get url files
        if(false) {
            fetch(file).then(function(response) {
                return response.blob();
            }).then(function(audioBlob) {
                reader.readAsArrayBuffer(audioBlob);
            });
        }else {
            reader.readAsArrayBuffer(file)
        }
        
    }
}

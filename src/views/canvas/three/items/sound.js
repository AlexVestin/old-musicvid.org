import BaseItem from "./item";
import { addSound } from '../../../../redux/actions/items'
import { setDisabled } from '../../../../redux/actions/globals'

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

export default class Sound extends BaseItem {
    constructor(config, onload){
        super(config)

        const audioGroup = {
            title: "Audio Info",
            items: {
                sampleRate: {value: 0, type: "Number", tooltip: "", editable: false},
                channels: {value: 0, type: "Number",  tooltip: "", editable: false},
            }
        }
        
        // don't allow editing, TODO fix audio editing
        //this.config.defaultConfig[0].items.name.editable = false
        this.config.defaultConfig[1].items.start.editable = false
        this.config.defaultConfig[1].items.duration.editable = false
        
        this.config.movable = false
        this.config.defaultConfig.push(audioGroup)


        this.config.type = "SOUND"
        this.onload = onload
        this.soundDataBuffer = []
        this.startTime = -1
        this.loaded = false
        this.fftSize = 4096

        this.Module  = {};
        window.KissFFT(this.Module)
        this.Module["onRuntimeInitialized"] = () => { 
            this.onModuleLoaded()
        };

        this.loadSound(config.file, (data) => this.fftData = data)

        this.getConfig(this.config.defaultConfig)
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

    play = (time, playing) => {

        if(!this.playing || playing) {
            if(this.bs) {
                this.bs.stop()
            }

            const idx = Math.floor(time*this.sampleRate)
            if (idx > this.left.length)
                return
                
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

                    that.config.sampleRate = buffer.sampleRate
                    that.config.channels = buffer.numberOfChannels
                    that.config.duration = buffer.duration
                                        
                    that.sampleRate = buffer.sampleRate
                    that.channels = 2
                    that.duration = buffer.duration;
                    
                    addSound(that.config)
                    setDisabled(false)

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

const EMPTY_BUFFER = -1

export default class AudioManager {

    constructor() {
        this.sampleRate = 48000
        this.buffers  = []
   
        this.audioCtx = new AudioContext()
        
        this.nrBufferSources = 3
        this.bufferSources = []
    
        this.sounds = []
        this.frameIdx = 0
        this.channels = 2

        this.startSampleWindowSize = 0.1
        this.sampleWindowSize = this.startSampleWindowSize

        this.sampleBuffer = new Float32Array() 
        this.sliceIndex = 0
        this.fftSize = 2048
        this.lastFFTIdx  = 0;
        this.time = 0

        this.encoding = false
        this.masterVolume = 100

        this.metronome = new Worker("audioworker.js")
        this.metronome.onmessage = (e) => {
            if(e.data === "tick")
                this.schedule(this.frameIdx % (this.nrBufferSources - 1))
        }
        this.metronome.postMessage( { interval: this.sampleWindowSize * 1000 } )
        
        this.Module  = {};
        window.KissFFT(this.Module)
        this.Module["onRuntimeInitialized"] = () => { 
            this.onModuleLoaded()
        };
        
    }

    merge = (arr1, arr2) => arr1.map((e,i) => e + arr2[i])

    removeSound = (idx) => {
        this.sounds.splice(idx, 1)
    }

    float32Concat(first, second){
        var firstLength = first.length, result = new Float32Array(firstLength + second.length);

        result.set(first);
        result.set(second, firstLength);
        return result;
    }

    addAudioFrame = (time, first, windowSize) => {
        const frames = this.sounds.map(sound => sound.getAudioFrame(time, first, windowSize))
        const that =  this

        return new Promise(function(resolve, reject){ 
            let buffersToSchedule = []
            if(frames.length !== 0) {
                that.offlineCtx = new OfflineAudioContext(2, Math.floor(that.sampleWindowSize * that.sampleRate), that.sampleRate)
                frames.forEach((frame, i) => {
                    if(frame) {
                        var buf = that.offlineCtx.createBuffer(frame.channels, frame.buffer.length, frame.sampleRate)
                        buf.getChannelData(0).set(frame.buffer.left);
                        buf.getChannelData(1).set(frame.buffer.right);
                        
                        const bufferSource = that.offlineCtx.createBufferSource();
                        bufferSource.buffer = buf;
                        if(frame.volume !== 100 || that.masterVolume !== 100) {
                            const gainNode = that.offlineCtx.createGain();
                            gainNode.gain.value = ((frame.volume) / 100) * that.masterVolume / 100;

                            console.log(gainNode.gain.value)
                            bufferSource.connect(gainNode);
                            gainNode.connect(that.offlineCtx.destination)
                        }else {
                            bufferSource.connect(that.offlineCtx.destination)
                            
                        }
                        buffersToSchedule.push(bufferSource)
   
                    }
                })   
            }
            if(buffersToSchedule.length > 0 ) {
                buffersToSchedule.forEach(buffer => buffer.start()) 
                that.offlineCtx.startRendering().then((renderedBuffer => {
                    that.buffers.push(renderedBuffer)

                    const merged = that.merge(renderedBuffer.getChannelData(0), renderedBuffer.getChannelData(1))
                    that.sampleBuffer = that.float32Concat(that.sampleBuffer, merged)
                    resolve()
                    return
                })) 
            }else {
                that.buffers.push(EMPTY_BUFFER)
                resolve()
            }
        })
    }

    preProcess = (time) => {
        this.stop()
        this.time = time
        return new Promise((resolve, reject) => {
            const p1 = this.addAudioFrame(this.time, true, this.sampleWindowSize)
            const p2 = this.addAudioFrame(this.time)
            const p3 = this.addAudioFrame(this.time)

            Promise.all([p1,p2, p3]).then(resolve)
        })
    }

    editFFT = (config) => {
        //this.fftTransformer.editConfig(config)
    }

    schedule = (index) => {
        if(this.playing) {
            const buffer = this.buffers.pop()
            if(buffer !== EMPTY_BUFFER && buffer !== undefined) {
                this.bufferSources[index] = this.audioCtx.createBufferSource()
                this.bufferSources[index].buffer = buffer
                this.bufferSources[index].connect(this.audioCtx.destination)
                this.bufferSources[index].start(this.startTime + this.sampleWindowSize * this.frameIdx)
            }
            
            this.frameIdx++
            this.addAudioFrame(this.time)
        }
    }



    encodingFinished = () => {
        this.stop()
        this.encoding = false 
        this.sampleWindowSize = this.startSampleWindowSize
    }

    getEncodingFrame = () => {
        
        var buffer = this.buffers.pop()
        this.frameIdx++
        if(buffer === EMPTY_BUFFER || buffer === undefined) {
            const left =  new Float32Array(Math.floor(this.sampleWindowSize * this.sampleRate))
            const right =  new Float32Array(Math.floor(this.sampleWindowSize * this.sampleRate))
            return {type: "audio", left, right, sampleRate: this.sampleRate }
        }

        this.addAudioFrame(this.time)
        return { type: "audio", left: buffer.getChannelData(0), right: buffer.getChannelData(1), sampleRate: buffer.sampleRate }
    }

    add = (sound) => {
        sound.windowSize = this.sampleWindowSize
        this.sounds.push(sound)
        
        sound.setTime(this.time + this.sampleWindowSize * this.frameIdx )
    }

    onModuleLoaded = () => {
        this.moduleLoaded = true
        this.Module._init_r(this.fftSize)
    }


    getBins = (times, stepping) => {
        let bins = [], data = []
        
        const time = times +  ( (this.nrBufferSources - 1) * this.sampleWindowSize)
        const idx = Math.floor((time - this.time) * this.sampleRate)        

        if(this.sampleBuffer.length >= this.fftSize) {
            const windowSize = this.fftSize;
            data = this.sampleBuffer.subarray(idx - this.sliceIndex, idx + windowSize - this.sliceIndex)
            this.sampleBuffer = this.sampleBuffer.slice(idx - this.lastFFTIdx)
            this.sliceIndex += idx - this.lastFFTIdx
            this.lastFFTIdx = idx
            
            let audio_p;
            try {   
                audio_p = this.Module._malloc(windowSize*4);
                this.Module.HEAPF32.set(data, audio_p >> 2)
                
                const buf_p = this.Module._fft_r(audio_p, windowSize, 0)
                bins = new Float32Array(this.Module.HEAPU8.buffer, buf_p, windowSize / 2)  
            }finally {
                this.Module._free(audio_p)
            }
        }
       
        return { bins: bins, raw: data }
    }

    update = (time) => {
        this.addAudioFrame(this.time)
    }

    editSound = (soundConfig) => {
        const sound = this.sounds.find(e => e.config.id === soundConfig.id)
        
        if(sound.config.start !== soundConfig.start || sound.config.offsetLeft !== soundConfig.offsetLeft)
            sound.setTime(this.time + this.sampleWindowSize * this.frameIdx )
        
        sound.config = soundConfig
    }

    setTime = (time) => {
        this.stop(0)
        this.time = time
        this.sounds.forEach(e => e.setTime(time, this.sampleWindowSize))
    }

    play = (time) => {
        this.time = time
        if(this.playing){
            this.stop()
        }else {
            this.playing = true 
            this.startTime = this.audioCtx.currentTime
            this.metronome.postMessage("start")
            this.schedule(0)
            this.schedule(1)
        }
    }

    stop = () => {
        //this.bufferSources.forEach(e => e.stop())
        this.playing = false
        this.firstPlay = true
        this.sampleBuffer = new Float32Array()
        this.sliceIndex = 0
        this.lastFFTIdx = 0
        this.metronome.postMessage("stop")
        this.frameIdx = 0
        this.buffers = []
    }
}

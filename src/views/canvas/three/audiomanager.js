
const EMPTY_BUFFER = -1

export default class AudioManager {

    constructor() {
        this.sampleRate = 48000
        this.buffers  = []
   
        this.audioCtx = new AudioContext()
        this.bufferSources = [{}, {}]
        this.sounds = []
        this.frameIdx = 0

        this.sampleWindowSize = 0.05

        this.sampleBuffer = new Float32Array() 
        this.sliceIndex = 0
        this.fftSize = 2048
        this.lastBins = []
        this.lastFFTIdx  = 0;


        this.metronome = new Worker("audioworker.js")
        this.metronome.onmessage = (e) => {
            if(e.data === "tick")
                this.schedule(this.frameIdx % 2)
        }
        this.metronome.postMessage({interval: this.sampleWindowSize * 1000})
        
        this.Module  = {};
        window.KissFFT(this.Module)
        this.Module["onRuntimeInitialized"] = () => { 
            this.onModuleLoaded()
        };
    }

    removeSound = (idx) => {
        this.sounds.splice(idx, 1)
    }

    float32Concat(first, second){
        var firstLength = first.length, result = new Float32Array(firstLength + second.length);

        result.set(first);
        result.set(second, firstLength);

        return result;
    }

    addAudioFrame = (frames, fps) => {
        const that =  this
        return new Promise(function(resolve, reject){ 
            let buffersToSchedule = []
            if(frames.length !== 0) {
                that.offlineCtx = new OfflineAudioContext(2, Math.floor(that.sampleWindowSize *that.sampleRate), that.sampleRate)
                frames.forEach((frame, i) => {
                    if(frame) {
                        var buf = that.offlineCtx.createBuffer(frame.channels, frame.buffer.length, frame.sampleRate)
                        buf.getChannelData(0).set(frame.buffer.left);
                        buf.getChannelData(1).set(frame.buffer.right);
                        
                        const bufferSource = that.offlineCtx.createBufferSource();
                        bufferSource.buffer = buf;
                        bufferSource.connect(that.offlineCtx.destination)
                        buffersToSchedule.push(bufferSource)
                    }
                })   
            }
            if(buffersToSchedule.length > 0 ) {
                buffersToSchedule.forEach(buffer => buffer.start()) 
                that.offlineCtx.startRendering().then((renderedBuffer => {
                    that.buffers.push(renderedBuffer)
                    that.sampleBuffer = that.float32Concat(that.sampleBuffer, renderedBuffer.getChannelData(0))
                    resolve()
                    return
                })) 
            }else {
                that.buffers.push(EMPTY_BUFFER)
                resolve()
            }
        })
    }

    schedule = (index) => {
        if(this.playing) {
            const buffer = this.buffers.pop()
            if(buffer !== EMPTY_BUFFER && buffer !== undefined) {
                this.bufferSources[index] = this.audioCtx.createBufferSource()
                this.bufferSources[index].buffer = buffer
                this.bufferSources[index].connect(this.audioCtx.destination)
                //this.bufferSources[index].onended = () => this.schedule(index)

                this.bufferSources[index].start(this.startTime + this.sampleWindowSize * this.frameIdx++)
            }else {
                //setTimeout(() => this.schedule(index), this.sampleWindowSize * 2000)
                this.frameIdx++
            }

            this.addAudioFrame(this.sounds.map(sound => sound.getAudioFrame()))
        }
    }

    encodingStarted = () => {
        this.stop()
        this.addAudioFrame(this.sounds.map(sound => sound.getAudioFrame()))
        this.frameIdx++
    }

    getEncodingFrame = () => {
        this.addAudioFrame(this.sounds.map(sound => sound.getAudioFrame()))
        this.frameIdx++
        var buffer = this.buffers.pop()

        if(buffer === EMPTY_BUFFER) {
            const left =  new Float32Array(Math.floor(this.sampleWindowSize *this.sampleRate))
            const right =  new Float32Array(Math.floor(this.sampleWindowSize *this.sampleRate))
            return {type: "audio", left, right, sampleRate: this.sampleRate }
        }

        return {type: "audio", left: buffer.getChannelData(0), right: buffer.getChannelData(1), sampleRate: buffer.sampleRate }
    }

    add = (sound) => {
        this.sounds.push(sound)
    }

    onModuleLoaded = () => {
        this.moduleLoaded = true
        this.Module._init_r(this.fftSize)
    }

    getBins = (time) => {
        let bins = []

        if(this.sampleBuffer.length > this.fftSize) {

            let windowSize = this.fftSize, nr_bins = 64;
            const idx = Math.floor((time - this.time + this.sampleWindowSize)* this.sampleRate)
            const data = this.sampleBuffer.subarray(idx - this.sliceIndex, idx + windowSize - this.sliceIndex)
            
            this.sampleBuffer = this.sampleBuffer.slice(idx - this.lastFFTIdx)
            this.sliceIndex += idx - this.lastFFTIdx
            this.lastFFTIdx = idx
            
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

    update = (time) => {
        this.addAudioFrame(this.sounds.map(sound => sound.getAudioFrame(time , true, this.sampleWindowSize)))
    }

    editSound = (soundConfig) => {
        const sound = this.sounds.find(e => e.config.id === soundConfig.id)
        sound.config = soundConfig
        sound.setTime(this.time + this.sampleWindowSize * this.frameIdx )
        this.buffers = []
    }

    setTime = (time) => {
        this.time = time
        this.sounds.forEach(e => e.setTime(time))
        this.buffers = []
    }

    play = (time, playing) => {
        this.time = time
        if(this.playing){
            this.stop()
        }else {
            this.playing = true 
            this.tmpTime = 0
            this.addAudioFrame(this.sounds.map(sound => sound.getAudioFrame(time , true, this.sampleWindowSize))).then( () => {
                this.startTime  =  this.audioCtx.currentTime
                this.schedule(0)
            })
            this.addAudioFrame(this.sounds.map(sound => sound.getAudioFrame(time, false))).then(() => {
                this.schedule(1)
            })

            this.metronome.postMessage("start")
        }
    }

    stop = () => {
        //this.bufferSources.forEach(e => e.stop())
        this.playing = false
        this.sampleBuffer = []
        this.slicedIndex = 0
        this.metronome.postMessage("stop")
        this.frameIdx = 0
        this.buffers = []
    }
}

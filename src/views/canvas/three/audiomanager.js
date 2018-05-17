
const EMPTY_BUFFER = -1

export default class AudioManager {

    constructor() {
        this.sampleRate = 48000
        this.buffers  = []
   
        this.audioCtx = new AudioContext()
        this.bufferSources = [{}, {}]
        this.scheduledEndTimes = [0, 0]
        this.sounds = []
        this.frameIdx = 0

        this.sampleWindowSize = 0.05

        this.metronome = new Worker("audioworker.js")
        this.metronome.onmessage = (e) => {
            this.schedule(this.frameIdx % 2)
        }
        this.metronome.postMessage({interval: this.sampleWindowSize * 1000})
        

        this.fftSize = this.sampleWindowSize * 48000
        this.Module  = {};
        window.KissFFT(this.Module)
        this.Module["onRuntimeInitialized"] = () => { 
            this.onModuleLoaded()
        };
    }

    removeSound = (idx) => {
        this.sounds.splice(idx, 1)
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
                this.bufferSources[index].onended = () => this.schedule(index)
    
                this.scheduledEndTimes[index] = (buffer.length / this.sampleRate)
                this.bufferSources[index].start(this.startTime + this.sampleWindowSize * this.frameIdx++)
            }else {
                setTimeout(() => this.schedule(index), this.sampleWindowSize * 2000)
                this.frameIdx++
            }
            this.addAudioFrame(this.sounds.map(sound => sound.getAudioFrame()))
        }
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

    update = (time) => {
        this.addAudioFrame(this.sounds.map(sound => sound.getAudioFrame(time , true, this.sampleWindowSize)))
    }

    editSound = (soundConfig) => {
        const sound = this.sounds.find(e => e.config.id === soundConfig.id)
        sound.config = soundConfig
        this.buffers = []
    }

    setTime = (time) => {
        this.time = time
        this.sounds.forEach(e => e.setTime(time))
        this.buffers = []
    }

    play = (time, playing) => {
        //this.sounds.forEach(e => e.play(time, playing))
        if(this.playing){
            this.playing = false
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
        this.frameIdx = 0
        this.playing = false
        this.buffers = []
        this.sounds.forEach(e => e.stop())
    }
}

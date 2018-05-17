export default class AudioManager {

    constructor() {
        this.sampleRate = 48000
        this.buffers  = []
   
        this.audioCtx = new AudioContext()
        this.bufferSources = [{}, {}]
        this.scheduledEndTimes = [0, 0]
        this.sounds = []
    }

    addAudioFrame = (frames, fps) => {
        const that =  this
        const t1 = performance.now()
        return new Promise(function(resolve, reject){ 
            let buffersToSchedule = []
            if(frames.length !== 0) {
                that.offlineCtx = new OfflineAudioContext(2, frames[0].buffer.length, that.sampleRate)
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

                if(buffersToSchedule.length > 0 ) {
                    buffersToSchedule.forEach(buffer => buffer.start()) 
                    that.offlineCtx.startRendering().then((renderedBuffer => {
                        that.buffers.push(renderedBuffer)
                        resolve()
                    })) 
                }else {
                    reject()
                }
            }
        })
    }

    schedule = (index) => {
        if(this.playing) {
            const buffer = this.buffers.pop()
            this.bufferSources[index] = this.audioCtx.createBufferSource()
            this.bufferSources[index].buffer = buffer
            this.bufferSources[index].connect(this.audioCtx.destination)
            this.bufferSources[index].onended = () => { this.tmpTime=performance.now(); this.schedule(index); }

            this.scheduledEndTimes[index] = (buffer.length / this.sampleRate)
            console.log(this.scheduledEndTimes[index])
            this.bufferSources[index].start(this.scheduledEndTimes[(index + 1) %  2])
            this.addAudioFrame(this.sounds.map(sound => sound.getAudioFrame()))
        }
    }

    add = (sound) => {
        this.sounds.push(sound)
    }

    getBins = (time) => {
        return this.sounds[0] ? this.sounds[0].getFrequencyBins(this.time) : []
    }

    update = (time) => {
        this.addAudioFrame(this.sounds.map(sound => sound.getAudioFrame(time , true)))
    }

    setTime = (time) => {
        this.time = time
        this.buffers = []
    }

    play = (time, playing) => {
        //this.sounds.forEach(e => e.play(time, playing))
        this.playing = true 
        this.tmpTime = 0
        const p1 = this.addAudioFrame(this.sounds.map(sound => sound.getAudioFrame(time , true)))
        const p2 = this.addAudioFrame(this.sounds.map(sound => sound.getAudioFrame(time, false)))

        Promise.all([p1, p2]).then(() => {
            this.startTime  =  this.audioCtx.currentTime
            this.schedule(0)
            this.schedule(1)
        })
    }

    stop = () => {
        this.playing = false
        this.sounds.forEach(e => e.stop())
    }
}

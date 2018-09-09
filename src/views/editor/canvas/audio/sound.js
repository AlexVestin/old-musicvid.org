import BaseItem from './template'
import { addSound } from '@redux/actions/items'
import { setDisabled } from '@redux/actions/globals'

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

export default class Sound extends BaseItem {
    constructor(config, fileConfig){
        super(config)

        if(!fileConfig) {
            const audioGroup = {
                title: "Audio Info",
    
                items: {
                    sampleRate: {value: 0, type: "Number", tooltip: "", disabled: true},
                    channels: {value: 0, type: "Number",  tooltip: "", disabled: true},
                    volume: {value: 100, type: "Number", tooltip: "Volume", min: 0, max: 100}
                }
            }
            
            // don't allow editing, TODO fix audio editing
            //this.config.defaultConfig[0].items.name.disabled = false
            this.config.defaultConfig[1].items.start.disabled = true
            this.config.defaultConfig[1].items.duration.disabled = true
            
            this.config.defaultConfig.push(audioGroup)
    
            this.config.type = "SOUND"

            this.loadSound(config.file, true)
            this.getConfig()
        }else {
            this.loadSound(config, false)
            this.config = {...fileConfig}
        }
       
        this.soundDataBuffer = []
        this.startTime = -1
        this.loaded = false
        this.fftSize = 4096

        this.ac = new AudioContext()
        this.lastIdx = -1
        this.offset = 0
    }


    setTime = (time) => {
        this.offset = Math.floor( (time - this.config.start + this.config.offsetLeft) * this.sampleRate)
    }

    getAudioFrame = (time, first = false, sampleWindowSize) => {
        if(!this.left || !this.right)return
        if(first) {
            this.offset = Math.floor( (time - this.config.start + this.config.offsetLeft) * this.sampleRate)
            this.windowSize = sampleWindowSize
        }

        const length = Math.floor(this.windowSize * this.sampleRate)
        if(this.offset >=  this.config.offsetLeft * this.sampleRate && this.offset < (this.config.duration + this.config.offsetLeft) * this.sampleRate) {
            const buffer = {}
            buffer.left =  this.left.subarray(this.offset, this.offset + length)
            buffer.right =  this.right.subarray(this.offset, this.offset + length)

            buffer.length = length
            this.offset += length
            return { buffer, sampleRate: this.sampleRate, channels: this.channels, volume: this.config.volume }
        }else{
            this.offset += length
            return
        }
    }

    loadSound = (file, shouldAddNewItem) => {
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
                    that.config.maxDuration = buffer.duration
                                        
                    that.sampleRate = buffer.sampleRate
                    that.channels = 2
                    that.duration = buffer.duration;
                
                    if(true)addSound(that.config)
                    setDisabled(false)
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

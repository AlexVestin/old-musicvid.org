import BaseItem from '../../itemtemplates/item'
import * as THREE from 'three'
import Demuxer from '@/videoencoder/demuxer.js'



export default class Video extends BaseItem {
    constructor(config) {
        super(config) 
        var fr = new FileReader()
        this.bytesLoaded = false
        fr.onload = () => {            
            this.bytes = new Uint8Array(fr.result)
            this.bytesLoaded = true
        }

        this.setupTexture()
        fr.readAsArrayBuffer(config.file) 

        this.ac = new AudioContext()
        this.decoder = new Demuxer(this.onDecoderReady)
        this.playAudio = config.keepAudio
        this.config.name = config.name
    }

    setupTexture = () => {
        this.texData = new Uint8Array(1280*720*3)
        this.tex = new THREE.DataTexture(this.texData, 1280, 720, THREE.RGBFormat, THREE.UnsignedByteType)
        this.tex.flipY = true
        
        this.mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2, 0),
            new THREE.MeshBasicMaterial({map: this.tex})
        );
    }   

    onDecoderReady = () => {
        if(this.bytesLoaded) {
            this.decoder.init(this.bytes, this.bytes.length, this.playAudio, this.decoderInitialized)
            this.bytes = null
        }
    }

    convertTimeToFrame = (time) => Math.floor((time*this.info.fps) - (this.config.start * this.info.fps))

    setTime = (time, playing) => {
        const frameId = this.convertTimeToFrame(time)
        this.decoder.setFrame(frameId)
        this.time = time
        if(playing)
            this.play(time)
    }

    decoderInitialized = (info) => {
        this.info = info.videoInfo;
        this.sound = info.audio
        
        this.config.duaration = this.info.duration;
              
        this.tex = new THREE.DataTexture(this.texData, this.info.width, this.info.height, THREE.RGBFormat, THREE.UnsignedByteType);
        this.tex.flipY = true
        this.mesh.material.map = this.tex
        this.tex.needsUpdate = true

        this.playing = true
        this.decoderReady = true

        this.config.duration = this.info.duration
        this.config.maxDuration = this.info.duration
        
        this.addItem() 
    }


    onframe = (frame, shouldUpdate) => {
        if(shouldUpdate) {
            this.texData.set(frame)
            this.tex.needsUpdate = true
        }
    }

    animate = (time) => {
        this.time = time
        if(this.decoderReady) {
            const frameId = this.convertTimeToFrame(time)

            if(frameId >= 0 && frameId < this.info.fps * this.info.duration)
                this.decoder.getFrame(this.onframe, frameId)
        }
        
    }

    stop = () => {
        this.time = 0
        this.decoder.setFrame(0)
        if(this.bs)
            this.bs.stop()
    }

    play = (time) => {
        this.time = time
       
        if(this.playAudio) {
            if(this.bs)
                this.bs.stop()

            const idx = Math.floor((time-this.config.start)*this.sound.bitrate)
            const left = this.sound.left.subarray(idx, this.sound.left.length - 1)
            const right = this.sound.right.subarray(idx, this.sound.right.length - 1)
            
            var ab = this.ac.createBuffer(2, left.length, this.sound.bitrate)
            this.bs = this.ac.createBufferSource();
            ab.getChannelData(0).set(left);
            ab.getChannelData(1).set(right);
            
            this.bs.buffer = ab;
            this.bs.connect(this.ac.destination);
            this.bs.start(0);
        }
    }
}


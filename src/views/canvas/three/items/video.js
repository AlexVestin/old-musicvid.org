import BaseItem from "./item";
import * as THREE from 'three'
import FileSaver from 'file-saver'
import Demuxer from '../../../../videoencoder/demuxer.js'

import {setDisabled} from '../../../../redux/actions/globals'


export default class Video extends BaseItem {
    constructor(name, config, sceneConfig) {
        super(name) 

        this.mesh = {}
        var fr = new FileReader()

        this.bytesLoaded = false
        fr.onload = () => {            
            this.bytes = new Uint8Array(fr.result)
            this.bytesLoaded = true
        }
        
        fr.readAsArrayBuffer(config.file) 
        this.config = this.getConfig(this.defaultConfig)
        this.decoder = new Demuxer(this.onDecoderReady)

        setDisabled(true)


        this.texData = new Uint8Array(1280*720*3)
        this.tex = new THREE.DataTexture(this.texData, 1280, 720, THREE.RGBFormat, THREE.UnsignedByteType);
        this.tex.flipY = true
        
        this.mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2, 0),
            new THREE.MeshBasicMaterial({map: this.tex})
        );

        //this.mesh.rotation.y = Math.PI / 2;

        this.mesh.name = String(this.config.id)

        this.downloaded = false
        this.counter = 0;
    }

    onDecoderReady = () => {
        if(this.bytesLoaded) {
            this.decoder.init(this.bytes, this.bytes.length, 0, this.decoderInitialized)
        }
    }

    decoderInitialized = (info) => {
        this.info = info.videoInfo;
        this.sound = info.audio

        this.tex = new THREE.DataTexture(this.texData, this.info.width, this.info.height, THREE.RGBFormat, THREE.UnsignedByteType);
        this.tex.flipY = true
        this.mesh.material.map = this.tex
        this.tex.needsUpdate = true

        //Show first frame
        this.decoder.getFrame(this.onframe)
        this.decoder.setFrame(0)
        this.mesh.name = String(this.config.id)
        setDisabled(false)
        console.log("setdisabled false damnit")

        this.playing = true
        this.decoderReady = true
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
            const frameId = Math.floor((time - (this.config.start/100)) * this.info.fps)
            if(frameId >= 0)
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
        this.decoder.setFrame(Math.floor((time - (this.config.start/100)) * this.info.fps))
        console.log("play")
        this.playAudio = true
        if(this.playAudio) {
            // test audio ------- worksc

            const idx = Math.floor((time-(this.config.start/100))*this.sampleRate)
            this.ac = new AudioContext()
            const left = this.sound.left.subarray(idx )
            const right = this.sound.right.subarray(idx)
            
            var ab = this.ac.createBuffer(2, left.length, this.sound.bitrate)
            this.bs = this.ac.createBufferSource();
            ab.getChannelData(0).set(left);
            ab.getChannelData(1).set(right);
            
            this.bs.buffer = ab;
            this.bs.connect(this.ac.destination);
            this.bs.start(0);
        }
    }

    updateConfig = (config) => {
        this.config = this.getConfig(config)
    }

}


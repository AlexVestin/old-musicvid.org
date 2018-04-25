import BaseItem from "./item";
import * as THREE from 'three'

import Demuxer from '../../../../videoencoder/demuxer.js'

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

        this.test = 5
    }

    onDecoderReady = () => {
        if(this.bytesLoaded) {
            this.decoder.init(this.bytes, this.bytes.length, 0, this.decoderInitialized)
        }
    }

    decoderInitialized = () => {
        this.decoderReady = true
        this.decoder.getFrame(this.onframe)
    }


    onframe = (frame) => {
        if(this.test <= 5) {
            this.decoder.getFrame(this.onframe)
            this.test--;
        }

        this.frame = frame;
    }

    animate = (time) => {
        this.decoder.getFrame(this.onframe)
    }

    updateConfig = (config) => {
        this.config = this.getConfig(config)
    }

}


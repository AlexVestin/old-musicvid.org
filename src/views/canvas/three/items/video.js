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
            console.log(fr.result)
            
            this.bytes = new Uint8Array(fr.result)
            console.log(this.bytes.length)
            this.bytesLoaded = true
        }
        
        fr.readAsArrayBuffer(config.file) 
        this.config = this.getConfig(this.defaultConfig)
        this.decoder = new Demuxer(this.onDecoderReady)
    }

    onDecoderReady = () => {
        if(this.bytesLoaded) {
            this.decoder.init(this.bytes, this.bytes.length, 0)
        }
    }

    updateConfig = (config) => {
        this.config = this.getConfig(config)
    }

}


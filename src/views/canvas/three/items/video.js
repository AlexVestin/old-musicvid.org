import BaseItem from "./item";
import * as THREE from 'three'
import FileSaver from 'file-saver'
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

        console.log(info)

        this.tex = new THREE.DataTexture(this.texData, this.info.width, this.info.height, THREE.RGBFormat, THREE.UnsignedByteType);
        this.tex.flipY = true
        this.mesh.material.map = this.tex
        this.tex.needsUpdate = true

        this.decoderReady = true

        //Show first frame
        this.decoder.getFrame(this.onframe)
        this.decoder.setFrame(0)

        this.mesh.name = String(this.config.id)
    }


    onframe = (frame) => {
        this.texData.set(frame)
        this.tex.needsUpdate = true
    }

    animate = (time) => {
        if(this.decoderReady)
            this.decoder.getFrame(this.onframe)

        
    }

    updateConfig = (config) => {
        this.config = this.getConfig(config)
    }

}


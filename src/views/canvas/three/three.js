import {WebGLRenderTarget, WebGLRenderer} from 'three'

import SceneContainer from './scene'
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { addItem, addLayer } from '../../../redux/actions/items'
import Sound from "./items/sound"
import store from '../../../redux/store'

import * as FileSaver from "file-saver";
import VideoEncoder from '../../../videoencoder/videoencoderworker'
import { setEncoding, incrementTime } from '../../../redux/actions/globals';


class ThreeCanvas extends Component {
    componentDidMount() {    
        const mount = this.mountRef
        this.width = mount.clientWidth
        this.height = mount.clientHeight
        const renderer = new WebGLRenderer({antialias: true})
        renderer.setClearColor('#000000')
        renderer.setSize(this.width, this.height)
        renderer.autoClear = false;
        this.renderer = renderer
        
        const background = new SceneContainer("background", this.width, this.height, renderer)
        const graphics = new SceneContainer("graphics", this.width, this.height, renderer)
        graphics.setCamera()
        graphics.setControls()
        
        addLayer(background.config)
        addLayer(graphics.config)
        
        mount.appendChild(this.renderer.domElement)
        this.gl = this.renderer.getContext();

        this.audioLoaded = false
        this.mount = mount 

        this.encodedFrames = 0
        this.scenes = [background, graphics]
    }

    componentWillUnmount(){
        this.unsubscribe()
    }

    setSize(w, h) {
        this.height = h
        this.width = w
        this.renderer.setSize(w, h)        
    }

    shouldComponentUpdate() {
        return false;
    }

    add = (name, info) => {
        const scene = this.scenes.find(e => e.config.id === this.props.selectedLayer.id)
        scene.addItem(name, info)
    }

    initEncoder = (config) => {
        this.videoEncoder = new VideoEncoder(this.encoderLoaded)
        this.config = config
    }

    encoderInitialized = () => {
        setEncoding(true)
        this.encoding = true
        this.play(0)
        this.renderScene(this.props.time)
    }

    encoderLoaded = () => {
        let audioConfig = null
        this.duration = this.sound.duration
        if(this.sound) {
            let sound = this.sound
            let samplerate = sound.sampleRate
            let channels = sound.channels
            let { left, right } = sound
            audioConfig = { left, right, channels, samplerate, bitrate: 320000, duration: sound.config.duration }
        }
  
        let videoConfig = { w: this.config.width, h:this.config.height, fps: this.config.fps, bitrate: this.config.bitrate }

        this.videoEncoder.init(videoConfig, audioConfig, this.encoderInitialized, this.renderScene)
    }

    componentWillReceiveProps(props) {
        switch(store.getState().lastAction.type) {
            case "REMOVE_ITEM":
                this.removeItem(props.selectedItem)
                break;
            case "EDIT_SELECTED_ITEM":
                this.updateConfig(props.selectedItem);
                break
            case "SET_TIME":
                this.setTime(props.time, props.playing)
                break;
            case "CREATE_ITEM":
                let name = props.selectedItem.type
                this.add(name, props.selectedItem)
                break; 
            case "ADD_SOUND":
                this.sound = new Sound(props.audio, () => { this.audioLoaded = true; })
                break;
            default:
        }
    }

    updateConfig = (config) => {
        const scene = this.scenes.find(e => e.config.id === this.props.selectedLayer.id)
        scene.updateItem(config)
    }

    removeItem = (config) => {
        const scene = this.scenes.find(e => e.config.id === this.props.selectedLayer.id)
        scene.removeItem(config)
    }

    stop = () => {
        this.scenes.forEach(e => e.stop())
        if(this.sound)this.sound.stop()
    }

    play = (time) => {
        this.scenes.forEach(e => e.play(time, this.props.fps))
        if(this.audioLoaded)
            this.sound.play(time, this.props.fps)
    }

    saveBlob = (vid) => {
        const blob = new Blob([vid], { type: 'video/mp4' });
        FileSaver.saveAs(blob)
    }
    

    renderScene = (time) => { 
        var frequencyBins = []
        if(this.audioLoaded) {
            frequencyBins = this.sound.getFrequencyBins(this.props.time)               
        }
        
        this.renderer.clear()
        this.scenes.forEach((scene => {
            scene.animate(this.props.time, frequencyBins)
            scene.render(this.renderer)
            this.renderer.clearDepth()
        }))
        
        if(this.encoding && this.encodedFrames < this.duration*this.config.fps  && this.encodedFrames !== -1) {
            const gl = this.renderer.getContext();
            this.pixels = new Uint8Array(this.width*this.height*4)
            gl.readPixels(0,0,this.width,this.height, gl.RGBA, gl.UNSIGNED_BYTE, this.pixels)
            this.videoEncoder.addFrame(this.pixels, this.renderScene)
            incrementTime(this.props.time + (1 / this.config.fps))
            this.pixels = null
        }else if(this.encoding && this.encodedFrames >= this.duration*this.config.fps) {
            this.encoding = false
            setEncoding(false)
            this.videoEncoder.close(this.saveBlob)
            this.encodedFrames = -1
        }
    }

    setTime = (time, playing) => {
        this.scenes.forEach(e => e.setTime(time, playing))
        if(playing)
            this.play(time)
    }

    render() {
        return(
            <div
                ref={ref => this.mountRef = ref } 
                style={{ width: String(this.props.width) +'px',  height: String(this.props.height) +'px'}}                
            />
            
        )
    }
}

const mapStateToProps = state => {
    return {
        items: state.items.items,
        selectedItem: state.items.selectedItem,
        lastAction: state.items.lastAction,
        fps: state.globals.fps,
        frameId: state.globals.frameId,
        time: state.globals.time,
        playing: state.globals.playing,
        selectedLayer: state.items.selectedLayer,
        audio: state.items.audioInfo,
        encoding: state.globals.encoding
    }
}

export default connect(mapStateToProps, null, null,  { withRef: true })(ThreeCanvas)
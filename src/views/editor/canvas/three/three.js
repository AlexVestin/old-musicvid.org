import SceneContainer from './scene'
import React, { Component } from 'react';
import Sound from "./items/sound"
import store from '@redux/store'
import { OrthographicCamera, Scene, WebGLRenderer } from 'three' 
import * as FileSaver from "file-saver";
import VideoEncoder from '@/videoencoder/videoencoderworker'
import { setEncoding } from '@redux/actions/globals';
import { setSidebarWindowIndex } from '@redux/actions/items'

import AudioManager from '../audiomanager'


class ThreeCanvas extends Component {
    constructor(props) {
        super(props)
        this.state = {
            width: props.width,
            height: props.height,
            hidden: false
        }
    }

    componentDidMount() {    
        this.mount = this.mountRef
        this.width = this.mount.clientWidth
        this.height = this.mount.clientHeight
        
        this.renderer = new WebGLRenderer({antialias: true, alpha: true})
        this.renderer.setClearColor('#000000')
        this.renderer.setSize(this.width, this.height)
        this.renderer.autoClear = false;
        
        this.unsubscribe = store.subscribe(this.handleChange)
        
        this.mount.appendChild(this.renderer.domElement)
        this.gl = this.renderer.getContext();

        this.encodedFrames = 0
        this.setupScene()
        this.audioManager = new AudioManager()
    }

    setupScene = () =>  {
        const background = new SceneContainer("background", this.width, this.height, this.renderer)
        
        const graphics   = new SceneContainer("graphics", this.width, this.height, this.renderer)
        graphics.setCamera()
        graphics.setControls()
        graphics.controls.enabled = false

        this.mainCamera = new OrthographicCamera(-1,1,1,-1,0,100);
        this.mainScene = new Scene();

        this.mainScene.add(background.quad) 
        //background.quad.position.z = -1
        this.mainScene.add(graphics.quad)               
        this.scenes = [background, graphics]

        setSidebarWindowIndex(0);
    }

    componentWillUnmount(){
        this.unsubscribe()
    }

    setSize(width, height, hidden) {
        this.scenes.forEach(e => e.setSize(width, height))
        this.setState({width, height, hidden})
        this.renderer.setSize( width, height );     
    }

    shouldComponentUpdate(props) {
        return props.encoding !== this.state.hidden;
    }

    initEncoder = (config, duration) => {
        this.videoEncoder = new VideoEncoder(this.encoderLoaded)
        this.config = config
        this.duration = duration
    }

    encoderInitialized = () => {
        setEncoding(true)
        this.encoding = true
        this.encodedFrames = 0
        this.play(0)

        this.setSize(this.config.width, this.config.height, true)

        this.startTime = performance.now()
        this.encodeVideoFrame(this.time)
        this.videoEncoder.sendFrame()
        this.audioManager.encodingStarted()
    }


    encoderLoaded = () => {
        const samplerate = this.audioManager.sampleRate
        const channels = this.audioManager.channles
        const audioConfig = {  channels, samplerate, bitrate: 320000 }
        let videoConfig = { w: this.config.width, h:this.config.height, fps: this.config.fps, bitrate: this.config.bitrate, presetIdx: this.config.presetIdx }
        
        this.videoEncoder.init(videoConfig, audioConfig, this.encoderInitialized, this.encode)
    }

    handleChange = () => {
        const state             = store.getState()
        this.time               = state.globals.time
        
        const audioInfo         = state.items.audioInfo
        const audioItems        = state.items.audioItems
        const audioIdx          = state.items.audioIdx
        const type              = state.lastAction.type
        const payload           = {...state.lastAction.payload}

        this.fps                = state.globals.fps
        this.playing            = state.globals.playing
        this.selectedLayerId    = state.items.selectedLayerId
        this.createEffectType   = state.items.createEffect

        const scene = this.scenes ? this.scenes.find(e => e.config.id === this.selectedLayerId) : null
        this.selectedItemId = state.items.selectedItemId

        switch(type) {
            case "CREATE_LAYER":
                const newLayer   = new SceneContainer("new graphics", this.width, this.height, this.renderer)
                newLayer.setCamera()
                newLayer.setControls()
                newLayer.controls.enabled = false
                this.mainScene.add(newLayer.quad)               
                this.scenes.push(newLayer)
                setSidebarWindowIndex(0);
                break;
            case "EDIT_FOG":
                scene.editFog(payload.key, payload.value)
                break;
            case "EDIT_CONTROLS": 
                scene.editControls(payload.key, payload.value)
                break;
            case "REMOVE_ITEM":
                scene.removeItem(payload.id)
                break;
            case "EDIT_CAMERA":
                scene.editCamera(payload.key, payload.value)
                break
            case "SET_POST_PROCESSING_ENABLED":
                this.postProcessingEnabled = state.lastAction.payload
                break;
            case "REMOVE_EFFECT":
                scene.removeEffect(payload)
                break;
            case "EDIT_EFFECT":
                scene.editEffect(payload, state.items.effectId)
                break;
            case "CREATE_EFFECT":
                scene.createEffect(state.lastAction.payload)
                break;
            case "ADD_AUTOMATION_POINT":
                scene.addAutomationPoint(payload.point, payload.key, this.selectedItemId)
                break;
            case "EDIT_AUTOMATION_POINT":
                scene.editAutomationPoint(payload.id, payload.value, payload.key, this.selectedItemId)
                break;
            case "ADD_AUTOMATION":
                scene.addAutomation(payload.automation, this.selectedItemId)
                break;
            case "EDIT_SELECTED_ITEM":
                scene.updateItem(state.items.items[this.selectedLayerId][this.selectedItemId], this.time);
                break
            case "CREATE_ITEM":
                scene.addItem(payload.type, payload, this.time)
                break; 
            case "SET_TIME":
                this.setTime(this.time, this.playing)
                break;
            case "CREATE_SOUND":
                this.audioManager.add(new Sound(audioInfo, () => {if(this.props.playing)this.sound.play(this.props.time)}))
                break;
            case "EDIT_AUDIO_ITEM":
                this.audioManager.editSound(audioItems[audioIdx])
                break
            case "REMOVE_SOUND":
                this.audioManager.removeSound(audioIdx)
                break;
            case "SET_AUDIO_BUFFER_SIZE":
                this.audioManager.sampleWindowSize = payload > 0.1 && !isNaN(payload) ? payload :  0.1
                break;
            default:

        }
    }
    stop = () => {
        this.scenes.forEach(e => e.stop())
        this.audioManager.stop()
    }

    play = (time) => {
        this.scenes.forEach(e => e.play(time))
        this.audioManager.play(time, this.state.encoding)
    }

    saveBlob = (vid) => {
        FileSaver.saveAs(new Blob([vid], { type: 'video/mp4' }), "vid.mp4")
    }

    encode = () => {
        if(this.encoding && this.encodedFrames <  this.duration * this.config.fps  && this.encodedFrames !== -1) { 
            const videoTs = (this.encodedFrames / this.config.fps ) 
            const audioTs = (this.audioManager.frameIdx * this.audioManager.sampleWindowSize) 
            if( videoTs >= audioTs ) {
                this.encodeAudioFrame()
            }else{
                this.renderScene()
                this.encodeVideoFrame()
            }

        }else if(this.encoding && this.encodedFrames >= this.duration * this.config.fps) {
            this.encoding = false
            setEncoding(false)
            const t =  (performance.now() - this.startTime) / 1000
            console.log("ENCODING FINISHED ----- ", t, " seconds and ",  this.encodedFrames / t , " fps" )
            this.setSize(this.props.width, this.props.height, false)
            this.videoEncoder.close(this.saveBlob)
            this.audioManager.encodingFinished()
            this.encodedFrames = -1
            this.setTime(0)
        }
    }


    encodeAudioFrame = () => {
        const frame = this.audioManager.getEncodingFrame()
        this.videoEncoder.queueFrame( frame )
    }

    encodeVideoFrame = () => {
        const { width, height} = this.state
        const gl = this.renderer.getContext();
        this.pixels = new Uint8Array(width * height * 4)
        gl.readPixels(0,0,width,height, gl.RGBA, gl.UNSIGNED_BYTE, this.pixels)
        this.videoEncoder.queueFrame( {type: "video", pixels: this.pixels} )

        //incrementTime(this.time + (1 / this.config.fps))
        this.time += (1 / this.config.fps)
        this.pixels = null
        this.encodedFrames++
    }
    

    renderScene = (time, stepping) => { 
        const frequencyBins = this.audioManager.getBins(this.time, stepping)
        this.renderer.clear()
        this.scenes.forEach((scene => {
            scene.animate(this.time, frequencyBins)
            scene.render(this.renderer, time, this.postProcessingEnabled)
            this.renderer.clearDepth()
        }))

        if(this.postProcessingEnabled) {
            this.renderer.render(this.mainScene, this.mainCamera)
        }
    }

    setTime = (time, playing) => {
        this.scenes.forEach(e =>  e.setTime(time, playing, this.selectedItemId)  )
        this.audioManager.setTime(time)
    }

    render() {
        const {width, height, hidden} = this.state
        const hideCanvas = this.props.encoding || hidden
        return(
            <div style={{ minWidth: String(this.props.width) +'px',  minHeight: String(this.props.height), backgroundColor: "black"} } >
                <div
                    ref={ref => this.mountRef = ref } 
                    style={{ width: String(width) +'px',  height: String(height) +'px', display: hideCanvas ? "none" :  ""}}                
                />
            </div>
        )
    }
}



export default ThreeCanvas
import SceneContainer from './scene'
import React, { Component } from 'react';
import Sound from "./items/sound"
import store from '../../../redux/store'
import {OrthographicCamera, Scene, WebGLRenderer } from 'three' 
import * as FileSaver from "file-saver";
import VideoEncoder from '../../../videoencoder/videoencoderworker'
import { setEncoding, incrementTime } from '../../../redux/actions/globals';
import {  setSidebarWindowIndex } from '../../../redux/actions/items'
import AudioManager from './audiomanager'


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
        const mount = this.mountRef
        this.width = mount.clientWidth
        this.height = mount.clientHeight
        const renderer = new WebGLRenderer({antialias: true, alpha: true})
        renderer.setClearColor('#000000')
        renderer.setSize(this.width, this.height)
        renderer.autoClear = false;
        this.renderer = renderer
        
        this.unsubscribe = store.subscribe(this.handleChange)
        
        mount.appendChild(this.renderer.domElement)
        this.gl = this.renderer.getContext();

        this.audioLoaded = false
        this.mount = mount 

        this.encodedFrames = 0
        this.setupScene()
        this.audioManager = new AudioManager()
    }

    setupScene = () =>  {
        const background = new SceneContainer("background", this.width, this.height, this.renderer)
        const graphics   = new SceneContainer("graphics", this.width, this.height, this.renderer)
        graphics.setCamera()
        graphics.setControls()

        this.mainCamera = new OrthographicCamera(-1,1,1,-1,0,100);
        this.mainScene = new Scene();

        this.mainScene.add(background.quad) 
        background.quad.position.z = -1
        this.mainScene.add(graphics.quad)               
        
        this.mainScene.add(background.quad, graphics.quad);
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

    initEncoder = (config, useAudio) => {
        this.videoEncoder = new VideoEncoder(this.encoderLoaded)
        this.config = config
        this.useAudio = useAudio
    }

    encoderInitialized = () => {
        setEncoding(true)
        this.encoding = true
        this.encodedFrames = 0
        this.play(0)

        const { width, height } = this.config
        this.setSize(width, height, true)
        
        this.encodeVideoFrame(this.time)
        this.videoEncoder.sendFrame()
        
        this.audioManager.encodingStarted()
    }


    encoderLoaded = () => {
        let audioConfig = null
        if(!this.useAudio.useSongDuration ) {
            this.duration = this.useAudio.value
        }else {
            this.duration = this.audioManager.sounds[0].duration
        }

        if(this.audioManager.sounds[0]) {
            let sound = this.audioManager.sounds[0]
            let samplerate = sound.sampleRate
            let channels = sound.channels
            let { left, right } = sound
            audioConfig = { left, right, channels, samplerate, bitrate: 320000, duration: this.duration }
        }
  
        let videoConfig = { w: this.config.width, h:this.config.height, fps: this.config.fps, bitrate: this.config.bitrate }
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

        if(this.selectedLayer) {
            this.selectedEffect = this.selectedLayer.selectedEffect
        }

        const scene = this.scenes ? this.scenes.find(e => e.config.id === this.selectedLayerId) : null
        this.selectedItemId = state.items.selectedItemId
        switch(type) {
            case "REMOVE_ITEM":
                scene.removeItem(payload.id)
                break;
            case "EDIT_CAMERA":
                scene.editCamera(payload.key, payload.value)
                break
            case "REMOVE_EFFECT":
                scene.removeEffect(this.selectedEffect)
                break;
            case "EDIT_EFFECT":
                scene.editEffect(this.selectedEffect)
                break;
            case "CREATE_EFFECT":
                scene.createEffect(this.selectedEffect)
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
                scene.updateItem(state.items.items[this.selectedLayerId][this.selectedItemId]);
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
            default:

        }
    }
    stop = () => {
        this.scenes.forEach(e => e.stop())
        this.audioManager.stop()
    }

    play = (time, play) => {
        this.scenes.forEach(e => e.play(time))
        this.audioManager.play(time, this.state.encoding)
    }

    saveBlob = (vid) => {
        const blob = new Blob([vid], { type: 'video/mp4' });
        FileSaver.saveAs(blob, "vid.mp4")
    }


    encode = (time) => {
        this.renderScene(time)
        if(this.encoding && this.encodedFrames <  this.duration*this.config.fps  && this.encodedFrames !== -1) { 
            const videoTs = this.encodedFrames / this.config.fps
            const audioTs = (this.audioManager.frameIdx * this.audioManager.sampleWindowSize) 
            if( videoTs > audioTs ) {
                this.encodeAudioFrame(time)
            }else{
                this.encodeVideoFrame(time)
            }
        }else if(this.encoding && this.encodedFrames >= this.duration * this.config.fps) {
            this.encoding = false
            setEncoding(false)
            this.setSize(this.props.width, this.props.height, false)
            this.videoEncoder.close(this.saveBlob)
            this.encodedFrames = -1
        }
    }


    encodeAudioFrame = (time) => {
        const frame = this.audioManager.getEncodingFrame()
        this.videoEncoder.queueFrame( frame )
    }

    encodeVideoFrame = (time) => {
        const { width, height} = this.state
        const gl = this.renderer.getContext();
        this.pixels = new Uint8Array(width*height*4)
        gl.readPixels(0,0,width,height, gl.RGBA, gl.UNSIGNED_BYTE, this.pixels)
        this.videoEncoder.queueFrame( {type: "video", pixels: this.pixels} )

        
        incrementTime(this.time + (1 / this.config.fps))
        this.pixels = null
        this.encodedFrames++
    }
    

    renderScene = (time) => { 
        var frequencyBins = this.audioManager.getBins(time)
        this.renderer.clear()
        
        this.scenes.forEach((scene => {
            scene.animate(this.time, frequencyBins)
            scene.render(this.renderer, time)
        }))

        this.renderer.render(this.mainScene, this.mainCamera)
        this.lastTime = time
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
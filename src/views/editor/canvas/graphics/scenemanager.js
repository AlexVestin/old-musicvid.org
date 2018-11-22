import SceneContainer3D from './three/scene'
import SceneContainer2D from './canvas2d/scene'
import RenderTarget from './postprocessing/rendertarget';

import React, { Component } from 'react';
import { base } from '@backend/firebase'
import store from '@redux/store'
import { OrthographicCamera, Scene, WebGLRenderer } from 'three' 
import * as FileSaver from "file-saver";
import VideoEncoder from '@/videoencoder/videoencoderworker'
import { setEncoding } from '@redux/actions/globals';
import { setSidebarWindowIndex, dispatchAction } from '@redux/actions/items'
import AudioManager from '../audio/audiomanager'
import Sound from "../audio/sound"

class ThreeCanvas extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            hidden: false,
            framesEncoded: 0,
        };

        this.encoding = false;
        this.mountRef = React.createRef();
    }

    //TODO Fix width and height ( Resolution)
    componentDidMount() {    

        
        this.width = this.mountRef.current.clientWidth;
        this.height = this.mountRef.current.clientHeight;

        // Set up internal canvas to display to user
        this.externalCanvas = document.createElement("canvas");
        this.externalCtx = this.externalCanvas.getContext("2d");
        this.externalCanvas.width = this.mountRef.current.clientWidth;
        this.externalCanvas.height = this.mountRef.current.clientHeight;

        // Set up canvas for internals to render to
        this.internalCanvas = document.createElement("canvas");
        this.internalCanvas.width = 1920;
        this.internalCanvas.height = 1080;
        
        // Threejs renderer set-up
        this.renderer = new WebGLRenderer({antialias: true, alpha: true, canvas: this.internalCanvas});
        this.renderer.setSize(this.internalCanvas.width, this.internalCanvas.height);
        this.renderer.setClearColor('#000000');
        this.renderer.autoClear = false;
        this.mountRef.current.appendChild(this.externalCanvas);

        // Subscribe to redux store for that long-ass switch further down
        this.unsubscribe = store.subscribe(this.handleChange);
        this.encodedFrames = 0;

        if(!this.props.loadFromFile) {
            dispatchAction({type: "RESET_REDUCER"});
            this.setupScene();
            this.audioManager = new AudioManager();      
        }else {
            this.setupScene();
            this.audioManager = new AudioManager();
            this.loadFromFile();
        }
    }

    setExternalSize = (width, height) => {
        this.externalCanvas.width = width;
        this.externalCanvas.height = height;
    }

    addPassFromFile = (pass) => {
        this.renderTarget.addFromFile(pass);
    }

    addLayerFromFile = (layer, project) => {
        let loadedLayer;
        
        if(layer.layerType === 1) {
            const camera = project.cameras[layer.id];
            const controls = project.controls[layer.id];
            
            loadedLayer = new SceneContainer3D(layer.name, this.width, this.height, this.renderer, layer, camera, controls, this.externalCanvas)
        }else {
            loadedLayer = new SceneContainer2D(layer.name, this.width, this.height, this.renderer, layer)
        }

        this.addLayer(loadedLayer)
        return loadedLayer;
    }

    setFFTSize = (value) => {
        this.audioManager.setFFTSize(value, true)
    }

    loadLayerItems = (layer, project, key) => {
        let files = []
        project.layers[key].items.forEach(itemId => {
            const item = project.items[key][itemId]
            if(item.itemType === "VIDEO" || item.itemType === "IMAGE"){
                files.push(item)
            }else {
                layer.addItem(item.itemType, item, 0, item)
            }  
        })

        return files;
    }

    loadFromFile = () => {
        const state = store.getState();
        const project = state.items;
        const globals = state.globals;
        this.postProcessingEnabled = globals.postProcessingEnabled
        
        let files = []
        for(var key in project.layers) {
            const layer = this.addLayerFromFile(project.layers[key], project)
            files.concat(this.loadLayerItems(layer, project, key))
        }

        for(var key in project.passes) {
            const pass = project.passes[key]
            this.addPassFromFile(pass)
        }

        for(var key in project.audioItems) {
            const audioItem = project.audioItems[key]
            files.push(audioItem)
        }
        const resWidth = Number(globals.resolution.split("x")[0]);
        const resHeight = Number(globals.resolution.split("x")[1]);
        this.setSize(resWidth, resHeight);
        this.scenes.forEach(scene => scene.setFFTSize(Number(globals.fftSize)))
        this.audioManager.fftSize = Number(globals.fftSize)
        dispatchAction({type: "RESET_AUDIO_FILES"})
        this.props.linkFiles(files, this.filesLinked)
    }

    filesLinked = (linked) => {
        console.log(linked)
    }


    setupScene = () =>  {
        this.mainCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 10);
        this.mainScene = new Scene();
        this.scenes = [];

        const sceneConfig = {
            camera: this.mainCamera,
            scene: this.mainScene,
            renderer: this.renderer
        };
        this.renderTarget = new RenderTarget(this.width, this.height, sceneConfig);

        setSidebarWindowIndex(0);
    }

    removeEffect = (config) => {
        this.renderTarget.removeEffect(config)
    }

    editEffect = (config, id) => {
        this.renderTarget.editEffect(config, id)
    }

    createEffect = (type) => {
        this.renderTarget.createEffect(type)
    }

    componentWillUnmount(){
        this.unsubscribe()
    }

    setSize(width, height, hidden) {
        if(!this.encoding) {
            this.scenes.forEach(e => e.setSize(width, height))
            this.renderer.setSize( width, height );     
        }

        console.log(this.internalCanvas.width, this.internalCanvas.height)
    }

    shouldComponentUpdate(props, state) {
        return this.encoding !== this.state.hidden || this.props.width !== props.width || state.framesEncoded  !== this.state.framesEncoded;
    }

    initEncoder = (config, duration) => {
        this.videoEncoder = new VideoEncoder(this.encoderLoaded)
        this.config = config
        this.duration = duration
    }

    setExternalState = (width, height) => {

    }

    encoderInitialized = () => {
        setEncoding(true)
        this.setSize(this.config.width, this.config.height, true)
        this.encoding = true
        this.encodedFrames = 0


        this.setState({width: this.config.width, height: this.config.height, hidden: true})
        this.startTime = performance.now()
       
        this.audioManager.encoding = true
        this.audioManager.preProcess(0).then(() => {
            this.scenes.forEach(e => e.play(0))
            this.encodeVideoFrame(this.time)
            this.videoEncoder.sendFrame()
        })

        dispatchAction({type: "SET_TOTAL_FRAMES",  payload: this.duration * this.config.fps})
    }


    encoderLoaded = () => {
        const samplerate = this.audioManager.sampleRate
        const channels = this.audioManager.channles
        const audioConfig = {  channels, samplerate, bitrate: 320000 }
        let videoConfig = { w: this.config.width, h:this.config.height, fps: this.config.fps, bitrate: this.config.bitrate, presetIdx: this.config.presetIdx }
        
        this.videoEncoder.init(videoConfig, audioConfig, this.encoderInitialized, this.encode)
    }

    handleChange = () => {
        const state             = store.getState();
        this.time               = state.globals.time;
        
        const audioInfo         = state.items.audioInfo;
        const audioItems        = state.items.audioItems;
        const audioIdx          = state.items.audioIdx;
        const type              = state.lastAction.type;
        const payload           = {...state.lastAction.payload};

        this.fps                = state.globals.fps;
        this.playing            = state.globals.playing;
        this.selectedLayerId    = state.items.selectedLayerId;
        this.createEffectType   = state.items.createEffect;

        const scene = this.scenes ? this.scenes.find(e => e.config.id === this.selectedLayerId) : null;
        this.selectedItemId = state.items.selectedItemId;
        var newLayer;

        switch(type) {
            case "UPDATE_ITEM_FILE":
                scene.updateItemFile(state.items.items[this.selectedLayerId][this.selectedItemId], payload);
                break;
            case "ADD_LINKED_FILE":
                if(payload.config.type === "SOUND") {
                    this.audioManager.add(new Sound(payload.file, payload.config));
                }
                break;
            case "EDIT_LAYER":
                scene.editSettings(payload.key, payload.value);
                break;
            case "REMOVE_LAYER":
                const sceneToRemove = this.scenes.find(e => e.config.id === payload.id)
                this.scenes = this.scenes.filter(e => e.config.id !== sceneToRemove.config.id)
                this.mainScene.remove(sceneToRemove.quad)
                break;
            case "EDIT_SETTINGS":
                scene.editSettings(payload.key, payload.value)
                break;
            case "CREATE_3D_LAYER":
                newLayer   = new SceneContainer3D("new 3d graphics", this.internalCanvas.width, this.internalCanvas.height, this.renderer, null, null, null, this.externalCanvas)
                this.addLayer(newLayer)
                break;
            case "CREATE_2D_LAYER":
                newLayer   = new SceneContainer2D("new 2d graphics", this.internalCanvas.width, this.internalCanvas.height, this.renderer)
                this.addLayer(newLayer)
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
            case "EDIT_PROJECT_SETTINGS":
                if(payload.key === "postProcessingEnabled") {
                    this.postProcessingEnabled = payload.value
                }else if(payload.key === "masterVolume") {
                    this.audioManager.masterVolume = payload.value
                }else if(payload.key === "fftSize") {
                    this.setFFTSize(Number(payload.value))
                }else if(payload.key === "resolution") {
                    let width = Number(payload.value.split("x")[0])
                    let height = Number(payload.value.split("x")[1])
                    this.setSize(width, height)
                }
                    
                break;
            case "REMOVE_EFFECT":
                this.removeEffect(payload)
                break;
            case "EDIT_EFFECT":
                this.editEffect(payload, state.items.effectId)
                break;
            case "CREATE_EFFECT":
                this.createEffect(state.lastAction.payload)
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
            case "MOVE_ITEM":
                scene.moveItem(payload.item, payload.up)
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
                this.audioManager.add(new Sound(audioInfo))
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

    cancelEncoding = () => {
        this.encoding = false
        setEncoding(false)
        this.setSize(this.props.width, this.props.height, false)
        this.setState( { width: this.props.width, height: this.props.height, hidden: false})
        this.audioManager.encodingFinished()
        this.encodedFrames = -1
        this.setTime(0)
        dispatchAction({type:"SET_EXPORT", payload: false})
    }
   
    addLayer = (layer) =>  {
        this.scenes.push(layer)
        this.scenes = this.scenes.sort((a,b) => a.config.zIndex - b.config.zIndex)
        while (this.mainScene.children.length) {
            this.mainScene.remove(this.mainScene.children[0]);
        }
        this.scenes.forEach(e => this.mainScene.add(e.quad))
        setSidebarWindowIndex(0);
    }
    stop = () => {
        this.scenes.forEach(e => e.stop())
    }

    play = (time) => {
        if(this.playing) {
            this.audioManager.stop()
            this.playing = false;
        }else {
            this.preProcess(time, () => {
                this.scenes.forEach(e => e.play(time))
                this.audioManager.play(time, this.state.encoding)
            })
            this.playing = true
        }
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
                this.renderScene(this.time)
                this.encodeVideoFrame()
            }

            if(this.encodedFrames % 30 === 0) {
                this.setState({framesEncoded: this.encodedFrames})
                dispatchAction({type:"SET_FRAMES_ENCODED", payload: this.encodedFrames})
            }

        }else if(this.encoding && this.encodedFrames >= this.duration * this.config.fps) {
            this.encoding = false
            setEncoding(false)
            const t =  (performance.now() - this.startTime) / 1000
            console.log("ENCODING FINISHED ----- ", t, " seconds and ",  this.encodedFrames / t , " fps" )
            this.setState( { width: this.props.width, height: this.props.height, hidden: false})
            this.videoEncoder.close(this.saveBlob)
            this.audioManager.encodingFinished()
            this.encodedFrames = -1
            this.setTime(0)
            dispatchAction({type:"SET_EXPORT", payload: false})
            this.props.resizeCanvas()
            const ref = base.ref("/counter")
            ref.transaction((e) => {
                return e = (e || 0) + 1; 
            })

        }
    }


    encodeAudioFrame = () => {
        const frame = this.audioManager.getEncodingFrame()
        this.videoEncoder.queueFrame( frame )
    }

    encodeVideoFrame = () => {
        const { width, height} = this.state
        this.pixels = new Uint8Array(width * height * 4)

        const gl = this.renderer.getContext();
        gl.readPixels(0,0,width,height, gl.RGBA, gl.UNSIGNED_BYTE, this.pixels)
        this.videoEncoder.queueFrame( {type: "video", pixels: this.pixels} )

        //incrementTime(this.time + (1 / this.config.fps))
        this.time += (1 / this.config.fps)
        this.pixels = null
        this.encodedFrames++
    }
    

    renderScene = (time, stepping) => { 
        this.time = time
        const frequencyBins = this.audioManager.getBins(this.time, stepping)
        this.renderer.clear()
        this.scenes = this.scenes.sort((a,b) => a.config.zIndex - b.config.zIndex)
        
        this.scenes.forEach((scene => {
            scene.animate(this.time, frequencyBins)
            scene.render(this.renderer, this.postProcessingEnabled)
            this.renderer.clearDepth()
        }))
        
        if(this.postProcessingEnabled) {
            this.renderTarget.update(time, frequencyBins)
            this.renderTarget.render();
        }       
        
        this.externalCtx.drawImage(this.internalCanvas, 0, 0, this.externalCanvas.width, this.externalCanvas.height);
    }

    preProcess = (time, callback) => {
        const p1  = this.audioManager.preProcess(time)
        let promises = this.scenes.map(scene => scene.preProcess())
        Promise.all([...promises, p1]).then(function(values) {
            callback()
        });
    }

    setTime = (time, playing) => {
        if(playing) {
            this.audioManager.setTime(time)
            this.preProcess(time, () => {
                this.scenes.forEach(e =>  e.setTime(time, playing, this.selectedItemId)  )
                this.audioManager.play(time)
            })
        }else {
            this.scenes.forEach(e =>  e.setTime(time, playing, this.selectedItemId)  )
            this.audioManager.setTime(time)
        }
        
    }

    render() {
        const { hidden} = this.state
        const hideCanvas = this.props.encoding || hidden

        return(

            <div style={{  width: this.props.width, height: this.props.height, backgroundColor: "black"} } >
                <div
                    ref={this.mountRef} 
                    style={{ width: this.props.width,  height: this.props.height, display: hideCanvas ? "none" :  ""}}                
                />
            </div>
        )
    }
}



export default ThreeCanvas
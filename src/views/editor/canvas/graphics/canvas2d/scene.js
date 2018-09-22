import * as THREE from 'three'
import { add2DLayer } from '@redux/actions/items'

import Nebula from './items/nebula'
import InceptionCity from './items/inceptioncity'
import CircleRings from './items/circlerings';
import WaveletCanvas from './items/waveletcanvas';
import Square from './items/square';
import JSNation from './items/jsnation';
import SimpleText from './items/text'
import KineticText from './items/kinetictypography';
import CirclePlayer from './items/circleplayer';
import TimeKeeper from './items/timekeeper';
import TimeText from './items/timetext';
import Image from './items/image';
import Circle2 from './items/nation2'
import Polartone from './items/polartone'
import Bars from './items/bars'


export default class SceneContainer {
    constructor(name, width, height, renderer, config) {

        this.renderer = renderer

        this.items      = []
        this.toRender   = []
        this.rendering  = []

        if(!config) {
            this.config = {
                id: Math.floor(Math.random() * 100000000),
                name: name,
                clearColor: "000000",
                clearAlpha: 1,
                shouldUseClearRect: true,
                zIndex: 1,
                pixelRatio: 720,
                defaultConfig: [ {
                    title: "Settings", 
                    items: {
                        clearColor: {type: "String", value: "000000", tooltip: "Color of the background when clearing, not used when shouldUseClearRect is checked"},
                        clearAlpha: {type: "Number", value: 1, tooltip: "Alpha of the background when clearing, not used when shouldUseClearRect is checked"},
                        shouldUseClearRect: {type: "Boolean", value: true, tooltip: "Clears the entire canvas, more performant than using a clear color"},
                        zIndex: {type: "Number", value: 1, tooltip: "Position of this layer relative to other layers"},
                        pixelRatio: {type: "Number", value: 720, min: 1, max: 2048, tooltip: "resolution of the canvas the items are drawn to, uses an automatic aspect ratio"},
                        scalePixelRatioOnExport: {type: "Boolean", value: true, tooltip: "Scales the pixelRatio on export in case it doesn't match the output value, this will make the video look different when exporting"}
                    }
                }],
                items: [],
                width,
                height,
                passes: [],
                layerType: 2
            }

            add2DLayer(this.config)
        }else {
            this.config = {...config}
        }

        
        this.width = width
        this.height = height

        
        this.textureCanvas = document.createElement('canvas');
        this.internalCanvas = document.createElement("canvas")
        this.internalCtx = this.internalCanvas.getContext("2d")

        this.textureCanvas.width = width;
        this.textureCanvas.height = height;
        this.textureCtx = this.textureCanvas.getContext("2d");

        this.texture =  new THREE.CanvasTexture(this.textureCanvas)
        this.texture.minFilter = THREE.LinearFilter

        this.quad = new THREE.Mesh( 
            new THREE.PlaneBufferGeometry( 2, 2 ), 
            new THREE.MeshBasicMaterial( { map: this.texture, transparent: true } )
        );  

        this.mainScene = new THREE.Scene()
        this.mainCamera= new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.mainScene.add(new THREE.Mesh( 
            new THREE.PlaneBufferGeometry( 2, 2 ), 
            new THREE.MeshBasicMaterial( { map: this.texture, transparent: true } )
        ))

        this.setSize(this.width, this.height);
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

    editSettings = (key, value) => {
        this.config[key] = value
        if(key === "zIndex") this.quad.renderOrder = value
        if(key === "pixelRatio") this.setSize(this.width, this.height)
    }

    moveItem = (item, up) => {
        const delta =  up ? -1 : 1
        let i1 = this.items.find(e => e.config.id === item.id)
        let i2 = this.items.find(e => e.config.renderIndex === i1.config.renderIndex + delta)
        i1.config.renderIndex = i1.config.renderIndex + delta
        i2.config.renderIndex = i2.config.renderIndex - delta
    }

    setFFTSize = (value) => {
        this.items.forEach(item => item.setFFTSize(value))
    }

    addItem = (name, info, time, config) => {
        info = {
            ...info, 
            type: name, 
            name, 
            time, 
            canvas: this.textureCanvas, 
            ctx: this.textureCtx, 
            sceneId: this.config.id, 
            renderIndex: this.items.length, 
            height: this.height, 
            width: this.width
        }
        
        if(config)info.type = config.itemType
        let item; 
    
        switch (info.type) {
            case "BARS2D":
                item = new Bars(info, config);
                break;
            case "CIRCLE2":
                item = new Circle2(info, config);
                break;
            case "IMAGE":
                item = new Image(info, config);
            break;
            case "TIME TEXT":
                item = new TimeText(info, config);
            break;
            case "TIME KEEPER":
                item = new TimeKeeper(info, config);
                break;
            case "CIRCLE PLAYER":
                item = new CirclePlayer(info, config);
                break;
            case "KINETIC TEXT":
                item = new KineticText(info, config)
            break;
            case "TEXT":
                item = new SimpleText(info, config)
            break;
            case "JSNATION":
                item = new JSNation(info, config)
            break;
            case "SQUARE":
                item = new Square(info, config)
            break;
            case "POLARTONE":
                item = new Polartone(info, config)
            break;
            case "WAVELET CANVAS":
                item = new WaveletCanvas(info, config)
                break;
            case "NEBULOSA":
                item = new Nebula(info, config)
                break;
            case "INCEPTION CITY":
                item = new InceptionCity(info, config)
                break;
            case "CIRCLE RINGS":
                item = new CircleRings(info, config)
                break;
            default:
                console.log("unkown config type while adding object", info.type)
        }

        this.items.push(item)
        
        const { start, duration } = item.config
        item.mesh.visible = false
        if(time - start >= 0 && time - start < duration ) {
            this.rendering.push(item)
            item.mesh.visible = true
        }else if (start > time) {
            this.toRender.push(item)
        }
    }

    removeItem = (id) => {
        let idx = this.items.findIndex((e) => e.config.id === id)

        if (idx !== -1) {
            //this.scene.remove(this.items[idx].mesh)
            this.items = this.items.filter((_, i) => i !== idx)
            this.toRender = this.toRender.filter(e => e.config.id !== id)
            this.rendering = this.rendering.filter(e => e.config.id !== id)

        } else {
            console.log("unable to remove item")
        }
    }

    setSize = (width, height) => {
        this.width = width;
        this.height = height;
        const aspect = width / height

        if(this.config.scalePixelRatioOnExport) {
            this.textureCanvas.width =  aspect * height
            this.textureCanvas.height = height
        }else {
            this.textureCanvas.width =  aspect * this.config.pixelRatio
            this.textureCanvas.height = this.config.pixelRatio
        }

       this.items.forEach(item => item.setSize( this.textureCanvas.width,  this.textureCanvas.height))  
    }

    updateItem = (config, time) => {
        const item = this.items.find((e) => e.config.id === config.id)
        if (item) {
            item.updateConfig(config)
        } else {
            console.log("[scene.js] can't find id in: ", this.config.name, config, this.items)
            return
        }

        this.toRender = this.toRender.filter(e => e.config.id !== item.config.id)
        this.rendering = this.rendering.filter(e => e.config.id !== item.config.id)
        item.mesh.visible = false
        const { start, duration } = item.config
        
        if(time - start >= 0 && time - start < duration ) {
            this.rendering.push(item)
            item.mesh.visible = true
        }else if (start > time) {
            this.toRender.push(item)
        }
    }

    addOrRemove(toRender, rendering, time) {
        var i = rendering.length
        while (i--) {
            const e = rendering[i]
            const { start, duration } = e.config
            if (time >= start + duration) {
                rendering.splice(i, 1);
                e.mesh.visible = false
                e.stop()
            }
        }
        i = toRender.length
        while (i--) {
            const e = toRender[i]
            const { start } = e.config

            if (time >= start) {
                toRender.splice(i, 1);
                rendering.push(e)
                e.mesh.visible = true
                e.play(time)
            }
        }
    }

    addAutomation = (automation, itemId) => {
        const item = this.items.find(e=>e.id = itemId)
        item.automations.push(automation)  
    }

    editAutomationPoint = ( pointId, value, key, itemId ) => {
        const item = this.items.find(e=>e.id = itemId)
        const aIdx =  item.automations.findIndex(e => e.name === key)
        const pointIdx = item.automations[aIdx].points.findIndex(e => e.id === pointId)
        item.automations[aIdx].points[pointIdx].value = value
    }

    addAutomationPoint = ( point, key, itemId, automationId ) => {
        const item = this.items.find(e => e.id === itemId)
        const aIdx =  item.automations.findIndex(e => e.name === key)
        item.automations[aIdx].points.push(point)
    }

    animate = (time, frequencyBins) => {
    
        if(this.config.shouldUseClearRect) {
            this.textureCtx.clearRect(0, 0, this.textureCanvas.width, this.textureCanvas.height);
            
        }else {
            this.textureCtx.save();
            this.textureCtx.fillStyle = this.config.clearColor;
            this.textureCtx.globalAlpha = this.config.clearAlpha;
            this.textureCtx.fillRect(0,0, this.textureCanvas.width, this.textureCanvas.height)
            this.textureCtx.restore();
        }
        
        
        this.addOrRemove(this.toRender, this.rendering, time)
        this.rendering = this.rendering.sort((a, b) => a.config.zIndex - b.config.zIndex)
        
        this.rendering.forEach(item => {
            this.textureCtx.save();
            item.animate(time, frequencyBins);
            this.textureCtx.restore();
        } )
        //this.textureCtx.drawImage(this.canvas, 0, 0, this.textureCanvas.width, this.textureCanvas.height)
        this.texture.needsUpdate = true
    }

    render = ( renderer, postProcessingEnabled ) => { 

        if(!postProcessingEnabled)
            renderer.render(this.mainScene, this.mainCamera)

    }

    setTime = (time, playing, sItemId) => {
        this.items.forEach(e => e.setTime(time, playing, sItemId))
        this.stop()
        this.play(time)
    }

    play = (time) => {
        this.rendering = []
        this.toRender = []

        this.items.forEach(e => {
            const { start, duration } = e.config
            if(time - start >= 0 && time - start < duration ) {
                this.rendering.push(e)
                e.mesh.visible = true
                e.play()
            }else if (start > time) {
                this.toRender.push(e)
            }
        })
    }

    preProcess = () => {
        return new Promise((resolve, reject) => {
            resolve()
        })
    }

    stop = () => {
        //this.scene.children.forEach(e => e.visible = false)
        this.items.forEach(e => { e.stop() })
        this.rendering = []
        this.toRender = []
    }
}


import * as THREE from 'three'
import { add2DLayer } from '@redux/actions/items'

import Nebula from './items/nebula'
import InceptionCity from './items/inceptioncity'
import CircleRings from './items/circlerings';
import WaveletCanvas from './items/waveletcanvas';
import Square from './items/square';
import JSNation from './items/jsnation';
import RenderTarget from '../three/postprocessing/rendertarget';
import SimpleText from './items/text'

export default class SceneContainer {
    constructor(name, width, height, renderer) {

        this.renderer = renderer

        this.items      = []
        this.toRender   = []
        this.rendering  = []

        this.config = {
            id: Math.floor(Math.random() * 100000000),
            name: name,
            clearColor: "000000",
            clearAlpha: 1,
            shouldClear: true,
            zIndex: 1,
            heightResolution: 1024,
            widthResolution: 1024,
            defaultConfig: [ {
                title: "Settings", 
                items: {
                    heightResolution: {type: "Number", value: 1024, tooltip: "Must be a power of two" },
                    widthResolution: {type: "Number", value: 1024, tooltip: "Must be a power of two" },
                    clearColor: {type: "String", value: "000000"},
                    clearAlpha: {type: "Number", value: 1},
                    shouldClear: {type: "Boolean", value: true},
                    zIndex: {type: "Number", value: 1},
                    enablePostProcessing: {type: "Boolean", value: false}
                }
            }],
            items: [],
            width,
            height,
            passes: [],
            isThreeLayer: false
        }


        this.width = width
        this.height = height

        add2DLayer(this.config)
        this.textureCanvas = document.createElement('canvas');
        this.textureCanvas.width = 1024;
        this.textureCanvas.height = 1024;
        this.ctx = this.textureCanvas.getContext("2d");

        this.texture =  new THREE.CanvasTexture(this.textureCanvas)
        this.test = 0

        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.scene = new THREE.Scene();
        this.quad = new THREE.Mesh( 
            new THREE.PlaneBufferGeometry( 2, 2 ), 
            new THREE.MeshBasicMaterial( { map: this.texture, transparent: true } )
        );  
        this.scene.add(this.camera)


        this.mainCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.mainScene = new THREE.Scene();
        this.sceneConfig = {
            scene: this.mainScene,
            camera: this.mainCamera,
            renderer
        }

        this.renderTarget = new RenderTarget(name, width, height, this.sceneConfig)
        this.renderTarget.buffer.texture = this.texture

        this.internalQuad = new THREE.Mesh( 

            new THREE.PlaneBufferGeometry( 2, 2 ), 
            new THREE.MeshBasicMaterial( { map: this.renderTarget.buffer.texture, transparent: true } )
        );

       
        this.mainScene.add(this.internalQuad)   

        

       
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
        if(key === "widthResolution") this.textureCanvas.width = value    
        if(key === "heightResolution") this.textureCanvas.height = value    
    }

    moveItem = (item, up) => {
        const delta =  up ? -1 : 1
        let i1 = this.items.find(e => e.config.id === item.id)
        let i2 = this.items.find(e => e.config.renderIndex === i1.config.renderIndex + delta)
        i1.config.renderIndex = i1.config.renderIndex + delta
        i2.config.renderIndex = i2.config.renderIndex - delta
    }

    addItem = (name, info, time) => {
        info = {...info, name, time, canvas: this.textureCanvas, ctx: this.ctx, sceneId: this.config.id, renderIndex: this.items.length, height: this.height, width: this.width}
        let item; 

        switch (info.type) {
            case "TEXT":
                item = new SimpleText(info)
            break;
            case "JSNATION":
                item = new JSNation(info)
            break;
            case "SQUARE":
                item = new Square(info)
            break;
            case "POLARTONE":
                item = new WaveletCanvas(info)
            break;
            case "WAVELET CANVAS":
                item = new WaveletCanvas(info)
                break;
            case "NEBULOSA":
                item = new Nebula(info)
                break;
            case "INCEPTION CITY":
                item = new InceptionCity(info)
                break;
            case "CIRCLE RINGS":
                item = new CircleRings(info)
                break;
            default:
                console.log("unkown config type while adding object")
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
        this.mainCamera.aspect = width / height;
        this.renderTarget.setSize(width, height)
        if (this.mainCamera.isPerspectiveCamera)
            this.mainCamera.updateProjectionMatrix();

        this.width = width
        this.height = height
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

    addOrRemove(toRender, rendering, scene, time) {
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
        if(this.config.shouldClear) {
            this.ctx.fillStyle = "#" + this.config.clearColor
            this.ctx.fillRect(0, 0, this.textureCanvas.width, this.textureCanvas.height)
        }
        
        this.ctx.save()
        
        this.ctx.scale(1, this.width/this.height)        
        
        this.ctx.translate( 0, -( this.height / 4 / (this.height/this.width)))
        this.addOrRemove(this.toRender, this.rendering, this.mainScene, time)
        //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.rendering = this.rendering.sort((a, b) => a.config.renderIndex - b.config.renderIndex)
        this.rendering.forEach(item => item.animate(time, frequencyBins))
        this.texture.needsUpdate = true
        this.ctx.restore()
    }

    render = (renderer, time) => {
        if( this.config.enablePostProcessing ) {
            this.renderTarget.render( renderer, time )
            renderer.render(this.mainScene, this.mainCamera)
        }else {
            renderer.render(this.mainScene, this.mainCamera)
        }
    }

    setTime = (time, playing, sItemId) => {
        this.items.forEach(e => e.setTime(time, playing, sItemId))
        this.stop()
        this.play(time)
    }

    play = (time) => {
        this.items.forEach(e => {
            const { start, duration } = e.config
            if(time - start >= 0 && time - start < duration ) {
                this.rendering.push(e)
                e.mesh.visible = true
            }else if (start > time) {
                this.toRender.push(e)
            }
        })
    }

    stop = () => {
        //this.scene.children.forEach(e => e.visible = false)
        this.items.forEach(e => { e.stop() })
        this.rendering = []
        this.toRender = []
    }


    dispose = () => {
        let { camera, scene, light, controls } = this
        camera.dispose()
        scene.dispose()
        light.dispose()
        controls.dispose()
    }
}


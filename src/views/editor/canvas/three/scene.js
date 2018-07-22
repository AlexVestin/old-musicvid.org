import * as THREE from 'three'
import OrbitControls from './controls/orbitcontrols'

import Bars from './items/bars'
import Text3D from './items/text3d'
import Water from './items/water';
import BackgroundImage from './items/backgroundimage'
import Video from './items/video'
import TessellatedText from './items/tessellatedtext'
import Sphere from './items/sphere';
import RandomGeometry from './items/randomgeometry';

import RenderTarget from './postprocessing/rendertarget';
import { add3DLayer, replaceCamera, replaceControls } from '@redux/actions/items'
import cameraConfigs from './cameras/camera'
import controlConfigs from './controls/config'
import Particles from './items/particles';
import NorthernLights from './items/northernlights';
import TrackballControls from './controls/trackball';
import SkyBox from './items/skybox';
import SkyBox2 from './items/skybox2';
import AudioCircle from './items/audiocircle';


export default class SceneContainer {
    constructor(name, width, height, renderer) {

        this.scene = new THREE.Scene()
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
        this.renderer = renderer
        this.setLight(this.scene)

        this.items = []
        this.toRender = []
        this.rendering = []

        this.cameraConfig   = cameraConfigs.orthoConfig
        this.controlConfig  = controlConfigs.orbitConfig
        this.fogConfig      = {
            near: 500, 
            far: 2000, 
            color: "0xcce0ff", 
            enabled: false,
            defaultConfig: [{
                title: "Fog", 
                items: {
                    enabled:    { value: false, type: "Boolean" },
                    near:       { value: 500, type: "Number"},
                    far:        { value: 2000, type: "Number"},
                    color:      { value: "333333", type: "String"},
                }
            }] 
        }

        this.scene.fog = new THREE.Fog(0xfffff, 1, 1000)
        this.config = {
            id: Math.floor(Math.random() * 100000000),
            name: name,
            items: [],
            settings: {
                thing: 10,
                zIndex: 1,
                defaultConfig: [ {
                    title: "Settings", 
                    items: {
                        zIndex: {type: "Number", value: 1}
                    }
                }]
            },

            width,
            height,
            passes: [],
            camera: this.cameraConfig,
            controls: this.controlConfig,
            fog: this.fogConfig,
            isThreeLayer: true
        }

        this.sceneConfig = {
            scene: this.scene,
            camera: this.camera,
            renderer
        }
        
        add3DLayer(this.config)

        this.renderTarget = new RenderTarget(name, width, height, this.sceneConfig)
        this.texture = this.renderTarget.buffer.texture
        this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), new THREE.MeshBasicMaterial({map: this.texture, transparent: true}));
        this.quad.frustumCulled = false; 
    }

    editFog = (key, value) => {
        this.scene.fog[key] = value
    }

    editSettings = (key, value) => {
        this.config.settings[key] = value
    }

    editControls = (key, value) => {
        if(key === "type") {
            this.controls.dispose()
            if(value === "TrackballControl") {
                this.controls = new TrackballControls(this.camera, this.sceneConfig.renderer.domElement)
                this.controlConfig = controlConfigs.trackballConfig
                
            }else if(value === "OrbitControl") {
                this.controls = new OrbitControls(this.camera, this.sceneConfig.renderer.domElement)
               
                this.camera.lookAt(this.controls.target);
                this.controlConfig = controlConfigs.orbitConfig
            }else {
                alert("faulty control type name provided")
            }

            replaceControls(this.controlConfig)
            return
        }

        switch(key) {
            case "maxDistance":
            case "minDistance":
            case "maxPolarAngle":
            case "enabled":
            case "panSpeed":
            case "noZoom":
            case "noPan":
            case "rotateSpeed":
            case "zoomSpeed":
            case "staticMoving":
            case "dynamicDampingFactor":
                this.controls[key] = value
                break;
            case "targetX":
            case "targetY":
            case "targetZ":
                this.controls.target[key.substring(key.length - 1).toLowerCase()] =  value
                this.camera.lookAt(this.controls.target)
                break;
            default:   
        }


        this.controls.update()
    }

    editCamera = (key, value) => {
        const { width, height } = this.config
      
        if(key === "type") {
            if(value === "OrthographicCamera") {
                this.cameraConfig = cameraConfigs.orthoConfig
                this.camera = new THREE.OrthographicCamera()
            }else if (value === "PerspectiveCamera") {
                this.cameraConfig = cameraConfigs.perspectiveConfig
                this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000)
                this.camera.position.set(30, 30, 200)
            }else {
                alert("--------ERROR COULD NOT FIND CAMERA PROVIDED ----------")
                return
            }

            replaceCamera(this.cameraConfig)
        }

        if(this.cameraConfig.type === "PerspectiveCamera") {
            switch(key) {
                case "x":
                case "y":
                case "z":
                this.camera.position[key] = value; 
                break;
                case "fov":
                case "aspect":
                case "near":
                case "far":
                this.camera[key] = value;
                this.camera.updateProjectionMatrix();
                break;
                default:

            }
        }   
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

    moveItem = (item, up) => {
        const delta =  up ? -1 : 1
        let i1 = this.items.find(e => e.config.id === item.id)
        let i2 = this.items.find(e => e.config.renderIndex === i1.config.renderIndex + delta)
        i1.config.renderIndex = i1.config.renderIndex + delta
        i2.config.renderIndex = i2.config.renderIndex - delta
    }

    addItem = (name, info, time) => {
        info.name = name
        info.sceneId = this.config.id
        info.time = time
        info.renderIndex = this.items.length
        info.sceneConfig = {
            light: this.light,
            camera: this.camera,
            scene: this.scene
        }

        let item;
        switch (info.type) {
            case "AUDIO CIRCLE":
                item = new AudioCircle(info)
                break;
            case "NORTHERN LIGHTS":
                item = new NorthernLights(info)
                break;
            case "SKYBOX2":
                item = new SkyBox2(info)
                break;
            case "SKYBOX":
                item = new SkyBox(info)
                break;
            case "PARTICLES":
                item = new Particles(info)
                break;
            case "IMAGE":
                item = new BackgroundImage(info)
                break;
            case "BARS":
                item = new Bars(info)
                break;
            case "TEXT3D":
                item = new Text3D(info)
                break;
            case "WATER":
                item = new Water(info)
                break;
            case "VIDEO":
                item = new Video(info)
                break;
            case "TESSELATED TEXT":
                item = new TessellatedText(info)
                break;
            case "SPHERE":
                item = new Sphere(info)
                break;
            case "RANDOM GEOMETRY":
                item = new RandomGeometry(info)
                break;
            default:
                console.log("unkown config type while adding object")
        }

        this.items.push(item)
        this.scene.add(item.mesh)
        
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
            this.scene.remove(this.items[idx].mesh)
            this.items = this.items.filter((_, i) => i !== idx)
            this.toRender = this.toRender.filter(e => e.config.id !== id)
            this.rendering = this.rendering.filter(e => e.config.id !== id)

        } else {
            console.log("unable to remove item")
        }
    }

    setSize = (width, height) => {
        this.camera.aspect = width / height;
        this.renderTarget.setSize(width, height)
        if (this.camera.isPerspectiveCamera)
            this.camera.updateProjectionMatrix();
    }

    setCamera = () => {
        const { width, height } = this.config
        this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 20000)
        this.camera.position.set(30,30,200)
        this.cameraConfig = cameraConfigs.perspectiveConfig
        replaceCamera(this.cameraConfig)
        this.renderTarget.setCamera(this.camera)
    }

    setLight = (scene) => {
        let light = new THREE.DirectionalLight(0xffffff, 0.8);
        light.position.set(- 30, 30, 30);
        light.castShadow = true;
        light.shadow.camera.top = 45;
        light.shadow.camera.right = 40;
        light.shadow.camera.left = light.shadow.camera.bottom = -40;
        light.shadow.camera.near = 1;
        light.shadow.camera.far = 200;
        scene.add(light);
        this.light = light
    }

    setControls = (config) => {
        const { camera, renderer } = this
       
            let controls = new OrbitControls(camera, renderer.domElement);
            controls.maxPolarAngle = Math.PI * 0.495;
            controls.target.set(0, 10, 0);
            controls.panningMode = 1;
            controls.minDistance = 40.0;
            controls.maxDistance = 300.0;
        if(this.config.name !== "background") {
            camera.lookAt(controls.target);
        }
        this.controls = controls
        
    }

    updateItem = (config, time) => {
        const item = this.items.find((e) => e.config.id === config.id)
        if (item) {
            item.updateConfig(config)
        } else {
            console.log("[scene.js] can't find id", config, this.items)
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
        this.addOrRemove(this.toRender, this.rendering, this.scene, time)
        this.rendering.forEach(e =>  e.animate(time, frequencyBins))
        this.renderTarget.update(time, frequencyBins)
        if(this.controls)this.controls.update()
    }

    render = (renderer, time, postProcessingEnabled) => {
        //if(this.config.name === "graphics")console.log(this.config.postProcessingEnabled)
        if(postProcessingEnabled) {
            this.renderTarget.render( renderer, time)
        }else {
            renderer.render(this.scene, this.camera)
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
        this.scene.children.forEach(e => e.visible = false)
        this.items.forEach(e => { e.stop() })
        this.rendering = []
        this.toRender = []
        this.play(0)
    }


    dispose = () => {
        let { camera, scene, light, controls } = this
        camera.dispose()
        scene.dispose()
        light.dispose()
        controls.dispose()
    }
}


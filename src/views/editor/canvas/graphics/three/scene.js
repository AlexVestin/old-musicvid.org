import * as THREE from 'three'
import OrbitControls from './controls/orbitcontrols'

import Bars from './items/bars'
import Text3D from './items/text3d'
import BackgroundImage from './items/backgroundimage'
import Video from './items/video'
import TessellatedText from './items/tessellatedtext'
import Sphere from './items/sphere';
import RandomGeometry from './items/randomgeometry';

import { add3DLayer, replaceCamera, replaceControls } from '@redux/actions/items'
import cameraConfigs from './cameras/camera'
import controlConfigs from './controls/config'
import Particles from './items/particles';
import NorthernLights from './items/northernlights';
import TrackballControls from './controls/trackball';
import SkyBox from './items/skybox';
import SkyBox2 from './items/skybox2';
import AudioCircle from './items/audiocircle';
import NoiseBlob from './items/noiseblob/noiseblob';
import Object3D from './items/model'
import CirculatingLights from './items/circulatinglights';


export default class SceneContainer {
    constructor(name, width, height, renderer, fileConfig, camera, controls) {

        this.scene = new THREE.Scene()
        this.renderer = renderer

        this.items = []
        this.toRender = []
        this.rendering = []

        this.width = width
        this.height = height

        if(!fileConfig) {
            this.cameraConfig   = cameraConfigs.perspectiveConfig
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

            this.config = {
                id: Math.floor(Math.random() * 100000000),
                name: name,
                items: [],
                thing: 10,
                zIndex: 1,
                defaultConfig: [ {
                    title: "Settings", 
                    items: {
                        zIndex: {type: "Number", value: 1},
                    }
                }],
                width,
                height,
                passes: [],
                camera: this.cameraConfig,
                controls: this.controlConfig,
                fog: this.fogConfig,
                layerType: 1
            }

            add3DLayer(this.config)
        }else {
            this.cameraConfig   = camera
            this.controlConfig  = controls
            this.config = {...fileConfig}
        }

        this.sceneConfig = {
            scene: this.scene,
            camera: this.camera,
            renderer
        }
        
        this.target = new THREE.WebGLRenderTarget(width, height)
        this.quad = new THREE.Mesh( 
            new THREE.PlaneBufferGeometry( 2, 2 ), 
            new THREE.MeshBasicMaterial({transparent: true, map: this.target.texture})
        );

        this.setCamera()
        this.setControls()
    }

    editFog = (key, value) => {
        this.scene.fog[key] = value
    }

    editSettings = (key, value) => {
        this.config[key] = value
        if(key === "zIndex") this.quad.renderOrder = value
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
            case "autoRotateSpeedUp":
            case "autoRotateSpeedLeft":
            case "autoRotate":
                this.controls[key] = value
                break;
            case "controlsEnabled":
                this.controls.enabled = value;
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

    setFFTSize = (value) => {
        this.items.forEach(item => item.setFFTSize(value))
    }

    editCamera = (key, value) => {
        const { width, height } = this.config
      
        if(key === "type") {
            if(value === "OrthographicCamera") {
                this.cameraConfig = cameraConfigs.orthoConfig
                this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
            }else if (value === "PerspectiveCamera") {
                this.cameraConfig = cameraConfigs.perspectiveConfig
                this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000)
                this.camera.position.set(0, 0, 10)

                this.setControls();
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
    
    moveItem = (item, up) => {
        const delta =  up ? -1 : 1
        let i1 = this.items.find(e => e.config.id === item.id)
        let i2 = this.items.find(e => e.config.renderIndex === i1.config.renderIndex + delta)
        i1.config.renderIndex = i1.config.renderIndex + delta
        i2.config.renderIndex = i2.config.renderIndex - delta
    }

    updateItemFile = (config, newFile) => {
        const item = this.items.find((e) => e.config.id === config.id)
        if (item) {
            item.updateFile(newFile)
        } else {
            console.log("[scene.js] can't find id", config, this.items)
            return
        }
    }

    addItem = (name, info, time, config) => {
        info.name = name
        info.sceneId = this.config.id
        info.renderer = this.renderer
        info.time = time
        info.renderIndex = this.items.length
        info.width = this.width
        info.height = this.height
        info.sceneConfig = {
            light: this.light,
            camera: this.camera,
            scene: this.scene
        }

        if(config)info.type = config.itemType

        let item;
        switch (info.type) {
            case "CIRCULATING LIGHTS":
                item = new CirculatingLights(info, config)
                break;
            case "3D MODEL":
                item = new Object3D(info, config)
                break;
            case "NOISE BLOB":
                item = new NoiseBlob(info, config)
                break;
            case "AUDIO CIRCLE":
                item = new AudioCircle(info, config)
                break;
            case "NORTHERN LIGHTS":
                item = new NorthernLights(info, config)
                break;
            case "SKYBOX2":
                item = new SkyBox2(info, config)
                break;
            case "SKYBOX":
                item = new SkyBox(info, config)
                break;
            case "PARTICLES":
                item = new Particles(info, config)
                break;
            case "IMAGE":
                item = new BackgroundImage(info, config)
                break;
            case "BARS":
                item = new Bars(info, config)
                break;
            case "TEXT3D":
                item = new Text3D(info, config)
                break;
            case "VIDEO":
                item = new Video(info, config)
                break;
            case "TESSELATED TEXT":
                item = new TessellatedText(info, config)
                break;
            case "SPHERE":
                item = new Sphere(info, config)
                break;
            case "RANDOM GEOMETRY":
                item = new RandomGeometry(info, config)
                break;
            default:
                console.log("unkown config type while adding object", info.type)
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
            this.scene.remove(this.items[idx].mesh);
            this.items = this.items.filter((_, i) => i !== idx);
            this.toRender = this.toRender.filter(e => e.config.id !== id);
            this.rendering = this.rendering.filter(e => e.config.id !== id);

        } else {
            console.log("unable to remove item")
        }
    }

    setSize = (width, height) => {
        this.width = width;
        this.height = height;
        this.camera.aspect = width / height;
        if (this.camera.isPerspectiveCamera);
            this.camera.updateProjectionMatrix();
    }

    setCamera = () => {
        const { width, height } = this.config
        if(this.cameraConfig.type === "PerspectiveCamera") {
            const { far, near, fov, x, y, z } = this.cameraConfig
            this.camera = new THREE.PerspectiveCamera(fov, width / height, near, far)
            this.camera.position.set(x,y,z)        
        }else {
            const { far, near, left, top, bottom, right } = this.cameraConfig
            this.camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far)
        }
    }

    setControls = () => {
        const { camera, renderer } = this
        let controls;
        this.controls = {}

        if(this.cameraConfig.type !== "OrthographicCamera") {
            if(this.controlConfig.type === "OrbitControl") {
                controls = new OrbitControls(camera, renderer.domElement);
                const { maxPolarAngle, targetX, targetY, targetZ, panningMode, minDistance, maxDistance, enabled, autoRotateSpeedLeft, autoRotateSpeedRight, autoRotate } = this.controlConfig
                controls.maxPolarAngle = maxPolarAngle;
                controls.target.set(targetX, targetY, targetZ);
                controls.panningMode = panningMode;
                controls.minDistance = minDistance;
                controls.maxDistance = maxDistance;
                controls.autoRotate = autoRotate;
                controls.autoRotateSpeedLeft = autoRotateSpeedLeft;
                controls.autoRotateSpeedRight = autoRotateSpeedRight;
                controls.enabled = enabled;
                camera.lookAt(controls.target);
            }else {
    
            }

            this.controls = controls
        }
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
        if(this.controls)this.controls.update()
    }

    render = ( renderer, postProcessingEnabled ) => {
        renderer.render(this.scene, this.camera, postProcessingEnabled ? this.target : null, postProcessingEnabled)
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

    preProcess = () => {
        return new Promise((resolve, reject) => {
            resolve()
        })
    }

    stop = () => {
        this.scene.children.forEach(e => e.visible = false)
        this.items.forEach(e => { e.stop() })
        this.rendering = []
        this.toRender = []
    }

}

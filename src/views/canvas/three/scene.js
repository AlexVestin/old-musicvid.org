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
import { addLayer, replaceCamera } from '../../../redux/actions/items'
import cameraConfigs from './cameras/camera'
import controlConfigs from './controls/config'


import Particles from './items/particles';

export default class SceneContainer {
    constructor(name, width, height, renderer) {

        this.scene = new THREE.Scene()
        this.camera = new THREE.OrthographicCamera(-1,1,1,-1,0, 1)
        this.renderer = renderer
        this.setLight(this.scene)

        this.items = []
        this.toRender = []
        this.rendering = []

        this.cameraConfig = cameraConfigs.orthoConfig
        this.config = {
            id: Math.floor(Math.random() * 100000000),
            name: name,
            items: [],
            width,
            height,
            passes: [],
            camera: this.cameraConfig,
            controls: controlConfigs.config
        }

        const sceneConfig = {
            scene: this.scene,
            camera: this.camera,
            renderer
        }
        
        addLayer(this.config)
        this.renderTarget = new RenderTarget(name, width, height, sceneConfig)
        this.texture = this.renderTarget.buffer.texture
        this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), new THREE.MeshBasicMaterial({map: this.texture, transparent: true}));
        this.quad.frustumCulled = false; // Avoid getting clipped 
    }

    editControls = (key, value) => {
        console.log(key, value)
        switch(key) {
            case "maxDistance":
            case "minDistance":
            case "maxPolarAngle":
            case "enabled":
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
                this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 20000)
                this.camera.position.set(30,30,200)
            }else {
                alert("--------ERROR COULD NOT FIND CAMERA PROVIDED ----------")
                return
            }

            replaceCamera(this.cameraConfig)
        }

        if(this.cameraConfig.type === "PerspectiveCamera") {
            if(key === "x" || key  === "y" || key === "z") {
                this.camera.position[key] = value; 
                //this.controls.update()
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

    addItem = (name, info, time) => {
        info.name = name
        info.sceneId = this.config.id
        info.time = time
        info.sceneConfig = {
            light: this.light,
            camera: this.camera,
            scene: this.scene
        }

        let item;
        switch (info.type) {
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
        replaceCamera({...this.cameraConfig, x: 30, y: 30, z: 200, type: "PerspectiveCamera", aspect: width / height, near: 1, far: 20000})
        
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
        camera.lookAt(controls.target);
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
        if(time - start > 0 && time - start < duration ) {
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
        this.freqNr = frequencyBins[1]
    }

    render = (renderer, time, postProcessingEnabled) => {
        //if(this.config.name === "graphics")console.log(this.config.postProcessingEnabled)
        if(postProcessingEnabled) {
            this.renderTarget.render( renderer, time, this.freqNr)
        }else {
            renderer.render(this.scene, this.camera)
        }
    }

    setTime = (time, playing, sItemId) => {
        this.items.forEach(e => e.setTime(time, playing, sItemId))
        this.stop()
        this.play(time)
    }

    play = (time, fps) => {
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


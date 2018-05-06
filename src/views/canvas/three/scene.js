import * as THREE from 'three'
import OrbitControls from './controls/orbitcontrols'

import Bars from './items/bars'
import Text3D from './items/text3d'
import Water from './items/water';
import BackgroundImage from './items/backgroundimage'
import Video from './items/video'
import BaseItem from './items/item';
import TessellatedText from './items/tessellatedtext'
import Sphere from './items/sphere';
import RandomGeometry from './items/randomgeometry';

import RenderTarget from './postprocessing/rendertarget';
import EffectComposer from './postprocessing/effectcomposer';
import {addLayer} from '../../../redux/actions/items'

export default class SceneContainer {
    constructor(name, width, height, renderer) {

        this.scene = new THREE.Scene()
        this.camera = new THREE.Camera()
        this.renderer = renderer
        this.setLight(this.scene)

        this.items = []
        this.toRender = []
        this.rendering = []

        this.config = {
            id: Math.floor(Math.random() * 100000000),
            name: name,
            items: this.items,
            width,
            height
        }

        const sceneConfig = {
            scene: this.scene,
            camera: this.camera,
            renderer
        }

        this.renderTarget = new RenderTarget(name + " - rendertarget", width, height, sceneConfig)
        this.texture = this.renderTarget.buffer.texture
        this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), new THREE.MeshBasicMaterial({map: this.texture, transparent: true}));
        this.quad.frustumCulled = false; // Avoid getting clipped
        this.renderTarget.setCamera(this.camera)
        addLayer(this.config)
    }

    addItem = (name, info, time) => {
        info.name = name
        info.sceneId = this.config.id
        info.sceneConfig = {
            light: this.light,
            camera: this.camera
        }

        let item;
        switch (info.type) {
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
        const { start, duration } = item.config
        if (start >= time || (start < time && (start + duration) > time)) {
            this.toRender.push(item)
        }
    }

    removeItem = (config) => {
        let idx = this.items.findIndex((e) => e.config.id === config.id)

        if (idx !== -1) {
            this.scene.remove(this.items[idx].mesh)
            this.items = this.items.filter((_, i) => i !== idx)
            this.toRender = this.toRender.filter(e => e.config.id !== config.id)
            this.rendering = this.rendering.filter(e => e.config.id !== config.id)

        } else {
            console.log("unable to remove item")
        }

    }

    setSize = (width, height) => {
        this.camera.aspect = width / height;
        if (this.camera.isPerspectiveCamera)
            this.camera.updateProjectionMatrix();
    }

    setCamera = () => {
        const { width, height } = this.config
        this.camera = new THREE.PerspectiveCamera(55, width / height, 1, 20000)
        this.camera.position.set(30, 30, 100);
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
        controls.maxDistance = 200.0;
        camera.lookAt(controls.target);
        this.controls = controls
        this.scene.add(this.camera)

    }

    updateItem = (config) => {
        let it = this.items.find((e) => e.config.id === config.id)
        if (it) {
            it.updateConfig(config)
        } else {
            console.log("[scene.js] can't find id", config, this.items)
        }
    }

    addOrRemove(toRender, rendering, scene, time) {
        var i = rendering.length
        while (i--) {
            const e = rendering[i]
            const { start, duration } = e.config
            if (time >= start + duration) {
                rendering.splice(i, 1);
                scene.remove(e.mesh)
                e.stop()
            }
        }
        i = toRender.length
        while (i--) {
            const e = toRender[i]
            const { start } = e.config

            if (time >= start && scene.getObjectByName(e.mesh.name) === undefined) {
                toRender.splice(i, 1);
                rendering.push(e)
                scene.add(e.mesh)
                e.play(time)
            }
        }
    }

    animate = (time, frequencyBins) => {
        this.addOrRemove(this.toRender, this.rendering, this.scene, time)
        this.rendering.forEach(e => e.animate(time, frequencyBins))
        this.freqNr = frequencyBins[2]
    }

    render = (renderer, time) => {
        this.renderTarget.render( renderer, time, this.freqNr)
    }

    setTime = (time, playing) => {
        this.items.forEach(e => e.setTime(time, playing))
    }

    play = (time, fps) => {
        this.items.forEach(e => {
            const { start, duration } = e.config
            if (start >= time || (start < time && (start + duration) > time)) {
                this.toRender.push(e)
                //e.play(time)
            }
        })
    }

    stop = () => {
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }

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


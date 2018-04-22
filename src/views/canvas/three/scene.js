import * as THREE from 'three'
import OrbitControls from './controls/orbitcontrols'


import Bars from './items/bars'
import Text3D from './items/text3d'
import Water from './items/water';
import BackgroundImage from './items/backgroundimage'

import {addItem} from '../../../redux/actions/items'

export default class BarsScene {
    constructor(width, height, renderer){
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
          55,
          width / height,
          1,
          20000
        )
       
        camera.position.set( 30, 30, 100 );

        let light = new THREE.DirectionalLight( 0xffffff, 0.8 );
        light.position.set( - 30, 30, 30 );
        light.castShadow = true;
        light.shadow.camera.top = 45;
        light.shadow.camera.right = 40;
        light.shadow.camera.left = light.shadow.camera.bottom = -40;
        light.shadow.camera.near = 1;
        light.shadow.camera.far = 200;
        this.light = light
        scene.add( light );
        var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
        scene.add( ambientLight );
        scene.fog = new THREE.FogExp2( 0xaabbbb, 0.001 );

        
        this.scene = scene
        this.camera = camera
        this.items = []

        let controls = new OrbitControls( camera, renderer.domElement );
        controls.maxPolarAngle = Math.PI * 0.495;
        controls.target.set( 0, 10, 0 );
        controls.panningMode = 1;
        controls.minDistance = 40.0;
        controls.maxDistance = 200.0;
        camera.lookAt( controls.target );
        this.controls = controls

        this.backgroundLoaded = false

        this.sceneConfig = {
            light ,
            camera,
            scene,
            controls,
            renderer
        }

         // Create your background scene
        this.backgroundScene = new THREE.Scene();
        this.backgroundCamera = new THREE.Camera();
         
        this.backgroundScene.add(this.backgroundCamera );
        this.backgroundLoaded = true
        this.backgroundItems = []

        this.toRenderFG = []
        this.toRenderBG = []
    }

    add = (name, info) => {
        let item;
        switch(info.type) {
            case "IMAGE":
                item = new BackgroundImage(name, info, this.backgroundScene)
                this.backgroundItems.push(item)
                break;
            case "BARS":
                item = new Bars(info, this.sceneConfig)
                this.items.push(item)
                break;
            case "TEXT3D":
                item = new Text3D(info, this.sceneConfig)
                this.items.push(item)
                break;
            case "WATER":
                item = new Water(info, this.sceneConfig)
                this.items.push(item)
                break;
            default:
                console.log("unkown config type while adding object")
        }

        addItem(item.defaultConfig)
    }

    stop = () => {
        while(this.scene.children.length > 0){ 
            this.scene.remove(this.scene.children[0]); 
        }

        while(this.backgroundScene.children.length > 0){ 
            this.backgroundScene.remove(this.backgroundScene.children[0]); 
        }

        this.toRenderFG = []
        this.toRenderBG = []
    }

    play = (time) => {
        this.items.forEach(e => {
            if(e.config.start >= time)
                this.toRenderFG.push(e)
        })

        this.backgroundItems.forEach(e => {
            if(e.config.start >= time) {
                this.toRenderBG.push(e)
            }
        })
    }

    updateConfig = (config) => {
        let it = this.items.find((e) => e.config.id === config.id.value)
        if(!it)
            it = this.backgroundItems.find((e) => e.config.id === config.id.value)
        
        it.updateConfig(config)
    }

    addOrRemove(toRender, scene, time) {
        var i = toRender.length
        while (i--) {
            const e = toRender[i]
            const { start, duration } = e.config

            if (time >= (start+duration) / 100) { 
                toRender.splice(i, 1);
                scene.remove(e.mesh)
                return
            } 
            if(time >= (start / 100 ) && scene.getObjectByName(e.mesh.name) === undefined) {
                scene.add(e.mesh)
            }
        }
    }

    animate = (time, frequencyBins) => {
        this.addOrRemove(this.toRenderFG, this.scene, time)
        this.addOrRemove(this.toRenderBG, this.backgroundScene, time)
        
        this.items.forEach(e => e.animate(time, frequencyBins))
    }

    render = (renderer) => {
        renderer.clear();

        if(this.backgroundLoaded){
            renderer.render(this.backgroundScene, this.backgroundCamera)
        }

        renderer.clearDepth();
        renderer.render(this.scene, this.camera)
    }

    dispose = () => {
        let { camera, scene, light, controls } = this
        camera.dispose()
        scene.dispose()
        light.dispose()
        controls.dispose()
    }
} 


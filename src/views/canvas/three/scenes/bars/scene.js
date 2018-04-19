import * as THREE from 'three'
import OrbitControls from '../../controls/orbitcontrols'
import Bars from '../../items/bars'

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

    }

    addItem = (config) => {
        switch(config.type){
            case "BARS":
                console.log("add some bars")
                this.items.push(new Bars(config, this.scene))
                break;
            default:
                console.log("unkown config type while adding object")
        }
    }

    updateConfig = (config) => {
        let it = this.items.find((e) => e.name === config.name)
        it.updateConfig(config)
    }

    animate = (time, frequencyBins) => {
        this.items.forEach(e => e.animate(time, frequencyBins))
    }

    dispose = () => {
        let { camera, scene, light, controls } = this
        camera.dispose()
        scene.dispose()
        light.dispose()
        controls.dispose()
    }
} 



import * as THREE from 'three'
import BaseItem from '../../itemtemplates/item'

export default class CirculatingLights extends BaseItem {
    constructor(config, fileConfig, sceneConfig) {
        super(config)
        this.scene = sceneConfig.scene
        
        if(!fileConfig) {
            const meshGroup = {
                title: "Movement",
                items: {
                    speed: {type: "Number", value: 0.5 + Math.random()/ 2},
                    radiusOne: {type: "Number", value: Math.floor(15 + Math.random() * 15)},
                    ampOne: {type: "Number", value: 0.5 + Math.random() / 2},
                    drawSphere: { type: "Boolean", value: true}
                }
            }
            
            this.config.defaultConfig.push(meshGroup)
            this.getConfig()
            this.addItem()
        }else {
            this.config = {...fileConfig}
        }

        this.mesh = new THREE.Group()
        this.addLights()
    }

    addLights = () => {
        this.sphere = new THREE.SphereBufferGeometry( 0.5, 16, 8 );
        this.light1 = new THREE.PointLight( 0xff0040, 2, 50 );
        this.light1.add( new THREE.Mesh(this.sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
        this.mesh.add( this.light1 );
    }

 
    _updateConfig = (config) => {
        this.sphere.visible = config.drawSphere
        this.config = config
    }

    animate = (time, audioData) => {
        const  { radiusOne, radiusTwo, ampOne, ampTwo, ampThree, speed } = this.config

        let t = time * speed
        this.light1.position.x = Math.sin( t * ampOne ) * radiusOne;
        this.light1.position.y = Math.cos( t * ampTwo ) * radiusTwo;
        this.light1.position.z = Math.cos( t * ampThree ) * radiusOne;
    }
}

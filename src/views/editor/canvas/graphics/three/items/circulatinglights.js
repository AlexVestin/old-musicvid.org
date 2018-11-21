
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
                    speed: {type: "Number", value: 1},
                    radiusOne: {type: "Number", value: 30},
                    radiusTwo: {type: "Number", value: 40},
                    ampOne: {type: "Number", value: 0.7},
                    ampTwo: {type: "Number", value: 0.5},
                    ampThree: {type: "Number", value: 0.3},
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
        var sphere = new THREE.SphereBufferGeometry( 0.5, 16, 8 );
        this.light1 = new THREE.PointLight( 0xff0040, 2, 50 );
        this.light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
        this.mesh.add( this.light1 );
        this.light2 = new THREE.PointLight( 0x0040ff, 2, 50 );
        this.light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x0040ff } ) ) );
        this.mesh.add( this.light2 );
        this.light3 = new THREE.PointLight( 0x80ff80, 2, 50 );
        this.light3.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x80ff80 } ) ) );
        this.mesh.add( this.light3 );
        this.light4 = new THREE.PointLight( 0xffaa00, 2, 50 );
        this.light4.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffaa00 } ) ) );
        this.mesh.add( this.light4 );
    }

 
    _updateConfig = (config) => {
        this.config = config
    }

    animate = (time, audioData) => {
        const  { radiusOne, radiusTwo, ampOne, ampTwo, ampThree, speed } = this.config

        let t = time * speed
        this.light1.position.x = Math.sin( t * ampOne ) * radiusOne;
        this.light1.position.y = Math.cos( t * ampTwo ) * radiusTwo;
        this.light1.position.z = Math.cos( t * ampThree ) * radiusOne;

        this.light2.position.x = Math.cos( t * ampThree ) * radiusOne;
        this.light2.position.y = Math.sin( t * ampTwo ) * radiusTwo;
        this.light2.position.z = Math.sin( t * ampOne ) * radiusOne;

        this.light3.position.x = Math.sin( t * ampOne ) * radiusOne;
        this.light3.position.y = Math.cos( t * ampThree ) * radiusTwo;
        this.light3.position.z = Math.sin( t * ampTwo ) * radiusOne;

        this.light4.position.x = Math.sin( t * ampThree ) * radiusOne;
        this.light4.position.y = Math.cos( t * ampOne ) * radiusTwo;
        this.light4.position.z = Math.sin( t * ampTwo ) * radiusOne;
    
    }
}


import * as THREE from 'three'
import BaseItem from '../../itemtemplates/item'
import AudioImpactItem from '../../itemtemplates/audioimpactitem';

export default class CirculatingLights extends AudioImpactItem {
    constructor(config, fileConfig, sceneConfig) {
        super(config)
        this.scene = sceneConfig.scene
        
        if(!fileConfig) {
            const meshGroup = {
                title: "Movement",
                items: {
                    speed: {type: "Number", value: 0.5 + Math.random() * 0.5},
                    radiusOne: {type: "Number", value: 10 + Math.floor(Math.random() * 40)},
                    radiusTwo: {type: "Number", value: 20 + Math.floor(Math.random() * 30)},
                    ampOne: {type: "Number", value: 0.3 + Math.random() * 0.7},
                    ampTwo: {type: "Number", value: 0.5 + Math.random() * 0.5},
                    ampThree: {type: "Number", value: 0.3 + Math.random() * 0.7},
                    drawSphere: {type: "Boolean", value: true},
                    color: {type: "Color", value: "FFFFFFF"},
                    intensity: {type: "Number", value: 4*Math.PI},
                    cosX: {type: "Boolean", value: false, tooltip:"Use cos to determine the x position. (sin if false) uses \n position.x = Math.sin( t * ampOne + cosX ? Math.PI/2 : 0 ) * radiusOne;"},
                    cosY: {type: "Boolean", value: true, tooltip:"Use cos to determine the y position. (sin if false) uses \n position.y = Math.sin( t * ampOne + cosY ? Math.PI/2 : 0 ) * radiusTwo;"},
                    cosZ: {type: "Boolean", value: true, tooltip:"Use cos to determine the z position. (sin if false) uses \n position.z = Math.sin( t * ampOne + cosZ ? Math.PI/2 : 0 ) * radiusOne;"},
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
        this.light1 = new THREE.PointLight( 0x550040, 2, 50 );
        this.sphereMesh = new THREE.Mesh(this.sphere, new THREE.MeshBasicMaterial( { color: 0x550040, transparent: true} ) ); 
        this.light1.add( this.sphereMesh );
        
        this.mesh.add( this.light1 );
    }

 
    _updateConfig = (config) => {
        this.sphereMesh.visible = config.drawSphere;
        this.light1.color =  new THREE.Color(parseInt(config.color, 16))
        this.light1.power = config.intensity;
        //this.sphereMesh.material.color = "#" + config.color;
        this.config = config;
    }

    animate = (time, audioData) => {
        const  { radiusOne, radiusTwo, ampOne, ampTwo, ampThree, speed, cosX, cosY, cosZ } = this.config;

        let t = time * speed;
        
        const amp = this.getImpactAmplitude(audioData.bins) || 1;
       
        this.light1.power = this.config.intensity * amp;
        console.log(this.config.intensity, amp, this.light1.power);
        this.light1.position.x = Math.sin( t * ampOne + (cosX ? Math.PI/2 : 0)) * radiusOne;
        this.light1.position.y = Math.sin( t * ampTwo + (cosY ? Math.PI/2 : 0)) * radiusTwo;
        this.light1.position.z = Math.sin( t * ampThree + (cosZ ? Math.PI/2 : 0)) * radiusOne;
    }
}

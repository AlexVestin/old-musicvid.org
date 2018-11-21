


import * as THREE from 'three'
import ThreeWater from "./waterclass"
import BaseItem from '../../itemtemplates/item'

export default class NorthernLights extends BaseItem{
    constructor(config, fileConfig, sceneConfig) {
        super(config)
        this.light = sceneConfig.light
        this.getConfig()
        const parameters = {
            oceanSide: 2000,
            size: 1.0,
            distortionScale: 3.7,
            alpha: 1.0
        };


        const group = {
            title: "Settings",
            items: {
                oceanSide: {type: "Number", value: 2000},
                size: {type: "Number", value: 1},
                distortionScale: { type: "Number", value: 3.7},
                alpha: {type: "Number", value: 1},
                waterColor: {type:"String", value: "FF1E0F"}
            }
        }
        
        var waterGeometry = new THREE.PlaneBufferGeometry(parameters.oceanSide * 5, parameters.oceanSide * 5 );
        this.water = new ThreeWater(
            waterGeometry,
            {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: new THREE.TextureLoader().load( 'img/waternormals.jpg', function ( texture ) {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                }),
                alpha: parameters.alpha,
                sunDirection: this.light.position.clone().normalize(),
                sunColor: 0xffffff,
                waterColor: 0xff1e0f,
                distortionScale: parameters.distortionScale,
                fog: false
            }
        );

        this.config.defaultConfig.push(group)
        this.mesh = this.water 
        
        this.mesh.name = String(this.config.id)
        if(!fileConfig) {
            const attribution = { 
                title: "Author Information", 
                items: {
                    website: {value: "https://github.com/mrdoob/three.js/blob/master/examples/", type: "Link", disabled: false},
                }
            }
            this.config.defaultConfig.unshift(attribution)

            this.getConfig()
            this.addItem()
        }else {
            this.config = {...fileConfig}
        }
       
    }

    _updateConfig = (config) => {
        this.water.material.uniforms.waterColor.value =  new THREE.Color("#" + config.waterColor)
        this.water.material.uniforms.alpha.value =  config.alpha
        this.water.material.uniforms.size.value =  config.size
        this.water.material.uniforms.distortionScale.value =  config.distortionScale

        this.config = config
    }

    _animate = (time, frequencyBins) => {
        let { water } = this

        water.material.uniforms.time.value += 1.0 / 60.0;
    }
}







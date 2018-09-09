


import * as THREE from 'three'
import ThreeWater from "./waterclass"
import BaseItem from '../../itemtemplates/item'

export default class Water extends BaseItem{
    constructor(config) {
        super(config)
        this.light = config.sceneConfig.light
        this.getConfig()
        const parameters = {
            oceanSide: 2000,
            size: 1.0,
            distortionScale: 3.7,
            alpha: 1.0
        };
        
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
                waterColor: 0x001e0f,
                distortionScale: parameters.distortionScale,
                fog: true
            }
        );

        this.parameters = parameters
        this.mesh = this.water 
        
        this.mesh.name = String(this.config.id)
        this.addItem()
    }

    _animate = (time, frequencyBins) => {
        let { water, parameters } = this
        water.material.uniforms.time.value += 1.0 / 60.0;
        water.material.uniforms.size.value = parameters.size;
        water.material.uniforms.distortionScale.value = parameters.distortionScale;
        water.material.uniforms.alpha.value = parameters.alpha;
    }
}







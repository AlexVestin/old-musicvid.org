


import * as THREE from 'three'
import BaseItem from '../../itemtemplates/item'
//SKYBOX BY HAROON GHAZNI http://www.hghazni.com/


export default class SkyBox2 extends BaseItem {
    constructor(config, fileConfig) {
        super(config)
        var cubeTextureLoader = new THREE.CubeTextureLoader();
        cubeTextureLoader.setPath( 'img/skyboxes/three-skybox/' );

        this.parameters = {
            oceanSide: 2000,
            size: 1.0,
            distortionScale: 3.7,
            alpha: 1.0
        };

        this.cubeMap = cubeTextureLoader.load( [
            'nightsky_ft.png', 'nightsky_bk.png',
            'nightsky_up.png', 'nightsky_dn.png',
            'nightsky_rt.png', 'nightsky_lf.png',
        ] );
        var cubeShader = THREE.ShaderLib[ 'cube' ];
        cubeShader.uniforms[ 'tCube' ].value = this.cubeMap;
        var skyBoxMaterial = new THREE.ShaderMaterial( {
            fragmentShader: cubeShader.fragmentShader,
            vertexShader: cubeShader.vertexShader,
            uniforms: cubeShader.uniforms,
            side: THREE.BackSide
        } );
        var skyBoxGeometry = new THREE.BoxBufferGeometry(
            this.parameters.oceanSide * 5 + 100,
            this.parameters.oceanSide * 5 + 100,
            this.parameters.oceanSide * 5 + 100 
        );
        this.mesh = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
        this.mesh.name = String(this.config.id)

       
        if(!fileConfig) {
            const attribution = { 
                title: "Author Information", 
                items: {
                    creator: {value: "Haroon Ghazni", type: "Text"},
                    website: { value: "https://github.com/hghazni/Three.js-Skybox", type: "Link", disabled: false},
                }
            }
            this.config.defaultConfig.unshift(attribution)
            this.getConfig()
            this.addItem()
        }else {
            this.config = {...fileConfig}
        }
        
    }

    animate = (time, frequencyBins) => {

    }
}







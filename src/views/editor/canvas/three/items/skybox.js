


import * as THREE from 'three'
import BaseItem from './item';

export default class SkyBox extends BaseItem {
    constructor(config) {
        super(config)
        var cubeTextureLoader = new THREE.CubeTextureLoader();
        cubeTextureLoader.setPath( 'img/skyboxes/skyboxsun25deg/' );

        this.parameters = {
            oceanSide: 2000,
            size: 1.0,
            distortionScale: 3.7,
            alpha: 1.0
        };

        this.cubeMap = cubeTextureLoader.load( [
            'px.jpg', 'nx.jpg',
            'py.jpg', 'ny.jpg',
            'pz.jpg', 'nz.jpg',
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
            this.parameters.oceanSide * 5 + 100 );
        this.mesh = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
        
        this.mesh.name = String(this.config.id)
        this.addItem()
    }

    animate = (time, frequencyBins) => {

    }
}







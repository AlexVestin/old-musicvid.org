/**
 * @author alteredq / http://alteredqualia.com/
 */

import Pass from '../passtemplates/pass'
import * as THREE from 'three' 
export default class ShaderPass extends Pass  {

    constructor(shader, config, fileConfig) {
        super(config);
        this.textureID = "tDiffuse";

        if ( shader instanceof THREE.ShaderMaterial ) {
            this.uniforms = shader.uniforms;
            this.material = shader;
        } else if ( shader ) {
            this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );
            this.material = new THREE.ShaderMaterial( {

                defines: Object.assign( {}, shader.defines ),
                uniforms: this.uniforms,
                vertexShader: shader.vertexShader,
                fragmentShader: shader.fragmentShader

            } );
        }

        this.camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
        this.scene = new THREE.Scene();

        this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null );
        this.quad.frustumCulled = false; // Avoid getting clipped
        this.scene.add( this.quad );
        
        if(config) {
            this.config.type = config.type
            if(!(config.shouldAdd === false || fileConfig !== undefined)) 
                this.addEffect(this.config)
        } 
    }

    render( renderer, writeBuffer, readBuffer, delta, maskActive ) {

		if ( this.uniforms[ this.textureID ] ) {

			this.uniforms[ this.textureID ].value = readBuffer.texture;

		}

		this.quad.material = this.material;

		if ( this.renderToScreen ) {

			renderer.render( this.scene, this.camera );

		} else {

			renderer.render( this.scene, this.camera, writeBuffer, this.clear );

		}

	}
}

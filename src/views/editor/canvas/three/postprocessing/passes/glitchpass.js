/**
 * @author alteredq / http://alteredqualia.com/
 */

import Pass from './pass'
import * as THREE from 'three'
import DigitalGlitch from '../shaders/glitchshader'

export default class GlitchPass extends Pass {
    constructor( dt_size ) {
		super("glitch")
		const group = {
			title: "audio reactive settings",
			items: {
				ampThreshold: {value: 2, type: "Number", tooltip: "Amount needed to trigger a glitch effect"},
				amount: {value: 1, type: "Number", tooltip: "How strong the glitch will be"},
			}
		}
		
		this.config.defaultConfig.push(group)
		this.config.ampThreshold = 2
		this.config.amount = 1
		

        if ( DigitalGlitch === undefined ) console.error( "THREE.GlitchPass relies on THREE.DigitalGlitch" );

        var shader = DigitalGlitch;
        this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

        if ( dt_size === undefined ) dt_size = 64;


        this.uniforms[ "tDisp" ].value = this.generateHeightmap( 64 );


        this.material = new THREE.ShaderMaterial( {
            uniforms: this.uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader
        } );

        this.camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
        this.scene  = new THREE.Scene();

        this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null );
        this.quad.frustumCulled = false; // Avoid getting clipped
        this.scene.add( this.quad );

        this.goWild = false;
        this.curF = 0;
		this.generateTrigger();
		this.addEffect(this.config)
	}
	
	update = (time, audioData) => {
		let sum = 0
		for(var i = 0; i < 13; i++) {
			sum += audioData.bins[i] / 13
		}
		this.amp = sum / 100
	}

    render ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

		this.uniforms[ "tDiffuse" ].value = readBuffer.texture;
		this.uniforms[ 'seed' ].value = Math.random();//default seeding
		this.uniforms[ 'byp' ].value = 0;
		if(!this.amp)this.amp = 0
		if ( this.amp > this.config.ampThreshold ) {
			this.uniforms[ 'amount' ].value = this.config.amount * Math.random() / 30;
			this.uniforms[ 'angle' ].value = THREE.Math.randFloat( - Math.PI, Math.PI );
			this.uniforms[ 'seed_x' ].value = THREE.Math.randFloat( - 1, 1 );
			this.uniforms[ 'seed_y' ].value = THREE.Math.randFloat( - 1, 1 );
			this.uniforms[ 'distortion_x' ].value = THREE.Math.randFloat( 0, 1 );
			this.uniforms[ 'distortion_y' ].value = THREE.Math.randFloat( 0, 1 );
			this.curF = 0;
			this.generateTrigger();

		} else if ( this.curF % this.randX < this.randX / 20 ) {

			this.uniforms[ 'amount' ].value = Math.random() / 90 *  this.config.amount;
			this.uniforms[ 'angle' ].value = THREE.Math.randFloat( - Math.PI, Math.PI );
			this.uniforms[ 'distortion_x' ].value = THREE.Math.randFloat( 0, 1 );
			this.uniforms[ 'distortion_y' ].value = THREE.Math.randFloat( 0, 1 );
			this.uniforms[ 'seed_x' ].value = THREE.Math.randFloat( - 0.3, 0.3 );
			this.uniforms[ 'seed_y' ].value = THREE.Math.randFloat( - 0.3, 0.3 );

		} else if ( this.goWild == false ) {

			this.uniforms[ 'byp' ].value = 1;

		}

		this.curF ++;
        this.quad.material = this.material;
        
		if ( this.renderToScreen ) {
			renderer.render( this.scene, this.camera );
		} else {
			renderer.render( this.scene, this.camera, writeBuffer, this.clear );
		}

	}

	generateTrigger() {

		this.randX = THREE.Math.randInt( 120, 240 );

	}

	generateHeightmap( dt_size ) {

		var data_arr = new Float32Array( dt_size * dt_size * 3 );
		var length = dt_size * dt_size;

		for ( var i = 0; i < length; i ++ ) {

			var val = THREE.Math.randFloat( 0, 1 );
			data_arr[ i * 3 + 0 ] = val;
			data_arr[ i * 3 + 1 ] = val;
			data_arr[ i * 3 + 2 ] = val;

		}

		var texture = new THREE.DataTexture( data_arr, dt_size, dt_size, THREE.RGBFormat, THREE.FloatType );
		texture.needsUpdate = true;
		return texture;

	}
};


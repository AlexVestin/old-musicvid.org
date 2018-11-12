/**
 * @author alteredq / http://alteredqualia.com/
 */

import Pass from '../passtemplates/audioreactivepass'
import * as THREE from 'three'
import DigitalGlitch from '../shaders/glitchshader'

export default class GlitchPass extends Pass {
    constructor( config, dt_size, fileConfig ) {
		super(config)

		if(!fileConfig) {
			this.config = {
				...this.config,
				shouldDistX: true,
				shouldDistY: true,
				shouldAngle: true,
				shouldSeedX: true,
				shouldSeedY: true,
				amount: 0.2,
				col_s: 0.05
			}
			const group = {
				title: "Glitch Settings",
				
				items: {
					shouldRandomTrigger: {value: true, type: "Boolean", tooltip: "Trigger a glitch at random times"},
					amount: {value: 0.2, type: "Number", tooltip: "How strong the glitch will be"},
					col_s: {value: 0.04, type: "Number"},
					shouldAngle: {value:true, type:"Boolean"},
					shouldSeedX: {value:true, type:"Boolean"},
					shouldSeedY: {value:true, type:"Boolean"},
					shouldDistX: {value:true, type:"Boolean"},
					shouldDistY: {value:true, type:"Boolean"},
				}
			}
			
			this.config.defaultConfig.push(group)
			this.addEffect(this.config)
		}else {
			this.config = {...fileConfig}
		}

		this.config.type = config.type
		
		
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
		
	}
	
	update = (time, audioData) => {
		this.amp = this.getImpactAmplitude(audioData.bins) / 2;
	}

    render ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

		this.uniforms[ "tDiffuse" ].value = readBuffer.texture;
		this.uniforms[ 'seed' ].value = Math.random();//default seeding
		this.uniforms[ 'byp' ].value = 0;
		this.uniforms[ 'col_s' ].value = this.config.col_s;
		if(!this.amp)this.amp = 0
		if ( this.amp > this.config.threshold ) {
			this.uniforms[ 'amount' ].value = this.config.amount * Math.random() / 30;
			if(this.config.shouldAngle)this.uniforms[ 'angle' ].value = THREE.Math.randFloat( - Math.PI, Math.PI );
			if(this.config.shouldSeedX)this.uniforms[ 'seed_x' ].value = THREE.Math.randFloat( - 1, 1 );
			if(this.config.shouldSeedY)this.uniforms[ 'seed_y' ].value = THREE.Math.randFloat( - 1, 1 );
			if(this.config.shouldDistX)this.uniforms[ 'distortion_x' ].value = THREE.Math.randFloat( 0, 1 );
			if(this.config.shouldDistY)this.uniforms[ 'distortion_y' ].value = THREE.Math.randFloat( 0, 1 );
			this.curF = 0;
			this.generateTrigger();

		} else if ( this.config.shouldRandomTrigger && this.curF % this.randX < this.randX / 20 ) {

			this.uniforms[ 'amount' ].value = Math.random() / 90 *  this.config.amount;
			this.uniforms[ 'angle' ].value = THREE.Math.randFloat( - Math.PI, Math.PI );
			this.uniforms[ 'distortion_x' ].value = THREE.Math.randFloat( 0, 1 );
			this.uniforms[ 'distortion_y' ].value = THREE.Math.randFloat( 0, 1 );
			this.uniforms[ 'seed_x' ].value = THREE.Math.randFloat( - 0.3, 0.3 );
			this.uniforms[ 'seed_y' ].value = THREE.Math.randFloat( - 0.3, 0.3 );

		} else if ( this.goWild === false ) {
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


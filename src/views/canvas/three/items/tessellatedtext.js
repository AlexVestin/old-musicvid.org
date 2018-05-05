
import * as THREE from 'three'
import {  AudioreactiveItem } from './item';
import { modify  } from './modifiers/tessellatemodifier'


const vertexShader = [
    "uniform float amplitude;",
    "attribute vec3 customColor;",
    "attribute vec3 displacement;",
    "varying vec3 vNormal;",
    "varying vec3 vColor;",
    "void main() {",
        "vNormal = normal;",
        "vColor = customColor;",
        "vec3 newPosition = position + normal * amplitude * displacement;",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );",
    "}"]

const fragmentShader = [
    "varying vec3 vNormal;",
			"varying vec3 vColor;",
			"void main() {",
				"const float ambient = 0.4;",
				"vec3 light = vec3( 1.0 );",
				"light = normalize( light );",
				"float directional = max( dot( vNormal, light ), 0.0 );",
				"gl_FragColor = vec4( ( directional + ambient ) * vColor, 1.0 );",
			"}"]





export default class TessellatedText extends AudioreactiveItem {
    constructor(config) {
        super(config)
        this.bins = []

        this.defaultConfig.text = {value: "text", type: "String", tooltip: "", editable: true}
        this.defaultConfig.fontSize = {value: 5, type: "Number", tooltip: "", editable: true}
        this.defaultConfig.threshold = {value: 0.3, type: "Number", tooltip: "Delta amplitude needed to trigger a rerender", editable: true}
        this.defaultConfig.scale = {value: 200, type: "Number", tooltip: "", editable: true}

        var loader = new THREE.FontLoader();
        this.mesh = new THREE.Mesh()

        this.getConfig(this.defaultConfig)
        this.mesh = new THREE.Mesh()
        loader.load('optimer_regular.typeface.json', (font) => {
            this.font = font; 
            this.createTextMesh()
            .then((mesh) => this.addItem())
        })    

        this.amplitude = 0
    }

    createTextMesh = () => {
        var data = {
            size: 5,
            height: 2,
            curveSegments: 12,
            font: "helvetiker",
            weight: "regular",
            bevelEnabled: false,
            bevelThickness: 1,
            bevelSize: 0.5,
            bevelSegments: 3
        };

        return new Promise((resolve, reject) => {
            const { fontSize, text} = this.config
            var geometry = new THREE.TextGeometry( 
                text, {
                color: this.config.color,
                font: this.font,
                size: fontSize,
                height: data.height,
                curveSegments: data.curveSegments,
                bevelEnabled: data.bevelEnabled,
                bevelThickness: data.bevelThickness,
                bevelSize: data.bevelSize,
                bevelSegments: data.bevelSegments
            })

            for ( var i = 0; i < 6; i ++ ) {
				modify( geometry );
			}

            geometry = new THREE.BufferGeometry().fromGeometry( geometry );
			var numFaces = geometry.attributes.position.count / 3
			var colors = new Float32Array( numFaces * 3 * 3 );
			var displacement = new Float32Array( numFaces * 3 * 3 );
			var color = new THREE.Color();
			for ( var f = 0; f < numFaces; f ++ ) {
				var index = 9 * f;
				var h = 0.2 * Math.random();
				var s = 0.5 + 0.5 * Math.random();
				var l = 0.5 + 0.5 * Math.random();
				color.setHSL( h, s, l );
				var d = 10 * ( 0.5 - Math.random() );
				for ( var i = 0; i < 3; i ++ ) {
					colors[ index + ( 3 * i )     ] = color.r;
					colors[ index + ( 3 * i ) + 1 ] = color.g;
					colors[ index + ( 3 * i ) + 2 ] = color.b;
					displacement[ index + ( 3 * i )     ] = d;
					displacement[ index + ( 3 * i ) + 1 ] = d;
					displacement[ index + ( 3 * i ) + 2 ] = d;
				}
			}
			geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
			geometry.addAttribute( 'displacement', new THREE.BufferAttribute( displacement, 3 ) );

            this.uniforms = {
				amplitude: { value: 0.0 }
			};
			var shaderMaterial = new THREE.ShaderMaterial( {
                uniforms: this.uniforms,
				vertexShader:  vertexShader.join("\n"),
				fragmentShader: fragmentShader.join("\n")
			});

            this.mesh.geometry = geometry
            this.mesh.material = shaderMaterial
            this.mesh.name = String(this.config.id)
            resolve(this.mesh)
        })
    }

    update = () => {
        this.mesh.position.x = this.config.centerX
        this.mesh.position.y = this.config.centerY
    }

    updateConfig = (config) => {
        const { text, fontSize } = this.config
        this.config = config


        if(text !== config.text || fontSize !== config.fontSize) {
            this.createTextMesh().then((mesh) => {this.mesh = mesh; this.update()})
        }else {
            this.update()
        }
    }

    animate = (time, frequencyBins) => {
        if(frequencyBins[this.config.barIndex]) {
            this.uniforms.amplitude.value = frequencyBins[this.config.barIndex] / this.config.scale
        }
    }
}



import * as THREE from 'three'
import AudioImpactItem from '../../itemtemplates/audioimpactitem'


const vertexShader = [
            "attribute float size;",
			"attribute vec3 ca;",
			"varying vec3 vColor;",
			"void main() {",
				"vColor = ca;",
				"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
				"gl_PointSize = size * ( 40.0 / -mvPosition.z );",
				"gl_Position = projectionMatrix * mvPosition;",
			"}"
]

const fragmentShader = [
           "uniform vec3 color;",
		    "uniform sampler2D texture;",
			"varying vec3 vColor;",
			"void main() {",
				"vec4 color = vec4( color * vColor, 1.0 ) * texture2D( texture, gl_PointCoord );",
				"gl_FragColor = color;",
			"}"
]



export default class Sphere extends AudioImpactItem {
    constructor(config) {
        super(config)
        this.bins = new THREE.Group()

        this.camera = config.sceneConfig.camera 

        var radius = 30, segments = 68, rings = 38;
        var geometry1 = new THREE.SphereGeometry( radius, segments, rings );
        var geometry2 = new THREE.BoxGeometry( 0.8 * radius, 0.8 * radius, 0.8 * radius, 10, 10, 10 );
        this.vertices1 = geometry1.vertices.length;
        var vertices = geometry1.vertices.concat( geometry2.vertices );
        var positions = new Float32Array( vertices.length * 3 );
        var colors = new Float32Array( vertices.length * 3 );
        var sizes = new Float32Array( vertices.length );
        var vertex;
        var color = new THREE.Color();

        for ( var i = 0, l = vertices.length; i < l; i ++ ) {
            vertex = vertices[ i ];
            vertex.toArray( positions, i * 3 );
            if ( i < this.vertices1 ) {
                color.setHSL( 0.01 + 0.1 * ( i / this.vertices1 ), 0.99, ( vertex.y + radius ) / ( 4 * radius ) );
            } else {
                color.setHSL( 0.6, 0.75, 0.25 + vertex.y / ( 2 * radius ) );
            }
            color.toArray( colors, i * 3 );
            sizes[ i ] = i < this.vertices1 ? 0 : 0;
        }

        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
        geometry.addAttribute( 'ca', new THREE.BufferAttribute( colors, 3 ) );
        //
        var texture = new THREE.TextureLoader().load( "disc.png" );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        var material = new THREE.ShaderMaterial( {
            uniforms: {
                amplitude: { value: 1.0 },
                color:     { value: new THREE.Color( 0xffffff ) },
                texture:   { value: texture }
            },
            vertexShader:  vertexShader.join("\n"),
            fragmentShader: fragmentShader.join("\n"),
            transparent:    true
        });
        //
        this.sphere = new THREE.Points( geometry, material );
        this.mesh = this.sphere

        this.lastDiff = 0
        this.addItem()

    }

    sortPoints = () => {
        const {sphere, camera} = this

        var vector = new THREE.Vector3();
        var matrix = new THREE.Matrix4();
        matrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
        matrix.multiply( sphere.matrixWorld );
        var geometry = sphere.geometry;
        var index = geometry.getIndex();
        var positions = geometry.getAttribute( 'position' ).array;
        var length = positions.length / 3;
        if ( index === null ) {
            var array = new Uint16Array( length );
            for ( var i = 0; i < length; i ++ ) {
                array[ i ] = i;
            }
            index = new THREE.BufferAttribute( array, 1 );
            geometry.setIndex( index );
        }
        
        var sortArray = [];
        for ( var i = 0; i < length; i ++ ) {
            vector.fromArray( positions, i * 3 );
            vector.applyMatrix4( matrix );
            sortArray.push( [ vector.z, i ] );
        }
        function numericalSort( a, b ) {
            return b[ 0 ] - a[ 0 ];
        }
        sortArray.sort( numericalSort );
        var indices = index.array;
        for ( var i = 0; i < length; i ++ ) {
            indices[ i ] = sortArray[ i ][ 1 ];
        }

        geometry.index.needsUpdate = true;
    }

    move = (x, y, z) => {

    }

    _updateConfig = (config) => {
        config.barIndex = config.barIndex > 32 ?  32 : config.barIndex
        config.barIndex = config.barIndex < 0 ?  0 : config.barIndex
        this.config = config
    }

    _animate = (time, audioData) => {
        const {sphere, vertices1} = this

        const t = time * 4
        sphere.rotation.y = 0.02 * t;
        sphere.rotation.z = 0.02 * t;

        const amp = this.getImpactAmplitude(audioData.bins) / 48
        sphere.scale.set(1+ amp,1 + amp, 1+ amp)
        
        var geometry = sphere.geometry;
        var attributes = geometry.attributes;

        for ( var i = 0; i < attributes.size.array.length; i ++ ) {
            if ( i < vertices1 ) {
                attributes.size.array[ i ] = 16 + 12 * Math.sin( 0.1 * i + t );
            }
        }
        attributes.size.needsUpdate = true;
        this.sortPoints();
    }
}

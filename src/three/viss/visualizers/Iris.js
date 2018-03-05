import * as THREE from 'three'

var bufferLength;
var numBars = 128;

export default class Iris {
    constructor(scene, view) {
        this.name = "iris"
        this.scene = scene
        this.view = view

        this.visualArray = new Uint8Array(numBars)

        this.vertexShader = [
                "varying vec4 pos;",
                "void main() {",
                    "pos = modelViewMatrix * vec4( position, 1.0 );",
                    "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
                "}"
            ].join('\n');
        this.fragmentShader = [
                "uniform vec3 col;",
                "varying vec4 pos;",
                "void main() {",
                    "gl_FragColor = vec4( -pos.z/180.0 * col.r, -pos.z/180.0 * col.g, -pos.z/180.0 * col.b, 1.0 );",
                "}"
        ].join('\n');

        this.make()
    }

    make = () => {
        this.group = new THREE.Object3D();

        this.view.usePerspectiveCamera();
        this.view.camera.position.y = 0;
        this.view.camera.position.z = 250;

        for( var i = 0; i < numBars / 2; i++ ) {

            var uniforms = {
                col: { type: 'c', value: new THREE.Color( 'hsl(240, 100%, 50%)' ) },
            };
            var material = new THREE.ShaderMaterial( {
                uniforms: uniforms,
                vertexShader: this.vertexShader,
                fragmentShader: this.fragmentShader
            } );

            let geometry = new THREE.PlaneBufferGeometry( 3, 500, 1 );
            geometry.rotateX( Math.PI / 1.8 );
            geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 60, 0 ) );
            let plane = new THREE.Mesh( geometry, material );
            
            plane.rotation.z = i * ( Math.PI * 2 / numBars ) + ( Math.PI / numBars );

            this.group.add( plane );
            geometry = new THREE.PlaneBufferGeometry( 3, 500, 1 );
            geometry.rotateX( Math.PI / 1.8 );
            geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 60, 0 ) );
            plane = new THREE.Mesh( geometry, material );
            
            plane.rotation.z = -i * ( Math.PI * 2 / numBars ) - ( Math.PI / numBars );

            this.group.add( plane );
        }
        this.scene.add( this.group );
    }

    destroy = () => {
        this.scene.remove( this.group );
    }

    render = (time, frequencyBins) => {
        //analyser.getByteFrequencyData( dataArray );
       // var loudness = getLoudness( dataArray );
        //visualArray = spectrum.GetVisualBins( dataArray, numBars, 4, 1300 );


        let visualArray = frequencyBins

        let loudness = 1
        let group = this.group
        if( group ) {
            for(var i = 0; i < visualArray.length / 2; i++) {
                
                //Left and right share the same material hence why we don't need i*2+1
                setUniformColor( i * 2, loudness, group );
                group.children[i * 2].geometry.attributes.position.array[7] = visualArray[i] / 2 + ( 65 + (loudness/1.5) );
                group.children[i * 2].geometry.attributes.position.array[10] = visualArray[i] / 2 + ( 65 + (loudness/1.5) );
                group.children[i * 2].geometry.attributes.position.needsUpdate = true;

                group.children[i * 2 + 1].geometry.attributes.position.array[7] = visualArray[i] / 2 + ( 65 + (loudness/1.5) );
                group.children[i * 2 + 1].geometry.attributes.position.array[10] = visualArray[i] / 2 + ( 65 + (loudness/1.5) );
                group.children[i * 2 + 1].geometry.attributes.position.needsUpdate = true;
            }
        }
    }
}
    
function setUniformColor( groupI, loudness, group ) {
    var h = modn( 250 - (loudness*2.2), 360 );
    group.children[groupI].material.uniforms.col.value = new THREE.Color( 'hsl(' + h + ', 100%, 50%)' );
}


function getLoudness( arr ) {
    var sum = 0;
    for( var i = 0; i < arr.length; i ++ ) {
        sum += arr[i];
    }
    return sum / arr.length;
}

function modn( n, m ) {
    return ( (n % m) + m ) % m;
}
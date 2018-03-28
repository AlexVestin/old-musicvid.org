import * as THREE from 'three'
import Water from "./water"
import OrbitControls from '../../controls/orbitcontrols'
import Text from './text'


export default class WaterScene {
    constructor(width, height, renderer){
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
          55,
          width / height,
          1,
          20000
        )
       
        camera.position.set( 30, 30, 100 );

        let light = new THREE.DirectionalLight( 0xffffff, 0.8 );
        light.position.set( - 30, 30, 30 );
        light.castShadow = true;
        light.shadow.camera.top = 45;
        light.shadow.camera.right = 40;
        light.shadow.camera.left = light.shadow.camera.bottom = -40;
        light.shadow.camera.near = 1;
        light.shadow.camera.far = 200;
        this.light = light
        scene.add( light );
        var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
        scene.add( ambientLight );
        scene.fog = new THREE.FogExp2( 0xaabbbb, 0.001 );

        this.parameters = {
            oceanSide: 2000,
            size: 1.0,
            distortionScale: 3.7,
            alpha: 1.0
        };

        this.scene = scene
        this.camera = camera
       
        this.setWater();
        this.setSkybox();

        var geo = new THREE.IcosahedronGeometry( 20, 2 );
        for ( var i = 0, j = geo.faces.length; i < j; i ++ ) {
            geo.faces[ i ].color.setHex( Math.random() * 0xffffff );
        }
        var mat = new THREE.MeshPhongMaterial( {
            vertexColors: THREE.FaceColors,
            shininess: 10,
            envMap: this.cubeMap,
            side: THREE.DoubleSide
        } );
        this.sphere = new THREE.Mesh( geo, mat );
        this.sphere.castShadow = true;
        scene.add( this.sphere )

        let controls = new OrbitControls( camera, renderer.domElement );
        controls.maxPolarAngle = Math.PI * 0.495;
        controls.target.set( 0, 10, 0 );
        controls.panningMode = 1;
        controls.minDistance = 40.0;
        controls.maxDistance = 200.0;
        camera.lookAt( controls.target );
        this.controls = controls

        this.text = new Text(this.scene)
    }

    setWater = () => {
        var waterGeometry = new THREE.PlaneBufferGeometry( this.parameters.oceanSide * 5, this.parameters.oceanSide * 5 );
        this.water = new Water(
            waterGeometry,
            {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: new THREE.TextureLoader().load( 'waternormals.jpg', function ( texture ) {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                }),
                alpha: this.parameters.alpha,
                sunDirection: this.light.position.clone().normalize(),
                sunColor: 0xffffff,
                waterColor: 0x001e0f,
                distortionScale: this.parameters.distortionScale,
                fog: this.scene.fog !== undefined
            }
        );
                
        this.water.rotation.x = - Math.PI / 2;
        this.water.receiveShadow = true;
        this.scene.add( this.water );
    }

    setSkybox = () => {
        var cubeTextureLoader = new THREE.CubeTextureLoader();
        cubeTextureLoader.setPath( 'skyboxsun25deg/' );
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
        var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
        this.scene.add( skyBox );

    }

    animate = (time, frequencyBins) => {
        let { sphere, water, parameters, text } = this
        if(frequencyBins===undefined) {
            sphere.position.y = Math.sin( time ) * 20 + 20;
        }else{ 
            let bass = 1 + (frequencyBins[0] + frequencyBins[1] ) / 1024
            sphere.scale.set( bass, bass, bass )
        }
        sphere.rotation.x = time * 0.5;
        sphere.rotation.z = time * 0.51;
        water.material.uniforms.time.value += 1.0 / 60.0;
        water.material.uniforms.size.value = parameters.size;
        water.material.uniforms.distortionScale.value = parameters.distortionScale;
        water.material.uniforms.alpha.value = parameters.alpha;

        text.animate(time)
    }

    dispose = () => {
        let { sphere, water, camera, scene, mat, geo, light, controls } = this
        sphere.dispose()
        water.dispose()
        camera.dispose()
        scene.dispose()
        mat.dispose()
        geo.dispose()
        light.dispose()
        controls.dispose()
    }
} 
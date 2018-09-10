
import * as THREE from 'three'
import AudioImpactItem from '../../itemtemplates/audioimpactitem'


export default class RandomGeometry extends AudioImpactItem {
    constructor(config, fileConfig) {
        super(config)

        
        if(!fileConfig) {
            const rotationGroup = {
                title: "Rotation",
                items: {
                   rotationX: {value: 0, type: "Number", tooltip: "Rotation in X axis per tick"},
                   rotationY: {value: 0, type: "Number", tooltip: "Rotation in Y axis per tick"},
                   rotationZ: {value: 0, type: "Number", tooltip: "Rotation in Z axis per tick"},
                }
            }
    
            this.config.defaultConfig.push(rotationGroup)
            this.getConfig()
            this.config.strength = 1
            this.addItem()
        }else {
            this.config = {...fileConfig}
        }
       

        this.mesh = new THREE.Mesh()
        var geometry = new THREE.SphereBufferGeometry( 50, Math.random() * 64, Math.random() * 32 );
        var material = new THREE.MeshBasicMaterial( { wireframe: true, color: 0x00ff00 } );

        this.mesh.geometry = geometry
        this.mesh.material = material
        this.lastTime = 0
        this.bufferGeometries = [
            THREE.BoxBufferGeometry,
            THREE.ConeBufferGeometry,
            THREE.SphereBufferGeometry,
            THREE.PolyhedronBufferGeometry,
        ]

       
    }

    move = (x, y, z) => {
        this.mesh.position.set(x, y, z)
        this.centerY = y
    }

    stop = () => {
        this.lastTime = 0
    }

    _updateConfig = (config) => {
        this.move(config.x, config.y, config.z)
        this.config = config
    }

    getRandomColor = () => {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    
    _animate = (time, audioData) => {
        const { threshold, coolDownTime } = this.config
        const amp = this.getImpactAmplitude(audioData.bins)
        if(amp > threshold && this.lastTime + coolDownTime <= time) {
            let c = this.bufferGeometries[Math.floor(Math.random() * this.bufferGeometries.length)]
            var geometry = new c( 50, Math.random() * 64, Math.random() * 32 );
            var material = new THREE.MeshBasicMaterial( { wireframe: true, color: this.getRandomColor() } );

            this.mesh.geometry = geometry
            this.mesh.material = material

            geometry.dispose();
            material.dispose();

            this.lastTime = time    
        }else {
            
            this.mesh.rotation.x += this.config.rotationX
            this.mesh.rotation.y += this.config.rotationY
            this.mesh.rotation.z += this.config.rotationZ            
        }        
    }
}


import * as THREE from 'three'
import { MeshItem } from './item';

export default class RandomGeometry extends MeshItem {
    constructor(config) {
        super(config)

        this.defaultConfig.threshold = {value: 15, type: "Number", tooltip: "Delta amplitude needed to trigger a rerender", editable: true}
        this.defaultConfig.deltaTime = {value: 0.01, type: "Number", tooltip: "Time cooldown before rerendering (in seconds)", editable: true}
        this.getConfig(this.defaultConfig)
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

        this.addItem()
    }

    move = (x, y, z) => {
        this.mesh.position.set(x, y, z)
        this.centerY = y
    }

    stop = () => {
        this.lastTime = 0
    }

    updateConfig = (config) => {
        if(this.config.centerX !== config.centerX || this.config.centerY !== config.centerY ||  this.config.centerZ !== config.centerZ) {
            this.move(config.centerX, config.centerY, config.centerZ)
        }

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
    


    animate = (time, frequencyBins) => {
            if(frequencyBins[0] && frequencyBins[2] > this.config.threshold && this.lastTime + this.config.deltaTime <= time) {
            let c = this.bufferGeometries[Math.floor(Math.random() * this.bufferGeometries.length)]
            var geometry = new c( 50, Math.random() * 64, Math.random() * 32 );
            var material = new THREE.MeshBasicMaterial( { wireframe: true, color: this.getRandomColor() } );

            this.mesh.geometry = geometry
            this.mesh.material = material

            geometry.dispose();
            material.dispose();

            this.lastTime = time
        }
    }
}

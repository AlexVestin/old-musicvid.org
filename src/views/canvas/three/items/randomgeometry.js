
import * as THREE from 'three'
import { AudioreactiveItem } from './item';

export default class RandomGeometry extends AudioreactiveItem {
    constructor(config) {
        super(config)

        const rotationGroup = {
            title: "Rotation",
            items: {
               rotationX: {value: 0, type: "Number", tooltip: "Rotation in X axis per tick", editable: true},
               rotationY: {value: 0, type: "Number", tooltip: "Rotation in Y axis per tick", editable: true},
               rotationZ: {value: 0, type: "Number", tooltip: "Rotation in Z axis per tick", editable: true},
            }
        }

        this.config.defaultConfig.push(rotationGroup)
        this.getConfig(this.config.defaultConfig)
        this.config.strength = 1

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

    editConfig = (config) => {
        this.move(config.X, config.Y, config.Z)

        config.barIndex = config.barIndex > 32 ?  32 : config.barIndex
        config.barIndex = config.barIndex < 0 ?  0 : config.barIndex
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
        const { barIndex, threshold, deltaTime, strength } = this.config

        if(frequencyBins[0] && frequencyBins[barIndex] * strength > threshold && this.lastTime + deltaTime <= time) {
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

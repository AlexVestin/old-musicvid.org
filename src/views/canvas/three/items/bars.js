
import * as THREE from 'three'
import DragControls from '../controls/dragcontrols'
import { MeshItem } from './item';

export default class Bars extends MeshItem {
    constructor(config, sceneConfig) {
        super("Bars")
        this.bins = new THREE.Group()

        this.defaultConfig.type.value = "BARS"
        this.defaultConfig.name.value = "Bars"
        this.defaultConfig.strength = {value: 1, type: "Number", tooltip: "Exaggeration in the y axis", editable: true}
        this.defaultConfig.decreaseSpeed = {value: 0.5, type: "Number", tooltip: "Amount bars will decrease in height each tick", editable: true}
        this.defaultConfig.deltaRequired = {value: 0.12, type: "Number", tooltip: "Delta from previous tick needed to push the bars up (prevents flicker)", editable: true}       

        for(var i = 0; i < 32; i++) {
            var geometry = new THREE.BoxGeometry( 1, 1, 1 );
            var material = new THREE.MeshBasicMaterial( {color: "0xFFFFFF"} );
            var cube = new THREE.Mesh( geometry, material );

            cube.position.x = i+(i*0.5) - 24;
            this.bins.add(cube)
        }


        this.strength = 1
        this.config = this.getConfig(this.defaultConfig)
        this.mesh = this.bins
        this.mesh.name = String(this.config.id)
    }

    getCompoundBoundingBox = (items) => {
        var box = null;
        items.forEach((e) => {
            
        });

        return box;
    }


    move = (x, y) => {
        this.bins.children.forEach((e, i) => {
            e.position.x = x + i+(i*0.5) - 24;
        })

        this.centerY = y
    }

    updateConfig = (config) => {
        this.bins.children.forEach(e => {
            e.material.color.setHex("0x" + config.color.value)
        })

        if(this.config.centerX !== config.centerX || this.config.centerY !== config.centerY.value) {
            this.move(config.centerX.value, config.centerY.value)
        }

        this.config = this.getConfig(config)
    }

    animate = (time, frequencyBins) => {
        const { deltaRequired, decreaseSpeed, strength, scale, centerY } = this.config

        this.bins.children.forEach( (e,i) => {
            let o = e.scale.y
            let n = (frequencyBins[i] / 3) * strength * scale

            o = n > (o + deltaRequired) ? n : (o - decreaseSpeed) >= 0 ? (o-decreaseSpeed) : 0.001;
      
            e.scale.set(scale , o, scale); 
            e.position.y = centerY + o/2 
        })
    }
}

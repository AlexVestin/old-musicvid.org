
import * as THREE from 'three'
import { MeshItem } from './item';

export default class Bars extends MeshItem {
    constructor(config) {
        super(config)
        this.mesh = new THREE.Group()

        const group = { 
            title: "Stuff",
            items: {
                strength: {value: 1, type: "Number", tooltip: "Exaggeration in the y axis", editable: true},
                decreaseSpeed: {value: 0.5, type: "Number", tooltip: "Amount bars will decrease in height each tick", editable: true},
                deltaRequired: {value: 0.12, type: "Number", tooltip: "Delta from previous tick needed to push the bars up (prevents flicker)", editable: true},    
                color : {value: "FFFFFF", type: "String", tooltip: "", editable: true},
                scale : {value: 0.5, type: "Number", tooltip: "", editable: true}
            }
        }
        
        this.config.defaultConfig.push(group)
        this.getConfig(this.config.defaultConfig)

        for(var i = 0; i < 32; i++) {
            var geometry = new THREE.BoxGeometry( 1, 1, 1 );
            var material = new THREE.MeshBasicMaterial( {color: "0xFFFFFF"} );
            var cube = new THREE.Mesh( geometry, material );

            cube.position.x = i+(i*0.5) - 24;
            this.mesh.add(cube)
        }

        this.strength = 1
        this.addItem()
    }


    move = (x, y, z) => {
        this.mesh.children.forEach((e, i) => {
            e.position.x = x + i+(i*0.5) - 24;
            e.translateZ(z);
        })

        this.centerY = y
    }

    _updateConfig = (config) => {
        this.mesh.children.forEach(e => {
            e.material.color.setHex("0x" + config.color)
        })

        if(this.config.X !== config.X || this.config.Y !== config.Y ||  this.config.Z !== config.Z) {
            this.move(config.X, config.Y, config.Z)
        }

        this.config = config
    }

    _animate = (time, frequencyBins) => {
        const { deltaRequired, decreaseSpeed, strength, scale, Y } = this.config
        this.mesh.children.forEach( (e,i) => {
            let o = e.scale.y
            let n = (frequencyBins[i] / 3) * strength * scale

            o = n > (o + deltaRequired) ? n : (o - decreaseSpeed) >= 0 ? (o-decreaseSpeed) : 0.001;
            
            e.scale.set(scale , o, scale); 
            e.position.y = Y + o/2 
        })
    }
}

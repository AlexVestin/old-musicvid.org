
import * as THREE from 'three'
import BaseItem from '../../itemtemplates/item'

export default class AudioCircle extends BaseItem {
    constructor(config) {
        super(config)
        this.mesh = new THREE.Group()

        const group = { 
            title: "Stuff",
            items: {
                decreaseSpeed: {value: 20, type: "Number", tooltip: "Amount bars will decrease in height each tick"},
                deltaRequired: {value: 0.12, type: "Number", tooltip: "Delta from previous tick needed to push the bars up (prevents flicker)"},    
                color : {value: "FFFFFF", type: "String", tooltip: ""},
                scale : {value: 0.5, type: "Number", tooltip: ""}
            }
        }

        var geometry = new THREE.CircleGeometry( 32, 32 );
        geometry.center()
        var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
        this.mesh = new THREE.Mesh( geometry, material );
        this.config.defaultConfig.push(group)


        this.getConfig()
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
        const scale = ( frequencyBins.bins[5] / 1048 ) + 1 || 1
        
        this.mesh.scale.set(scale, scale, scale)
    }
}

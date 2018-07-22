
import * as THREE from 'three'
import { AudioreactiveItem } from './item';

export default class Bars extends AudioreactiveItem {
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
        
        for(var i = 0; i < 32; i++) {
            var geometry = new THREE.BoxGeometry( 1, 1, 1 );
            var material = new THREE.MeshBasicMaterial( {color: "0xFFFFFF"} );
            var cube = new THREE.Mesh( geometry, material );

            cube.position.x = i+(i*0.5) - 24;
            this.mesh.add(cube)
        }


        this.config.defaultConfig.push(group)
        this.getConfig()

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
        const { deltaRequired, decreaseSpeed, scale, Y } = this.config
        const bins = this.getTransformedSpectrum(frequencyBins.bins)

        this.mesh.children.forEach( (e,i) => {
            var newScale = bins[i] > 1 ? bins[i] : 1 
            if(newScale < e.scale.y || Math.abs(newScale - e.scale.y) < deltaRequired) {
                newScale = e.scale.y - decreaseSpeed * (time - this._lastTime)  > 1 ? e.scale.y - decreaseSpeed * (time - this._lastTime) : 1
                newScale = time - this._lastTime < 0 ? 1 : newScale
            }

            e.scale.set(scale , newScale, scale); 
            e.position.y = Y + newScale/2 
        })
    }
}


import * as THREE from 'three'

export default class Bars {
    constructor(config, scene) {
        this.bins = []
        this.decreaseSpeed = config.decreaseSpeed.value
        this.deltaRequired = config.deltaRequired.value

        this.name = config.name
        this.centerX = config.centerX
        this.centerY = config.centerY
        this.color = config.color


        for(var i = 0; i < 32; i++) {
            var geometry = new THREE.BoxGeometry( 1, 1, 1 );
            var material = new THREE.MeshBasicMaterial( {color: "0x" + this.color} );
            var cube = new THREE.Mesh( geometry, material );

            cube.position.x = i+(i*0.5) - 24;
            
            //cube.position.y = i * 0.5;
            this.bins.push(cube)
            scene.add( cube );
        }

        this.strength = 1
    }


    move = (x, y) => {
        console.log("mvoe")
    }

    updateConfig = (config) => {
        this.strength = config.strength.value
        this.bins.forEach(e => {
            e.material.color.setHex("0x" + config.color.value)
        })

        this.decreaseSpeed = config.decreaseSpeed.value
        this.deltaRequired = config.deltaRequired.value

        if(this.centerX !== config.centerX || this.centerY !== config.centerY) {
            this.move(config.centerX, config.centerY)
        }
    }

    animate = (time, frequencyBins) => {
        this.bins.forEach( (e,i) => {
            let o = e.scale.y
            let n = (frequencyBins[i] / 3) * this.strength

            o = n > o + this.deltaRequired ? n : o - this.decreaseSpeed >= 0 ? o-this.decreaseSpeed : 0.001;
      
            e.scale.set(1, o, 1); 
            e.position.y =  o/2 
        })
    }
}

export function getBarConfigs() {
    return {
        centerX: {value: 0, type: "Number"},
        centerY: {value: 0, type: "Number"},
        strength: {value: 1, type: "Number"},
        decreaseSpeed: {value: 0.5, type: "Number"},
        deltaRequired: {value: 0.12, type: "Number"},        
        layer: {value: "Scene", type: "String"},
        color: {value: "FFFFFF", type: "String"},
        name: {value: "Unnamed", type: "String"},
    }
}
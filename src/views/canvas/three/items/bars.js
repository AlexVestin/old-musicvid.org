
import * as THREE from 'three'

export default class Bars {
    constructor(config, scene) {
        this.bins = []

        this.decreaseSpeed = config.decreaseSpeed.value
        this.deltaRequired = config.deltaRequired.value
        this.centerX = config.centerX.value
        this.centerY = config.centerY.value
        this.color = config.color.value
        this.id = config.id.value
        this.scale = config.scale.value


        for(var i = 0; i < 32; i++) {
            var geometry = new THREE.BoxGeometry( 1, 1, 1 );
            var material = new THREE.MeshBasicMaterial( {color: "0x" + this.color} );
            var cube = new THREE.Mesh( geometry, material );

            cube.position.x = this.centerX + i+(i*0.5) - 24;
            cube.position.y = this.centerY
            
            //cube.position.y = i * 0.5;
            this.bins.push(cube)
            scene.add(cube);
        }

        this.strength = 1
    }


    move = (x, y) => {
        this.bins.forEach((e, i) => {
            e.position.x = x + i+(i*0.5) - 24;
        })

        this.centerY = y
    }

    updateConfig = (config) => {
        this.strength = config.strength.value
        this.bins.forEach(e => {
            e.material.color.setHex("0x" + config.color.value)
        })

        this.decreaseSpeed  = config.decreaseSpeed.value
        this.deltaRequired  = config.deltaRequired.value
        this.scale          = config.scale.value 

        if(this.centerX !== config.centerX.value || this.centerY !== config.centerY.value) {
            this.move(config.centerX.value, config.centerY.value)
        }
    }

    animate = (time, frequencyBins) => {
        this.bins.forEach( (e,i) => {
            let o = e.scale.y
            let n = (frequencyBins[i] / 3) * this.strength * this.scale

            o = n > (o + this.deltaRequired) ? n : (o - this.decreaseSpeed) >= 0 ? (o-this.decreaseSpeed) : 0.001;
      
            e.scale.set(this.scale , o, this.scale); 
            e.position.y = this.centerY + o/2 
        })
    }
}

export function getBarConfigs() {
    return {
        name: {value: "Unnamed", type: "String", tooltip: null},
        centerX: {value: 0, type: "Number", tooltip: null},
        centerY: {value: 0, type: "Number",  tooltip: null},
        strength: {value: 1, type: "Number", tooltip: "Exaggeration in the y axis"},
        decreaseSpeed: {value: 0.5, type: "Number", tooltip: "Amount bars will decrease in height each tick"},
        deltaRequired: {value: 0.12, type: "Number", tooltip: "Delta from previous tick needed to push the bars up (prevents flicker)"},        
        layer: {value: "Scene", type: "String", tooltip: null},
        color: {value: "FFFFFF", type: "String",tooltip: null},
        scale: {value: 1, type: "Number", tooltip: null},
        
        //Mandatory
        type: {value: "BARS", type: "String"}, //TODO uneditable
        id: {value: 0, type: "Number"}
    }
}
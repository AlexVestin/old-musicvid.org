
import * as THREE from 'three'
import AudioReactiveItem from '../../itemtemplates/audioreactiveitem'

export default class Bars extends AudioReactiveItem {
    constructor(config, fileConfig, sceneConfig) {
        super(config)
        

        if(!fileConfig) {
            const group1 = { 
                title: "Decrease speed and threshold",
                items: {
                    shouldDropOff: {type: "Boolean", value: true},
                    decreaseSpeed: {value: 30, type: "Number", tooltip: "Amount bars will decrease in height each tick"},
                    deltaRequired: {value: 0.12, type: "Number", tooltip: "Delta from previous tick needed to push the bars up (prevents flicker)"},    
                }
            }
    
            const group2 = { 
                title: "Color and looks",
                items: {
                    color : {value: "FFFFFF", type: "String", tooltip: ""},
                    scale : {value: 0.8, type: "Number", tooltip: ""},
                    spacing : {value: 2, type: "Number", tooltip: ""},
                }
            }

            this.config.defaultConfig.push(group1)
            this.config.defaultConfig.push(group2)
            this.getConfig()

            this.config.spectrumSize = 64;
            this.config.amplitude = 200;
            this.config.spectrumMaxExponent = 3;
            this.config.decreaseSpeed = 75;
            this.addItem()
        }else {
            this.config = {...fileConfig}
        }
        
        this.mesh = new THREE.Group()
        this.createBars(this.config.spectrumSize)
    }

    createBars = (nrOfBars) => {
        while (this.mesh.children.length){
            this.mesh.remove(this.mesh.children[0]);
        }
        for(var i = 0; i < nrOfBars; i++) {
            var geometry = new THREE.BoxGeometry( 1, 1, 1 );
            var material = new THREE.MeshBasicMaterial({transparent: true});
            material.color.setHex("0x" + this.config.color || "FFFFFF")
            var cube = new THREE.Mesh( geometry, material );

            cube.position.x = this.config.x + (i * this.config.spacing) - (this.config.spacing*nrOfBars/2);
            cube.position.y = 0
            this.mesh.add(cube)
        }
    }


    move = (x, y, z, spacing = 1) => {
        this.mesh.children.forEach((e, i) => {
            e.position.x = x + (i * spacing) - (spacing*this.config.spectrumSize/2);
            e.translateZ(z);
        })

        this.centerY = y
    }

    _updateConfig = (config) => {
        if(config.spectrumSize !== this.config.spectrumSize) {
            this.createBars(config.spectrumSize)
        }else {
            this.mesh.children.forEach(e => {
                e.material.color.setHex("0x" + config.color)
            })
            
            
            this.move(config.x, config.y, config.z, config.spacing) 
        }
        this.config = config
    }

    _animate = (time, audioData, alpha) => {
        const { deltaRequired, decreaseSpeed, scale, y, shouldDropOff } = this.config
        const bins = this.getTransformedSpectrum(audioData.bins)
        console.log(alpha)
        this.mesh.children.forEach( (e,i) => {
            
            e.material.opacity = alpha;
            var newScale = bins[i] > 1 ? bins[i] : 1;
            if(shouldDropOff && (newScale < e.scale.y || Math.abs(newScale - e.scale.y) < deltaRequired)) {
                newScale = e.scale.y - decreaseSpeed * (time - this._lastTime)  > 1 ? e.scale.y - decreaseSpeed * (time - this._lastTime) : 1
                newScale = time - this._lastTime < 0 ? 1 : newScale
            }

            e.scale.set(scale , newScale, scale); 
            e.position.y = y + newScale/2 
        })
    }
}


import * as THREE from 'three'

export default class Text3D {
    constructor(config, scene) {
        this.bins = []

        this.text       = config.text.value
        this.centerX    = config.centerX.value
        this.centerY    = config.centerY.value
        this.color      = config.color.value
        this.id         = config.id.value
        this.scale      = config.scale.value
        this.fontSize   = config.fontSize.value

       
        this.scene = scene
        var loader = new THREE.FontLoader();
        this.mesh = new THREE.Mesh()
        this.scene.add(this.group)

        this.textMesh = new THREE.Mesh()
        loader.load('optimer_regular.typeface.json', (font) => {
            this.font = font; 
            this.createTextMesh()
            .then((mesh) => this.scene.add(mesh))
        })        
    }

    createTextMesh = () => {
        var data = {
            size: 5,
            height: 2,
            curveSegments: 12,
            font: "helvetiker",
            weight: "regular",
            bevelEnabled: false,
            bevelThickness: 1,
            bevelSize: 0.5,
            bevelSegments: 3
        };

        return new Promise((resolve, reject) => {
            var geometry = new THREE.TextGeometry( 
                this.text, {
                font: this.font,
                size: this.fontSize,
                height: data.height,
                curveSegments: data.curveSegments,
                bevelEnabled: data.bevelEnabled,
                bevelThickness: data.bevelThickness,
                bevelSize: data.bevelSize,
                bevelSegments: data.bevelSegments
            })
            
            this.textMesh.geometry = geometry
            resolve(this.textMesh)
        })
    }

    update = (config) => {
        this.textMesh.material.color.setHex("0x" + config.color.value)
        this.textMesh.position.x = config.centerX.value
        this.textMesh.position.y = config.centerY.value
        this.scale = config.scale.value 
    }

    updateConfig = (config) => {
        if(this.text !== config.text.value || this.fontSize !== config.fontSize.value) {
            this.text = config.text.value
            this.fontSize = config.fontSize.value
            this.textMesh = this.createTextMesh().then((mesh) => {this.textMesh = mesh; this.update(config)})
        }else {
            this.update(config)
        }
    }

    animate = (time, frequencyBins) => {
       //dsdf
    }
}

export function getText3DConfigs() {
    return {
        name: {value: "Unnamed", type: "String", tooltip: "Name for resources-list", input: true},
        text: {value: "Text", typ:"String", tooltip: "", input: true},
        centerX: {value: 0, type: "Number", tooltip: "", input: true},
        centerY: {value: 0, type: "Number",  tooltip: "", input: true},
        fontSize: {value: 5, type: "Number",  tooltip: "", input: true},
        
        layer: {value: "Scene", type: "String", tooltip: "", input: true},
        color: {value: "FFFFFF", type: "String",tooltip: "", input: true},
        scale: {value: 0.5, type: "Number", tooltip: "", input: true},
        
        //Mandatory
        type: {value: "TEXT3D", type: "String", tooltip: "", input: false},
        id: {value: 0, type: "Number", tooltip: "", input: false}
    }
}
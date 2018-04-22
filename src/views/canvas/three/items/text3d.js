
import * as THREE from 'three'
import { MeshItem } from './item';

export default class Text3D extends MeshItem{
    constructor(config, sceneConfig) {
        super("Text3D")
        this.bins = []

        this.defaultConfig.text = {value: "text", type: "String", tooltip: "", editable: true}
        this.defaultConfig.fontSize = {value: 5, type: "Number", tooltip: "", editable: true}

       
        this.scene = sceneConfig.scene
        var loader = new THREE.FontLoader();
        this.mesh = new THREE.Mesh()
        this.scene.add(this.group)

        this.config = this.getConfig(this.defaultConfig)
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
            const {color, fontSize, text} = this.config
            var geometry = new THREE.TextGeometry( 
                text, {
                color: color,
                font: this.font,
                size: fontSize,
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

    update = () => {
        const config = this.config
        this.textMesh.material.color.setHex("0x" + config.color)
        this.textMesh.position.x = config.centerX
        this.textMesh.position.y = config.centerY
        this.scale = config.scale 
    }

    updateConfig = (config) => {
        const {text, fontSize } = this.config
        console.log(text)
        this.config = this.getConfig(config)

        console.log(text)
        if(text !== config.text.value || fontSize !== config.fontSize.value) {
            this.textMesh = this.createTextMesh().then((mesh) => {this.textMesh = mesh; this.update()})
        }else {
            this.update()
        }
    }

    animate = (time, frequencyBins) => {
       //TODO effects
    }
}



import * as THREE from 'three'
import { MeshItem } from './item';

export default class Text3D extends MeshItem {
    constructor(config) {
        super(config)
        this.bins = []

        this.defaultConfig.text = {value: "text", type: "String", tooltip: "", editable: true}
        this.defaultConfig.fontSize = {value: 5, type: "Number", tooltip: "", editable: true}
        this.defaultConfig.color = {value: "FFFFFF", type: "String", tooltip: "", editable: true}

        var loader = new THREE.FontLoader();
        this.mesh = new THREE.Mesh()

        this.getConfig(this.defaultConfig)
        this.mesh = new THREE.Mesh()
        loader.load('optimer_regular.typeface.json', (font) => {
            this.font = font; 
            this.createTextMesh()
            .then((mesh) => this.addItem())
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
            
            this.mesh.geometry = geometry
            this.mesh.name = String(this.config.id)
            resolve(this.mesh)
        })
    }

    update = () => {
        this.mesh.material.color.setHex("0x" + this.config.color)
        this.mesh.position.x = this.config.X
        this.mesh.position.y = this.config.Y
        this.mesh.position.z = this.config.Z
        
        this.scale = this.config.scale 
    }

    editConfig = (config) => {
        const { text, fontSize } = this.config
        this.config = config

        if(text !== config.text || fontSize !== config.fontSize) {
            this.createTextMesh().then((mesh) => {this.mesh = mesh; this.update()})
        }else {
            this.update()
        }
    }

    animate = (time, frequencyBins) => {
       //TODO effects
    }
}


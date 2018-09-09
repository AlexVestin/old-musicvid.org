import BaseItem from '../../itemtemplates/item'
import * as THREE from 'three'

export default class BackgroundImage extends BaseItem {
    constructor(config) {
        super(config) 


        const group = {
            title: "Config",
            items: {
                scale: {value: 1, type: "Number"},
                x: {value: 0, type: "Number"},
                y: {value: 0, type: "Number"},
                z: {value: 0, type: "Number"},
                wrapS: {}
            }
        }

        this.config.defaultConfig.push(group)
        this.getConfig()

        var fr = new FileReader()
        fr.onload = () => {
            var image = fr.result
            var texture = new THREE.TextureLoader().load(image)
            texture.wrapS = THREE.RepeatWrapping
            texture.minFilter = THREE.NearestFilter
            this.mesh.material.map = texture
            this.mesh.material.needsUpdate = true
            this.config.name = config.name
            this.addItem()
            //config.sceneConfig.scene.add(this.mesh)
        }
        
        this.mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2, 0),
            new THREE.MeshBasicMaterial()
        );

        fr.readAsDataURL(config.file) 
    }
}


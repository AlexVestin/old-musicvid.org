import BaseItem from "./item";
import * as THREE from 'three'

export default class BackgroundImage extends BaseItem {
    constructor(config) {
        super(config) 

        var fr = new FileReader()
        fr.onload = () => {
            var image = fr.result
            var texture = new THREE.TextureLoader().load(image)

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


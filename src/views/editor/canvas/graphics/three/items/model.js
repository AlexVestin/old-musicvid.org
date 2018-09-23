
import * as THREE from 'three'
import BaseItem from '../../itemtemplates/item'
import OBJLoader from '../loaders/objloader'
export default class Object3D extends BaseItem {
    constructor(config, fileConfig) {
        super(config)
        this.scene = config.sceneConfig.scene
        
        if(!fileConfig) {
            const meshGroup = {
                title: "Mesh",
                items: {
                    file: {type: "3DModel", value: "No file selected"} 
                }

            }
            
            this.config.defaultConfig.push(meshGroup)
            this.getConfig()
            this.addItem()
        }else {
            this.config = {...fileConfig}
        }

        this.loaded = false;
        this.loader = new OBJLoader()
        this.mesh = new THREE.Group()
    }

    


    updateFile = (file) => {
        if(file.isLocal) {

        }else {
            this.loader.load(file.url, (obj) => {
                this.scene.remove(this.mesh)
                this.mesh = obj;
                /*this.mesh.scale.multiplyScalar( 0.8 );
                this.mesh.position.y = -10;

      

                var geometry = obj.children[ 0 ].geometry;
                geometry.attributes.uv2 = geometry.attributes.uv;
                //geometry.center();
                this.mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
                this.mesh.scale.multiplyScalar( 25 );
                */
                
                
                this.scene.add(this.mesh)

            })
        }
    }


    _updateConfig = (config) => {
        this.config = config
    }
}

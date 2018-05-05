import {addItem} from '../../../../redux/actions/items'
import {setDisabled} from '../../../../redux/actions/globals'

export default class BaseItem {
    constructor(config) {
        setDisabled(true)
        this.defaultConfig = {
            name: {value: config.name, type: "String", tooltip: "",  editable: true},
            start: {value: 0, type: "Number", tooltip: "Time in millisecond when item will be rendered", editable:  true},
            duration: {value: 180, type: "Number", tooltip: "Time in millisecond when item won't be rendered any more", editable:  true},
        }

        this.config = {}
        this.config.id = Math.floor(Math.random() * 10000000)
        this.config.movable = Math.floor(Math.random() * 10000000)
        this.config.sceneId = config.sceneId
        

        this.mesh = {}
        this.getConfig(this.defaultConfig)
    }

    addItem = () => {
        addItem(this.config)
        setDisabled(false)
        this.mesh.name = String(this.config.id)
    }

    updateConfig = (config) => {
        this.config = config
    } 

    getConfig = (config) => {
        Object.keys(config).map((key, index) => {
            this.config[key] = config[key].value
        })

        this.config.defaultConfig = config
    }

    //TODO remove // find better use
    stop = () => {}
    play = () => {}
    setTime = () => {}
} 

export class MeshItem extends BaseItem {
    constructor(config) {
        super(config)
        this.defaultConfig.centerX = {value: 0, type: "Number",  tooltip: "", editable: true}
        this.defaultConfig.centerY = {value: 0, type: "Number", tooltip: "", editable: true}
        this.defaultConfig.centerZ = {value: 0, type: "Number",  tooltip: "", editable: true}
        this.defaultConfig.layer = {value: "Scene", type: "String", tooltip: "", editable: true}
        this.defaultConfig.scale = {value: 0.5, type: "Number", tooltip: "", editable: true}

        this.getConfig(this.defaultConfig)
    }
}

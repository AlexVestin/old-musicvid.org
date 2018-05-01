import {addItem} from '../../../../redux/actions/items'

export default class BaseItem {
    constructor(name) {
        this.defaultConfig = {
            name: {value: name, type: "String", tooltip: "",  editable: true},
            start: {value: 0, type: "Number", tooltip: "Time in millisecond when item will be rendered", editable:  true},
            duration: {value: 300, type: "Number", tooltip: "Time in millisecond when item won't be rendered any more", editable:  true},
            id: {value: Math.floor(Math.random() * 10000000), type: "Number", show: false},
            type: {value: 0, type: "String",  show: false},
        }
    
        this.config = {}
        this.mesh = {}
        this.addItem = addItem
        this.getConfig(this.defaultConfig)
        console.log(this.config)
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
    constructor(name) {
        super(name)
        this.defaultConfig.centerY = {value: 0, type: "Number", tooltip: "", editable: true},
        this.defaultConfig.centerX = {value: 0, type: "Number",  tooltip: "", editable: true}
        this.defaultConfig.layer = {value: "Scene", type: "String", tooltip: "", editable: true}
        this.defaultConfig.color = {value: "FFFFFF", type: "String", tooltip: "", editable: true}
        this.defaultConfig.scale = {value: 0.5, type: "Number", tooltip: "", editable: true}

        this.getConfig(this.defaultConfig)
    }
}

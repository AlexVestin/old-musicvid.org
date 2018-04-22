



export default class BaseItem {
    constructor(name) {
        this.defaultConfig = {
            name: {value: name, type: "String", tooltip: "",  editable: true},
            start: {value: 0, type: "Number", tooltip: "Time in millisecond when item will be rendered", editable:  true},
            end: {value: 0, type: "Number", tooltip: "Time in millisecond when item won't be rendered any more", editable:  true},
            id: {value: Math.floor(Math.random() * 10000000), type: "Number", show: false},
            type: {value: 0, type: "String",  show: false},
        }
    }

    getConfig = (config) => {
        let updatedObject = {}
        Object.keys(config).map((key, index) => {
            updatedObject[key] = config[key].value
        })

        return updatedObject
    }
} 

export class MeshItem extends BaseItem {
    constructor(name) {
        super(name)
        this.defaultConfig.centerY = {value: 0, type: "Number", tooltip: "", editable: true},
        this.defaultConfig.centerX = {value: 0, type: "Number",  tooltip: "", editable: true}
        this.defaultConfig.layer = {value: "Scene", type: "String", tooltip: "", editable: true}
        this.defaultConfig.color = {value: "FFFFFF", type: "String", tooltip: "", editable: true}
        this.defaultConfig.scale = {value: 0.5, type: "Number", tooltip: "", editable: true}
    }
}


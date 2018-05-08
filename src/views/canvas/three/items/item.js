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
        Object.keys( this.config).map((key, index) => {
            if( this.config[key].type === "Number") {
                this.config[key] = isNaN( this.config[key]) ? 0 :  Number(this.config[key])
            }
        })

        this.editConfig(this.config)
    } 

    getConfig = (config) => {
        Object.keys(config).map((key, index) => {
            this.config[key] = config[key].value
        })

        this.config.defaultConfig = config
    }

    //TODO remove // find better use
    editConfig = () => {}
    stop = () => {}
    play = () => {}
    setTime = () => {}
} 

export class MeshItem extends BaseItem {
    constructor(config) {
        super(config)
        this.defaultConfig.X = {value: 0, type: "Number",  tooltip: "", editable: true}
        this.defaultConfig.Y = {value: 0, type: "Number", tooltip: "", editable: true}
        this.defaultConfig.Z = {value: 0, type: "Number",  tooltip: "", editable: true}

        this.getConfig(this.defaultConfig)
    }
}


export class AudioreactiveItem extends MeshItem {
    constructor(config) {
        super(config)
        this.defaultConfig.threshold = {value: 15, type: "Number", tooltip: "Delta amplitude needed to trigger a rerender", editable: true}
        this.defaultConfig.deltaTime = {value: 0.01, type: "Number", tooltip: "Time cooldown before rerendering (in seconds)", editable: true}
        this.defaultConfig.barIndex =   {value: 2, type: "Number", tooltip: "Index of audio bin (0-32) that should be the input for triggering a rerender", editable: true}
        this.defaultConfig.strength = {value: 1, type: "Number", tooltip: "Exaggeration in the y axis", editable: true}

        this.getConfig(this.defaultConfig)
    }
}

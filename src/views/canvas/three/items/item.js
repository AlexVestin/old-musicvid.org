import {addItem} from '../../../../redux/actions/items'
import {setDisabled} from '../../../../redux/actions/globals'

export default class BaseItem {
    constructor(config) {
        setDisabled(true)
        const headerGroup = { 
                title: "Item Information", 
                hide: false,
                items: {
                    author: {value: "AlexVestin", type: "String", editable: false},
                    website: {value: "http://musicvid.org", type: "Link", editable: false},
                    github: {value: "https://github.com/alexvestin/WasmVideoEncoder", type: "Link", editable: false},
                    description: {value: "Description of item", type: "String", tooltip: "",  editable: false}
            }
        }

        const timeGroup = {title: "Time configurations", items: {
                start: {value: 0, type: "Number", tooltip: "Time in millisecond when item will be rendered", editable:  true},
                duration: {value: 20, type: "Number", tooltip: "Time in millisecond when item won't be rendered any more", editable:  true}
            }
        }

        this.config = {}
        this.config.automations = []
        this.config.defaultConfig = []
        this.config.defaultConfig.push(headerGroup)
        this.config.defaultConfig.push(timeGroup)

        //TODO UUID ?
        this.config.id = Math.floor(Math.random() * 10000000)
        this.config.name = config.name
        this.config.movable = true
        this.config.sceneId = config.sceneId
        
        this.mesh = {}
        this.getConfig(this.config.defaultConfig)
    }

    addItem = () => {
        addItem(this.config)
        setDisabled(false)
        this.mesh.name = String(this.config.id)
    }

    updateConfig = (config) => {
        this.config = config
        Object.keys(this.config).forEach(key => {
            if( this.config[key].type === "Number") {
                this.config[key] = isNaN( this.config[key]) ? 0 :  Number(this.config[key])
            }
        })

        this.editConfig(this.config)
    } 

    getConfig = (config) => {
        config.forEach(group => {
            Object.keys(group.items).map((key, index) => {
                this.config[key] = group.items[key].value
            })
        })
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
        const positionGroup = {
            title: "Positioning",
            items: {
                X: {value: 0, type: "Number",  tooltip: "X position", editable: true},
                Y: {value: 0, type: "Number", tooltip: "Y Position", editable: true},
                Z: {value: 0, type: "Number",  tooltip: "Z Position", editable: true},
            }
        }
        
        this.config.defaultConfig.push(positionGroup)
        this.getConfig(this.config.defaultConfig)
    }
}


export class AudioreactiveItem extends MeshItem {
    constructor(config) {
        super(config)
        const audioReactiveGroup = {
            title: "Audio Reactive Settings",
            items: {
                threshold: {value: 15, type: "Number", tooltip: "Delta amplitude needed to trigger a rerender", editable: true},
                deltaTime: {value: 0.01, type: "Number", tooltip: "Time cooldown before rerendering (in seconds)", editable: true},
                barIndex:  {value: 2, type: "Number", tooltip: "Index of audio bin (0-32) that should be the input for triggering a rerender", editable: true},
                strength: {value: 1, type: "Number", tooltip: "Exaggeration in the y axis", editable: true},
            }
        }
        
        this.config.defaultConfig.push(audioReactiveGroup)
        this.getConfig(this.config.defaultConfig)
    }
}

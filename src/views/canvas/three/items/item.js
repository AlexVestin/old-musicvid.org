import { addItem, updateItemConfig } from '../../../../redux/actions/items'
import {setDisabled} from '../../../../redux/actions/globals'


export default class BaseItem {
    constructor(config) {
        setDisabled(true)
        const headerGroup = { 
                title: "Author Information", 
                hide: true,
                items: {
                    author: {value: "example", type: "String", editable: false},
                    website: {value: "http://example.org", type: "Link", editable: false},
                    github: {value: "https://github.com/example", type: "Link", editable: false},
            }
        }

        const timeGroup = {
            title: "Time configurations", 
            items: {
                start: {value: 0, type: "Number", tooltip: "Time in seconds when item will be rendered", editable: true, disableAutomations: true},
                duration: {value: 20, type: "Number", tooltip: "Time in seconds when item won't be rendered anymore", editable:  true, disableAutomations: true}
            }
        }

        this.config = {}
        this.config.defaultConfig = [headerGroup, timeGroup]

        //TODO UUID ?
        this.config.id          = Math.floor(Math.random() * 10000000)
        this.config.name        = config.name
        this.config.movable     = true
        this.config.sceneId     = config.sceneId
        this.config.automations = []
        
        
        this.mesh = {}
        this.automations = []
        this.getConfig(this.config.defaultConfig)
        this._lastTime = -1
    }

    addItem = () => {
        addItem(this.config)
        setDisabled(false)
        this.mesh.name = String(this.config.id)
    }

    updateConfig = (config) => {
        this.config = {...config}
        this.config.defaultConfig.forEach(group => {
            Object.keys(group.items).forEach(key => {
                if( group.items[key].type === "Number") {
                    this.config[key] = this.checkNum(this.config[key])
                }
            })
        })

        this._updateConfig(this.config)
    } 

    getConfig = (config) => {
        config.forEach(group => {
            Object.keys(group.items).map((key, index) => {
                this.config[key] = group.items[key].value
            })
        })
    }

    animate = (time, frequencyBins) => {
        this.updateAutomations(time)
        this._animate(time, frequencyBins)
        this._lastTime = time
    }
    checkNum = (nr) => isNaN(nr) ? 0 :  Number(nr)

    updateAutomations = (time) => {
        const automations = this.automations
        let changed = false
        let config = {...this.config}
        if(automations.length > 0 && time !== this._lastTime) {
            automations.forEach(e => {
                const index = e.points.findIndex(p => p.time >= time) 
                var newVal = 0
                if(index > 0 ) {
                    const tx = (time - e.points[index - 1].time) / (e.points[index].time - e.points[index-1].time)
                    const valueRange = this.checkNum(e.points[index].value) - this.checkNum(e.points[index-1].value)
                    newVal = this.checkNum(e.points[index - 1].value) + (tx * valueRange)
                }else {
                    newVal = this.checkNum(e.points[e.points.length -1].value)
                }

                if(config[e.name] !== newVal)changed = true
                config[e.name] = newVal
               
            })

            if(changed) {
                this._updateConfig(config)
            }
        }
        
        return {...config}
    }

    incrementTime = (time) => {}

    setTime = (time, _, itemId) => {
        const config = this.updateAutomations(time)
        delete config["automations"]
        if(itemId === config.id && this.automations.length > 0)updateItemConfig(config)
    }

    //TODO remove // find better use
    stop = () => {}
    play = () => {}
    _animate = () => {}
    _updateConfig = () => {}
    
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

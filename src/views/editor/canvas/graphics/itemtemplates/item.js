import { addItem, updateItemConfig } from '@redux/actions/items'
import {setDisabled} from '@redux/actions/globals'

export default class BaseItem {
    constructor(config) {
        setDisabled(true)
       
        const timeGroup = {
            title: "Base Configurations", 
            items: {
                start: {value: 0, type: "Number", tooltip: "Time in seconds when item will be rendered", disableAutomations: true},
                duration: {value: 20, type: "Number", tooltip: "Time in seconds when item won't be rendered anymore", disableAutomations: true},
                zIndex: {value: config.renderIndex, type: "Number", tooltip: "Index of turn in renderloop",  disableAutomations: true}
            }
        }

        this.config = {}
        this.config.defaultConfig = [timeGroup]
        //TODO UUID ?
        this.config._easyConfigs        = false;
        this.config.id                  = Math.floor(Math.random() * 10000000);
        this.config.offsetLeft          = 0;
        this.config.name                = config.name;
        this.config.movable             = true;
        this.config.sceneId             = config.sceneId;
        this.config.itemType            = config.type; 
        this.config._automationId       = null;
        this.config._automationEnabled  = false;
        this.config._automationType     = "*";
        
        this.mesh = {};
        this.getConfig();
        this._lastTime = -1;
    }

    applyAutomations = (values) => {
        
    }

    addItem = () => {
        addItem(this.config)
        setDisabled(false)
        this.mesh.name = String(this.config.id)
    }

    __updateGroup = (group, config) => {
        if(group.isSuperGroup) {
            group.items.forEach(g => this.__updateGroup(g, config));
            return;
        }

        Object.keys(group.items).forEach(key => {
            const { type, max, min } = group.items[key]
            if( type === "Number") {
                config[key] = this.checkNum(config[key])

                if(config[key] > max)config[key] = max
                if(config[key] < min)config[key] = min
            }
        })
    }

    updateConfig = (config) => {
        const c = {...config}

        c.defaultConfig.forEach(group => {
            this.__updateGroup(group, c);
        })

        this._updateConfig(c)
    } 

    _getConfigGroup = (group) => {
        if(group.isSuperGroup) {
            group.items.forEach(g => this._getConfigGroup(g))
            return
        }

        Object.keys(group.items).forEach(key => {
            this.config[key] = group.items[key].value
        })
    }

    getConfig = () => {
        this.config.defaultConfig.forEach(group => {
            this._getConfigGroup(group)   
        })
    }

    animate = (time, frequencyBins, alpha) => {
        if(time !== this._lastTime) {
            this._animate(time, frequencyBins, alpha)
        }
      
        this._lastTime = time
    }
    checkNum = (nr) => isNaN(nr) ? 0 :  Number(nr)

    

    incrementTime = (time) => {}

    setTime = (width, height) => {}
    //TODO remove // find better use
    _updateConfig = (config) => { this.config = config }
    _animate = () => {}
    stop = () => {}
    play = () => {}
    updateFile = () => {}
    setFFTSize = (value) => {}
    
    
} 








export default class ItemSkeleton {
    constructor(config) {
        const headerGroup = { 
                title: "Author Information", 
                hide: true,
                items: {
                    author: {value: "example", type: "String", disabled: false},
                    website: {value: "http://example.org", type: "Link", disabled: false},
                    github: {value: "https://github.com/example", type: "Link", disabled: false},
            }
        }

        this.config = {}
        this.config.defaultConfig = [headerGroup]

        //TODO UUID ?
        this.config.id          = Math.floor(Math.random() * 10000000)
        this.config.automations = []        
        
        this.automations = []
        this.getConfig()
        this._lastTime = -1
        this.getConfig()
    }

    addItem = () => {}

    _updateGroup = (group, config) => {
        if(group.isSuperGroup) {
            group.items.forEach(g => this._updateGroup(g, config));
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

    checkNum = (nr) => isNaN(nr) ? 0 :  Number(nr)

    editConfig = (config) => {
        const c = {...config}

        c.defaultConfig.forEach(group => {
            this._updateGroup(group, config);
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

    animate = (time, frequencyBins) => {
        if(time !== this._lastTime) {
            this.updateAutomations(time)
            this._animate(time, frequencyBins)
        }
      
        this._lastTime = time
    }
    
    checkNum = (nr) => isNaN(nr) ? 0 :  Number(nr)

    updateAutomations = (time) => {}

    incrementTime = (time) => {}

    setTime = (time, _, itemId) => {}

    //TODO remove // find better use
    _updateConfig = (config) => { this.config = config }
    _animate = () => {}
    stop = () => {}
    play = () => {}
} 






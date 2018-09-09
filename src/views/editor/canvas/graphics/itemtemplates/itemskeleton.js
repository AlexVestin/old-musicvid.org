

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

    updateConfig = (config) => {
        const c = {...config}
        c.defaultConfig.forEach(group => {
            Object.keys(group.items).forEach(key => {
                if( group.items[key].type === "Number") {
                    c[key] = this.checkNum(c[key])
                }
            })
        })

        this._updateConfig(c)
    } 
    
    getConfig = () => {
        this.config.defaultConfig.forEach(group => {
            Object.keys(group.items).map((key, index) => {
                this.config[key] = group.items[key].value
            })
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






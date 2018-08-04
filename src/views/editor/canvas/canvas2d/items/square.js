import BaseItem from '../../three/items/item'


export default class Square extends BaseItem {
    constructor(config) {
        super(config)

        this.ctx = config.ctx
        this.canvas = config.canvas

        this.config.defaultConfig.push({
            title: "Settings",
            items: {
                color: {type: "String", value: "EEE"}
            }
        })


        this.getConfig()
        this.addItem()
    }

    animate = (time, freqBins) => {
        const { width, height } = this.canvas
        this.ctx.fillStyle = "#" + this.config.color
        this.ctx.fillRect(0,0,width, height)
    }

    setSize = (width, height) => {
        this.width = width
        this.height = height
    }
}
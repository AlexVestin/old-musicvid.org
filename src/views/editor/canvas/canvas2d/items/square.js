import BaseItem from '../../three/items/item'


export default class Square extends BaseItem {
    constructor(config) {
        super(config)

        this.ctx = config.ctx
        this.canvas = config.canvas

        this.addItem()
    }

    animate = (time, freqBins) => {
        const { width, height } = this.canvas
        this.ctx.fillStyle = "#FF0000"
        this.ctx.fillRect(0,0,width, height)
    }
}
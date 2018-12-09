import BaseItem from '../../itemtemplates/item'


export default class Square extends BaseItem {
    constructor(config, fileConfig) {
        super(config)

        this.ctx = config.ctx
        this.canvas = config.canvas

        if(!fileConfig) {
            this.config.defaultConfig.push({
                title: "Settings",
                items: {
                    color: {type: "String", value: "EEE"},
                    x: {type: "Number", value: 0 },
                    y: {type: "Number", value: 0 },
                    height: {type: "Number", value: 1 },
                    width: {type: "Number", value: 1 },
                }
            })
    
            this.aspectRatio = config.height / config.width
    
            this.getConfig()
            this.addItem()
        }else {
            this.config = {...fileConfig}
        }
       
    }

    animate = (time, freqBins, alpha) => {
        const { width, height } = this.canvas
        this.ctx.fillStyle = "#" + this.config.color
        this.ctx.globalAlpha = alpha;
        this.ctx.fillRect(this.config.x * width, this.config.y * height,this.config.width * width,  this.config.height * height)
    }

    setSize = (width, height) => {
        this.width = width
        this.height = height
    }
}
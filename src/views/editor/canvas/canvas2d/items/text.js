import BaseItem from '../../three/items/item'



const fontList = [
    "Andale Mono",
    "Arial Italic",
    "Comic Sans MS",
    "sans-serif",
    "Courier New Bold",
    "Arial",
    "Impact",
    "Tahoma",
    "Verdana Bold",
    "Lucida Sans Bold"
]

export default class SimpleText extends BaseItem {

    constructor(config) {
        super(config)   


        this.width  = config.width
        this.height  = config.height

        this.widthScale = config.canvas.width / this.width
        this.heightScale = config.canvas.height / this.height

        this.config.defaultConfig.push({
            title: "Text settings",
            items: {
                text: { type: "String", value: "Text" },
                fontSize: {type:  "Number", value: 40},
                font: {type: "List", options: fontList, defaultIndex: 0, value: "Andele Mono"},
                textAlign: {type: "List", options: ["center", "left", "right"], value: "center", defaultIndex: 0},
                x: {type: "Number", value: 300},
                y: {type: "Number", value: 300},
                color: {type: "String", value: "FFFFFF"}
            }
        })

        this.ctx = config.ctx
        this.canvas = config.canvas
        this.getConfig()
        this.addItem()
    }

    animate = (time, audioData) => {
        this.ctx.font =  `${this.config.fontSize * this.widthScale}pt ${this.config.font}`
        this.ctx.fillStyle = '#' + this.config.color;
        this.ctx.textAlign = this.config.textAlign
        this.ctx.fillText(this.config.text, this.config.x * this.widthScale, this.config.y*this.heightScale)
    }
}
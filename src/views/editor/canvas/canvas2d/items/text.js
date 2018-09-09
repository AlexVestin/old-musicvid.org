import BaseItem from '../../itemtemplates/item'

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

    constructor(config, fileConfig) {
        super(config)   

        if(!fileConfig) {
            this.config.defaultConfig.push({
                title: "Text settings",
                items: {
                    text: { type: "String", value: "Text" },
                    fontSize: {type:  "Number", value: 80},
                    baseLine: {type: "List", options: ["middle", "bottom", "top"], value: "middle"},
                    font: {type: "List", options: fontList, defaultIndex: 0, value: "Andele Mono"},
                    textAlign: {type: "List", options: ["center", "left", "right"], value: "center", defaultIndex: 0},
                    x: {type: "Number", value: 0.5},
                    y: {type: "Number", value: 0.5},
                    color: {type: "String", value: "FFFFFF"}
                }
            })
            this.getConfig()
            this.addItem()
        }else {
            this.config = {...config}
        }
      

        this.ctx = config.ctx
        this.canvas = config.canvas
        
        
    }

    setStyle = () => {
        this.ctx.font =  `${this.config.fontSize}pt ${this.config.font}`
        this.ctx.fillStyle = '#' + this.config.color;
        this.ctx.textAlign = this.config.textAlign
        this.ctx.textBaseline  = this.config.baseLine
    }

    animate = (time, audioData) => {
        this.setStyle();
        this.ctx.fillText(this.config.text, this.config.x * this.canvas.width, this.config.y* this.canvas.height)
    }

    setSize = (width, height) => {
        this.width = width
        this.height = height
    }
}
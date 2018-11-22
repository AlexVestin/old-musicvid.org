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
            this.config._groups.push({name: "visuals"})
            this.config.text = {label: "start time1", type: "String", value: "Text", group: "visuals" }
            this.config.fontSize = {label: "start time2", type:  "Number", value: 80, group: "visuals"}
            this.config.baseLine =  {label: "start time3", type: "List", options: ["middle", "bottom", "top"], value: "middle", group: "visuals"}
            this.config.font = {label: "start time4", type: "List", options: fontList, defaultIndex: 0, value: "Andele Mono", group: "visuals"}
            this.config.textAlign =  {label: "start time5", type: "List", options: ["center", "left", "right"], value: "center", defaultIndex: 0, group: "visuals"}
            this.config.x = {label: "start time6", type: "Number", value: 0.5, group: "visuals"}
            this.config.y = {label: "start time7", type: "Number", value: 0.5, group: "visuals"}
            this.config.color = {label: "start time8", type: "String", value: "FFFFFF", group: "visuals"}
            this.addItem()
        }else {
            this.config = {...config}
        }
      
        this.ctx = config.ctx
        this.canvas = config.canvas
    }

    setStyle = () => {
        this.ctx.font =  `${this.config.fontSize.value}pt ${this.config.font.value}`
        this.ctx.fillStyle = '#' + this.config.color.value;
        this.ctx.textAlign = this.config.textAlign.value;
        this.ctx.textBaseline  = this.config.baseLine.value;
    }

    animate = (time, audioData) => {
        const text = this.config.text.value;
        const x = this.config.text.value;
        const y = this.config.text.value;


        this.setStyle();
        this.ctx.fillText(text, x * this.canvas.width, y* this.canvas.height)
    }

    setSize = (width, height) => {
        this.width = width
        this.height = height
    }
}
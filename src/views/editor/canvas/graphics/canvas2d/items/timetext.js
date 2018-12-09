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

export default class TimeText extends BaseItem {

    constructor(config, fileConfig) {
        super(config)   

        if(!fileConfig) {
            this.config.defaultConfig.push({
                title: "Text settings",
                items: {
                    fontSize: {type:  "Number", value: 80},
                    baseLine: {type: "List", options: ["middle", "bottom", "top"], value: "middle"},
                    font: {type: "List", options: fontList, defaultIndex: 0, value: "Andele Mono"},
                    textAlign: {type: "List", options: ["center", "left", "right"], value: "center", defaultIndex: 0},
                    x: {type: "Number", value: 0.5},
                    y: {type: "Number", value: 0.5},
                    color: {type: "String", value: "FFFFFF"},
                    decimals: {type: "Number", value: 0},
                    useStartTime: {type: "Boolean", value: false}
                }
            })
            
            this.getConfig()
            this.addItem()
        }else {
            this.config = {...fileConfig}
        }
       
        this.ctx = config.ctx
        this.canvas = config.canvas
        
    }

    setStyle = (alpha) => {
        this.ctx.globalAlpha = alpha;
        this.ctx.font =  `${this.config.fontSize}pt ${this.config.font}`;
        this.ctx.fillStyle = '#' + this.config.color;
        this.ctx.textAlign = this.config.textAlign;
        this.ctx.textBaseline  = this.config.baseLine;
    }

    toFixed = (number) => {
        var s = number.toString();
        if (s.indexOf('.') === -1) s += '.';
        while (s.length < s.indexOf('.') + this.config.decimals) s += '0';
        return s;
    }
    
    formatTime = (seconds) => {
        let m = String(Math.floor((seconds % 3600) / 60));
        let s = String(seconds % 60).split(".")[0];
        const dec = String(seconds).split(".")[1];

        if(m.length === 1)m = "0" + m;
        if(s.length === 1)s = "0" + s;

        let formatted = m + ":" + s;
        if(dec) {
            formatted += "." + dec.substring(0, this.config.decimals);
        }

        return formatted; 
      }

    animate = (time, audioData, alpha) => {
        this.setStyle(alpha);
        const t = this.formatTime(time.toFixed(this.config.decimals));
        this.ctx.fillText(t, this.config.x * this.canvas.width, this.config.y * this.canvas.height);
    }

    setSize = (width, height) => {
        this.width = width
        this.height = height
    }
}
import BaseItem from "../../itemtemplates/item";

export default class TimeKeeper extends BaseItem {
    constructor(config) {
        super(config);

        this.ctx = config.ctx;
        this.canvas = config.canvas;

        const group = {
            title: "Positioning",
            items: {
                x: { type: "Number", value: 0.1},
                y: { type: "Number", value: 0.8},
                lineWidth: {type: "Number", value: 5},
                width: {type: "Number", value: 0.8},
                color: {type: "String", value: "FFFFFF"},
                songDuration: {type: "Number", value: 180}
            }   
        }

        this.config.defaultConfig.push(group);

        this.config.defaultConfig.push({
            title: "Glow",
            items: {
                glow: {type: "Boolean", value: true},
                shadowColor: {type: "String", value: "FFFFFF"},
                shadowBlur: {type: "Number", value: 20},
            }
        })

        this.getConfig();
        this.addItem();
    }

    _updateConfig = (config) => { 
        this.config = config
    }

    setStyle = () => {
        this.ctx.shadowColor = '#' +  this.config.shadowColor;
        this.ctx.shadowBlur = this.config.shadowBlur;

        this.ctx.strokeStyle = "#" + this.config.color;
        this.ctx.lineWidth = this.config.lineWidth; 
        if(this.config.glow) {
            this.ctx.shadowColor = '#' +  this.config.shadowColor;
            this.ctx.shadowBlur = this.config.shadowBlur;
        } else {
            this.ctx.shadowBlur = 0;
        }

         /*var gradient = this.ctx.createLinearGradient(cx, cy, cxOuter, cyOuter);
        gradient.addColorStop(0, '#FE4365');
        gradient.addColorStop(0.6, '#FE4365');
        gradient.addColorStop(1, '#F5F5F5');
        this.ctx.strokeStyle = gradient;*/
    }

    setStyle = () => {
        this.ctx.shadowColor = '#' +  this.config.shadowColor;
        this.ctx.shadowBlur = this.config.shadowBlur;

        this.ctx.strokeStyle = "#" + this.config.color;
        this.ctx.lineWidth = this.config.lineWidth; 
        if(this.config.glow) {
            this.ctx.shadowColor = '#' +  this.config.shadowColor;
            this.ctx.shadowBlur = this.config.shadowBlur;
        } else {
            this.ctx.shadowBlur = 0;
        }
    }



    _animate = (time, audioData) => {
        const x = this.config.x * this.canvas.width;
        const y = this.config.y * this.canvas.height;
        const length = (time / this.config.songDuration) * this.config.width * this.canvas.width;

        this.setStyle();
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + length, y);
        this.ctx.stroke();
    }
}
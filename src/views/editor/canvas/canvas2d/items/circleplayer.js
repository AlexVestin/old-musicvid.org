import CombinedAudioItem from "../../itemtemplates/combinedaudio";

export default class CirclePlayer extends CombinedAudioItem {
    constructor(config) {
        super(config);
        this.buffer = null;
        this.duration = 0;

        this.ctx = config.ctx;
        this.canvas = config.canvas;

        const group = {
            title: "Positioning",
            items: {
                x: { type: "Number", value: 0.5},
                y: { type: "Number", value: 0.5},
                radius: {type: "Number", value: 200},
                lineWidth: {type: "Number", value: 2},
                color: {type: "String", value: "FFFFFF"},
                staticRotation: {type: "Number", value: 270},
                mirror: {type: "Boolean", value: true},
                fillEmblem: {type: "Boolean", value: true},
                emblemColor: {type: "String", value: "FFFFFF"},
                emblemMargin: {type: "Number", value: 0} 
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

    drawTick = (index, amp, totalSize, totalAmp) => {
        const { x, y, radius, staticRotation } = this.config

        const cAmp = (1.001 + amp / 24) || 1.01;

        const startAngle = (staticRotation / 180) * Math.PI;
        const angle = (2 * Math.PI / totalSize) * index + startAngle;
        const cx = (x  * this.canvas.width) + (radius + totalAmp / 4) * Math.cos(angle);
        const cy = (y * this.canvas.height) + (radius + totalAmp / 4) * Math.sin(angle);
        
        const cxOuter = (x  * this.canvas.width) + (radius + totalAmp / 4) * Math.cos(angle) * cAmp;
        const cyOuter = (y * this.canvas.height) + (radius + totalAmp / 4) * Math.sin(angle) * cAmp;

        
        this.setStyle();
        
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy);
        this.ctx.lineTo(cxOuter, cyOuter);
        this.ctx.stroke();
    }

    _animate = (time, audioData) => {
        const { x, y, radius, emblemMargin } = this.config

        const bins = this.getTransformedSpectrum(audioData.bins);
        const amp = this.getImpactAmplitude(audioData.bins);
        const size = bins.length;

        if(this.config.fillEmblem) {
            this.ctx.fillStyle = '#' + this.config.emblemColor;
            this.ctx.beginPath();
            this.ctx.arc((x  * this.canvas.width), (y * this.canvas.height), (radius + amp / 4) - emblemMargin, 0, 2 * Math.PI, false);
            this.ctx.fill();
        }

        if(this.config.mirror) {
            for(var i = 0; i < size; i++) {
                this.drawTick(i, bins[i], size * 2, amp);
                this.drawTick(-i, bins[i], size * 2, amp);
            }
        }else {
            for(var i = 0; i < size; i++) {
                this.drawTick(i, bins[i], size, amp);
            }
        }

        
    }
}
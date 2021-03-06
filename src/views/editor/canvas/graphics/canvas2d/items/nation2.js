import CombinedAudioItem from "../../itemtemplates/combinedaudio";

export default class CirclePlayer extends CombinedAudioItem {
    constructor(config, fileConfig) {
        super(config);
        this.buffer = null;
        this.duration = 0;

        this.ctx = config.ctx;
        this.canvas = config.canvas;

        if(!fileConfig) {
            const group = {
                title: "Spectrum",
                items: {
                    x: { type: "Number", value: 0.5},
                    y: { type: "Number", value: 0.5},
                    radius: {type: "Number", value: 150},
                    lineWidth: {type: "Number", value: 4},
                    lineColor: {type: "String", value: "FFFFFF"},
                    fillColor: {type: "String", value: "FFFFFF"},
                    staticRotation: {type: "Number", value: 270},
                    mirror: {type: "Boolean", value: true},
                }   
            }
    
            const emblemGroup = {
                title: "Emblem",
                items: {
                    fillEmblem: {type: "Boolean", value: true},
                    emblemColor: {type: "String", value: "FFFFFF"},
                    emblemMargin: {type: "Number", value: 10},
                }
            }
    
            this.config.defaultConfig.push(group);
            this.config.defaultConfig.push(emblemGroup);
    
            this.config.defaultConfig.push({
                title: "Glow",
                items: {
                    glow: {type: "Boolean", value: true},
                    shadowColor: {type: "String", value: "FFFFFF"},
                    shadowBlur: {type: "Number", value: 20},
                }
            })
    
            this.getConfig();
            this.config.impactAmplitude = 3;
            this.config.spectrumSize = 64;
            this.config.easeAmplitude = true;
            this.config.easeAmount = 6.5;
            this.config.amplitude = 5;
            this.config.enableLogTransform = false;
            this.config.enableCombineBins = false;
            this.addItem();
        }else {
            this.config = {...fileConfig}
        }
    }

    _updateConfig = (config) => { 
        this.config = config
    }

    setStyle = (alpha) => {
        this.ctx.strokeStyle = "#" + this.config.lineColor;
        this.ctx.fillStyle = "#" + this.config.fillColor;
        this.ctx.lineWidth = this.config.lineWidth; 
        this.ctx.globalAlpha = alpha;
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
       
        
        const cxOuter = (x  * this.canvas.width) + (radius + totalAmp / 4) * Math.cos(angle) * cAmp;
        const cyOuter = (y * this.canvas.height) + (radius + totalAmp / 4) * Math.sin(angle) * cAmp;

        
        this.ctx.lineTo(cxOuter, cyOuter);
    }

    _animate = (time, audioData, alpha) => {
        const { x, y, radius, emblemMargin, startAngle } = this.config

        const bins = this.getTransformedSpectrum(audioData.bins);
        const amp = this.getImpactAmplitude(audioData.bins);
        const size = bins.length;

        const rad = (radius + amp / 4) - emblemMargin

        
        if(this.config.fillEmblem && rad > 0) {
            this.ctx.fillStyle = '#' + this.config.emblemColor;
            this.ctx.beginPath();
            this.ctx.arc((x  * this.canvas.width), (y * this.canvas.height), rad, 0, 2 * Math.PI, false);
            this.ctx.closePath();
            this.ctx.fill();
        }

        this.setStyle(alpha);

        
        this.ctx.beginPath();
        const cx = (x  * this.canvas.width) + radius * Math.cos(startAngle);
        const cy = (y * this.canvas.height) + radius * Math.sin(startAngle);

        this.ctx.moveTo(cx, cy);
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
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.fill();
        
    }
}
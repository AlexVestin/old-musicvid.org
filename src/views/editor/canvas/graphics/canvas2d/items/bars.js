
import AudioReactiveItem from '../../itemtemplates/audioreactiveitem'

export default class Bars extends AudioReactiveItem {
    constructor(config, fileConfig) {
        super(config)
        

        if(!fileConfig) {
            const group1 = { 
                title: "Decrease speed and threshold",
                items: {
                    x: {type: "Number", value: 0.5},
                    y: {type: "Number", value: 0.5},
                    shouldDropOff: {type: "Boolean", value: true},
                    decreaseSpeed: {value: 30, type: "Number", tooltip: "Amount bars will decrease in height each tick"},
                    deltaRequired: {value: 0.12, type: "Number", tooltip: "Delta from previous tick needed to push the bars up (prevents flicker)"},    
                }
            }
    
            const group2 = { 
                title: "Color and looks",
                items: {
                    color : {value: "FFFFFF", type: "String", tooltip: ""},
                    flip: {value: false, type: "Boolean", tooltip: ""},
                    scale : {value: 0.8, type: "Number", tooltip: ""},
                    width: {value: 5, type: "Number", tooltip: ""},
                    spacing : {value: 2, type: "Number", tooltip: ""},
                }
            }

            const glowGroup = {
                title: "Glow",
                items: {
                    glow: {type: "Boolean", value: false},
                    shiftingGlowColors: {type: "Boolean", value: false},
                    shadowColor: {type: "String", value: "FFFFFF"},
                    shadowBlur: {type: "Number", value: 20}
                }
            }

            this.config.defaultConfig.push(group1)
            this.config.defaultConfig.push(group2)
            this.config.defaultConfig.push(glowGroup)
            this.getConfig()
            this.config.spectrumSize = 64;
            this.config.amplitude = 200;
            this.config.spectrumMaxExponent = 3;
            this.config.decreaseSpeed = 75;
            this.addItem()
        }else {
            this.config = {...fileConfig}
        }

        this.ctx = config.ctx;
        this.canvas = config.canvas;
        
    }

    setStyle = () => {
        this.ctx.fillStyle = '#' + this.config.color;
        if(this.config.glow ===  true) {
            this.ctx.shadowColor = this.config.shadowColor
            this.ctx.shadowBlur = this.config.shadowBlur;
            this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = 0;
        } else {
            this.ctx.shadowBlur = 0;
        }
    }



    _updateConfig = (config) => {
        this.config = config
    }

    _animate = (time, audioData) => {
        const { width, x, y, spacing } = this.config
        const bins = this.getTransformedSpectrum(audioData.bins)

        this.setStyle();
        for(var i = 0; i < bins.length; i++) {
            const xp = ( x * this.canvas.width)
            const offset = (i - (bins.length/2)) * (spacing + width)

            let height = this.config.flip ? bins[i] * 10 : -bins[i] * 10;

            this.ctx.fillRect(xp+offset, y * this.canvas.height, width, height )
        }
    }
}

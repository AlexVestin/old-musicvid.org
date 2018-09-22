
import AudioReactiveItem from '../../itemtemplates/audioreactiveitem'

export default class Bars extends AudioReactiveItem {
    constructor(config, fileConfig) {
        super(config)
        

        if(!fileConfig) {
            const group1 = { 
                title: "Decrease speed and threshold",
                items: {
                    shouldDropOff: {type: "Boolean", value: true},
                    decreaseSpeed: {value: 30, type: "Number", tooltip: "Amount bars will decrease in height each tick"},
                    deltaRequired: {value: 0.12, type: "Number", tooltip: "Delta from previous tick needed to push the bars up (prevents flicker)"},    
                }
            }
    
            const group2 = { 
                title: "Color and looks",
                items: {
                    color : {value: "FFFFFF", type: "String", tooltip: ""},
                    scale : {value: 0.8, type: "Number", tooltip: ""},
                    spacing : {value: 2, type: "Number", tooltip: ""},
                }
            }

            this.config.defaultConfig.push(group1)
            this.config.defaultConfig.push(group2)
            this.getConfig()
            this.addItem()
        }else {
            this.config = {...fileConfig}
        }
        
    }

    setStyle = () => {
        this.ctx.font =  `${this.config.fontSize}pt ${this.config.font}`
        this.ctx.fillStyle = '#' + this.config.color;
        this.ctx.textAlign = this.config.textAlign
        this.ctx.textBaseline  = this.config.baseLine
    }



    _updateConfig = (config) => {
        if(config.spectrumSize !== this.config.spectrumSize) {
        }else {
            this.mesh.children.forEach(e => {
                e.material.color.setHex("0x" + config.color)
            })
            
            
            this.move(config.x, config.y, config.z, config.spacing) 
        }
        this.config = config
    }

    _animate = (time, audioData) => {
        const { deltaRequired, decreaseSpeed, scale, y, shouldDropOff } = this.config
        const bins = this.getTransformedSpectrum(audioData.bins)

        this.mesh.children.forEach( (e,i) => {
            var newScale = bins[i] > 1 ? bins[i] : 1;
            if(shouldDropOff && (newScale < e.scale.y || Math.abs(newScale - e.scale.y) < deltaRequired)) {
                newScale = e.scale.y - decreaseSpeed * (time - this._lastTime)  > 1 ? e.scale.y - decreaseSpeed * (time - this._lastTime) : 1
                newScale = time - this._lastTime < 0 ? 1 : newScale
            }

            e.scale.set(scale , newScale, scale); 
            e.position.y = y + newScale/2 
        })
    }
}

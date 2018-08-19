import MeshItem from './meshitem'


export default class AudioImpactItem extends MeshItem {
    constructor(config) {
        super(config)

        this.config.defaultConfig.push({
            title: "Audio Impact Settings",
            items: {
                easeAmplitude: {type: "Boolean", value: false},
                amplitude: {type: "Number", value: 10},
                threshold: {type: "Number", value: 40},
                easeAmount: {type: "Number", value: 2.3},
                minAmplitude: {type: "Number", value: 1},
                maxAmplitude: {type: "Number", value: 99999},
                lowerBinIndex: {type: "Number", value: 0},
                upperBinIndex: {type: "Number", value: 12},
                coolDownTime: {type: "Number", value: 0, tooltip: "Time in seconds until next impact can get triggered."}
            }
        })

        this.prevAmplitude = 0
        this.prevTime = 0
        this.getConfig()
    }

    smooth = (amp) => {
        const { threshold, easeAmount } = this.config
        if(amp > this.prevAmplitude + threshold) {
            this.prevAmplitude = amp
        }else {
            
            this.prevAmplitude -= easeAmount
            if(this.prevAmplitude < 0) this.prevAmplitude = 0
        }

        return this.prevAmplitude
    }


    getImpactAmplitude = (frequencyBins) =>  {
        const {lowerBinIndex, upperBinIndex, minAmplitude, maxAmplitude, amplitude, easeAmplitude, easeAmount, threshold } = this.config

        let sum = 0
        for(let i = lowerBinIndex; i < upperBinIndex; i++) {
            sum += frequencyBins[i] / (upperBinIndex - lowerBinIndex) 
        }
        sum *= amplitude * 0.05
        
        if( sum < this.prevAmplitude + threshold && easeAmplitude ) {
            sum = this.prevAmplitude - easeAmount
        }

        sum = sum < minAmplitude ? minAmplitude : sum
        sum = sum > maxAmplitude ? maxAmplitude : sum

        if(this.config.easeAmplitude) {
            return this.smooth(sum)
        }
       
        this.prevAmplitude = sum
        return isNaN(sum) ? 0 : sum
        
    }
}
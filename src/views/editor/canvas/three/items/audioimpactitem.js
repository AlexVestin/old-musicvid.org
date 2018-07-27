import BaseItem from './item'


export default class AudioImpactItem extends BaseItem {
    constructor(config) {
        super(config)

        this.config.defaultConfig.push({
            title: "Audio Impact Settings",
            items: {
                easeAmplitude: {type: "Boolean", value: true},
                amplitude: {type: "Number", value: 10},
                threshold: {type: "Number", value: 40},
                easeAmount: {type: "Number", value: 2.3},
                minAmplitude: {type: "Number", value: 1},
                maxAmplitude: {type: "Number", value: 99999},
                lowerBinIndex: {type: "Number", value: 0},
                upperBinIndex: {type: "Number", value: 12}
            }
        })

        this.prevAmplitude = 0
        this.getConfig()
    }


    getImpactAmplitude = (frequencyBins) =>  {
        const {lowerBinIndex, upperBinIndex, minAmplitude, maxAmplitude, amplitude, easeAmplitude, easeAmount, threshold } = this.config

        let sum = 0
        for(var i = lowerBinIndex; i < upperBinIndex; i++) {
            sum += frequencyBins[i] / (upperBinIndex - lowerBinIndex) 
        }
        sum *=  amplitude * 0.05
        

        if( sum < this.prevAmplitude + threshold && easeAmplitude ) {
            sum = this.prevAmplitude - easeAmount
        }

        sum = sum < minAmplitude ? minAmplitude : sum
        sum = sum > maxAmplitude ? maxAmplitude : sum
        this.prevAmplitude = sum
        return isNaN(sum) ? 1 : sum
    }
}
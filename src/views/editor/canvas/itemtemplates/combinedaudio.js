

import MeshItem from './meshitem'
export default class AudioCombinedItem extends MeshItem {
    constructor(config) {
        super(config)

        this.fftSize = 1024;

        const group0 = {
            title: "Amplitude and size", 
            items: {
                amplitude: { value: 9, type: "Number", tooltip: "Amplitude of the spectrum values" },
                spectrumSize: { value: 32, type: "Number", tooltip: "number of bars in the spectrum" },
                spectrumStart: { value: 0, type: "Number", tooltip: "the first bin rendered in the spectrum" },
                spectrumEnd: { value: 1024, type: "Number", tooltip: "the last bin rendered in the spectrum" },
                spectrumScale: { value: 1, type: "Number", tooltip: "the logarithmic scale to adjust spectrum values to" },
            }
        }

        const group1 = {
            title: "General fft settings",
            items: {
                enableLogTransform:         {value: true,  type: "Boolean", tooltip: "Smooths tail and head of the data"},
                enableCombineBins:          {value: true,  type: "Boolean", tooltip: "Smooths tail and head of the data"},
                combineBinsMethod:          {value: "Logarithmic", type: "List", options: ["Logarithmic", "Linear"]},
                enableNormalizeAmplitude:   {value: true,  type: "Boolean", tooltip: "Normalizes the spectrumdata using the amplitude value"},
                enableAverageTransform:     {value: true,  type: "Boolean", tooltip: "Averages data using neighbours"},
                enableTailtTransform:       {value: true,  type: "Boolean", tooltip: "Smooths tail and head of the data"},
                enableSmoothing:            {value: true,  type: "Boolean", tooltip: "Smooths"},
                enableExponentialTransform: {value: false,  type: "Boolean", tooltip: "Transforms the values exponentially"},
                enableDropOff: {value: true,  type: "Boolean", tooltip: "Dropoffs incrementally"},
            }
        }
    
        const group2 = {
            title: "Exponential settings",
            items: {
                spectrumMaxExponent: { value: 2, type: "Number", tooltip: "the max exponent to raise spectrum values to" },
                spectrumMinExponent: { value: 1, type: "Number", tooltip: "the min exponent to raise spectrum values to" },
                spectrumExponentScale: { value: 2.5, type: "Number", tooltip: "the scale for spectrum exponents" },
            }
        }
    
        const group3 = {
            title: "Group smoothing and slopes",
            items: {
                smoothingPoints: { value: 3, type: "Number", tooltip: "points to use for algorithmic smoothing. Must be an odd number." },
                smoothingPasses: { value: 1, type: "Number", tooltip: "number of smoothing passes to execute" },
                headMargin: { value: 7, type: "Number", tooltip: "the size of the head margin dropoff zone" },
                tailMargin: { value: 3, type: "Number", tooltip: "the size of the tail margin dropoff zone" },
                minMarginWeight: { value: 0.1, type: "Number", tooltip: "the minimum weight applied to bars in the dropoff zone" },
                marginDecay: { value: 1.6, type: "Number", tooltip: "the minimum weight applied to bars in the dropoff zone" },
                headMarginSlope: { value: 0.04333, type: "Number", tooltip: "" },
                tailMarginSlope: { value: 0.01, type: "Number", tooltip: "" },
            }
        }

        const group4 = {
            title: "Deltasmoothing",
            items: {
                dropOffAmount: { value: 0.80, type: "Number"},
                deltaRequired: {value: 0, type: "Number"}
            }
        }
        
        const group5 = {
            title: "Audio Impact Settings",
            items: {
                easeAmplitude: {type: "Boolean", value: false},
                impactAmplitude: {type: "Number", value: 10},
                threshold: {type: "Number", value: 40},
                easeAmount: {type: "Number", value: 2.3},
                minAmplitude: {type: "Number", value: 1},
                maxAmplitude: {type: "Number", value: 99999},
                lowerBinIndex: {type: "Number", value: 0},
                upperBinIndex: {type: "Number", value: 12},
                coolDownTime: {type: "Number", value: 0, tooltip: "Time in seconds until next impact can get triggered."}
            }
        }
        this.config.defaultConfig = [ group0, group1, group2, group3, group4, group5]

        this.prevAmplitude = 0
        this.prevTime = 0
        this.getConfig()
    }


    editConfig = (config) => {
        this.config = {...config}
        this.config.defaultConfig.forEach(group => {
            Object.keys(group.items).forEach(key => {
                if( group.items[key].type === "Number") {
                    this.config[key] = isNaN(this.config[key]) ? 0 :  Number(this.config[key])
                }
            })
        })
    }

    // mostly for debugging purposes
    smooth(array) {
        return this.savitskyGolaySmooth(array);
    }

    /**
     * Applies a Savitsky-Golay smoothing algorithm to the given array.
     *
     * See {@link http://www.wire.tu-bs.de/OLDWEB/mameyer/cmr/savgol.pdf} for more
     * info.
     *
     * @param array The array to apply the algorithm to
     *
     * @return The smoothed array
     */
    savitskyGolaySmooth(array) {
        var lastArray = array;
        for (var pass = 0; pass < this.config.smoothingPasses; pass++) {
            var sidePoints = Math.floor(this.config.smoothingPoints / 2); // our window is centered so this is both nL and nR
            var cn = 1 / (2 * sidePoints + 1); // constant
            var newArr = [];
            for (var i = 0; i < sidePoints; i++) {
                newArr[i] = lastArray[i];
                newArr[lastArray.length - i - 1] = lastArray[lastArray.length - i - 1];
            }
            for (var i = sidePoints; i < lastArray.length - sidePoints; i++) {
                var sum = 0;
                for (var n = -sidePoints; n <= sidePoints; n++) {
                    sum += cn * lastArray[i + n] + n;
                }
                newArr[i] = sum;
            }
            lastArray = newArr;
        }
        return newArr;
    }

    log = (arr) => arr.map(e => 20 * Math.log10(e))
    dropOffTransform = (arr) => {
        if(!this.cachedArr) {
            this.cachedArr = arr;
            return arr;
        }

        let newArr = new Array(arr.length);
        for(var i = 0; i < arr.length; i++) {
            if(arr[i] > this.cachedArr[i] + this.config.deltaRequired || isNaN(this.cachedArr[i])) {
                newArr[i] = arr[i];
            }else {
                newArr[i] = this.cachedArr[i] * this.config.dropOffAmount;
            }
        }

        this.cachedArr = newArr;
        return newArr;
    }

    transformToVisualBins = (array) => {
        const { spectrumSize, spectrumScale } = this.config; 
        const spectrumStart = 0;
        const spectrumEnd = this.fftSize;

        var newArray = new Float32Array(spectrumSize);
        for (var i = 0; i < spectrumSize; i++) {
            var bin = Math.pow(i / spectrumSize, spectrumScale) * (spectrumEnd - spectrumStart) + spectrumStart;
            newArray[i] = array[Math.floor(bin) + spectrumStart] * (bin % 1) + array[Math.floor(bin + 1) + spectrumStart] * (1 - (bin % 1))
        }

        console.log("log")
        return newArray;
    }


    combineBinsLinear = (arr) => {
        let newArr = new Array(arr.length), inc = 0;
        let step = Math.floor(this.fftSize / this.config.spectrumSize);
        for(var i = 0; i < arr.length; i++) {
            newArr[i] = 0;
            for(var j = 0; j < step; j++) {
                newArr[i] += arr[inc++]; 
            }
            newArr[i] /= step;
        }

        return newArr;
    }

    combineBins = (arr) => {
        console.log(this.config.combineBinsMethod)
        if(this.config.combineBinsMethod === "Linear") {
            return this.combineBinsLinear(arr);
        }else if(this.config.combineBinsMethod === "Logarithmic") {
            return this.transformToVisualBins(arr);
        }

    }

    getTransformedSpectrum(array) {
        var newArr = array.slice()
        if(this.config.enableLogTransform)          newArr = this.log(newArr);
        if(this.config.enableCombineBins)           newArr = this.combineBins(newArr);
        if(this.config.enableNormalizeAmplitude)    newArr = this.normalizeAmplitude(newArr);
        if(this.config.enableAverageTransform)      newArr = this.averageTransform(newArr)
        if(this.config.enableTailtTransform)        newArr = this.tailTransform(newArr);
        if(this.config.enableSmoothing)             newArr = this.smooth(newArr);
        if(this.config.enableExponentialTransform)  newArr = this.exponentialTransform(newArr);
        if(this.config.enableDropOff)               newArr = this.dropOffTransform(newArr);
        return newArr;
    }

    
    normalizeAmplitude(array) {
        const { spectrumSize, amplitude } = this.config
        var values = [];
        for (var i = 0; i < spectrumSize; i++) {
            values[i] = array[i] / 255 * amplitude;
        }
        return values;
    }


    averageTransform(array) {
        var values = [];
        var length = array.length;

        for (var i = 0; i < length; i++) {
            var value = 0;
            if (i === 0) {
                value = array[i];
            } else if (i === length - 1) {
                value = (array[i - 1] + array[i]) / 2;
            } else {
                var prevValue = array[i - 1];
                var curValue = array[i];
                var nextValue = array[i + 1];

                if (curValue >= prevValue && curValue >= nextValue) {
                    value = curValue;
                } else {
                    value = (curValue + Math.max(nextValue, prevValue)) / 2;
                }
            }

            values[i] = value;
        }

        var newValues = [];
        for (var i = 0; i < length; i++) {
            let value = 0;
            if (i == 0) {
                value = values[i];
            } else if (i == length - 1) {
                value = (values[i - 1] + values[i]) / 2;
            } else {
                var prevValue = values[i - 1];
                var curValue = values[i];
                var nextValue = values[i + 1];

                if (curValue >= prevValue && curValue >= nextValue) {
                    value = curValue;
                } else {
                    value = ((curValue / 2) + (Math.max(nextValue, prevValue) / 3) + (Math.min(nextValue, prevValue) / 6));
                }
            }

            newValues[i] = value;
        }
        return newValues;
    }

    tailTransform(array) {
        const { spectrumSize, tailMargin, marginDecay, minMarginWeight, headMargin, headMarginSlope, tailMarginSlope } = this.config

        var values = [];
        for (var i = 0; i < spectrumSize; i++) {
            var value = array[i];
            if (i < headMargin) {
                value *= headMarginSlope * Math.pow(i + 1, marginDecay) + minMarginWeight;
            } else if (spectrumSize - i <= tailMargin) {
                value *= tailMarginSlope * Math.pow(spectrumSize - i, marginDecay) + minMarginWeight;
            }
            values[i] = value;
        }
        return values;
    }

    exponentialTransform(array) {
        const { spectrumMaxExponent, spectrumMinExponent, amplitude, spectrumSize, spectrumExponentScale } = this.config

        var newArr = [];
        if(array.length) {
            for (var i = 0; i < array.length; i++) {
                var exp = (spectrumMaxExponent - spectrumMinExponent) * (1 - Math.pow(i / spectrumSize, spectrumExponentScale)) + spectrumMinExponent;
                newArr[i] = Math.max(Math.pow(array[i] / amplitude, exp) * amplitude, 1);
            }
        }else {
            return array
        }
        
        return newArr;
    }

    smoothImpact = (amp) => {
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
        const {lowerBinIndex, upperBinIndex, minAmplitude, maxAmplitude, impactAmplitude, easeAmplitude, easeAmount, threshold } = this.config

        let sum = 0
        for(let i = lowerBinIndex; i < upperBinIndex; i++) {
            sum += frequencyBins[i] / (upperBinIndex - lowerBinIndex) 
        }
        sum *= impactAmplitude * 0.05
        
        if( sum < this.prevAmplitude + threshold && easeAmplitude ) {
            sum = this.prevAmplitude - easeAmount
        }

        sum = sum < minAmplitude ? minAmplitude : sum
        sum = sum > maxAmplitude ? maxAmplitude : sum

        if(this.config.easeAmplitude) {
            return this.smoothImpact(sum)
        }
       
        this.prevAmplitude = sum
        return isNaN(sum) ? 0 : sum
        
    }
}
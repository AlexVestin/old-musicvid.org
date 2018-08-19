import BaseItem from '../../itemtemplates/item'


export default class JSNation extends BaseItem {
    constructor(config) {
        super(config)
            this.spectrumCache = []

            this.config.defaultConfig.push({
                title: "Settings",
                items: {
                    spectrumCount: {type: "Number", value: 8},
                    spectrumHeightScalar: {type: "Number", value: 0.12},
                    startBin: {type: "Number", value: 0},
                    keepBins: {type: "Number", value: 13},
                    smoothingPasses: {type: "Number", value: 1},
                    smoothingPoints: {type: "Number", value: 3},
                    radius: {type: "Number", value:  300}
                }
            })

            this.ctx = config.ctx
            this.canvas = config.canvas

            this.colors = ["#FFFFFF", "#FFFF00", "#FF0000", "#FF66FF", "#333399", "#0000FF", "#33CCFF", "#00FF00"];
            this.delays = [0, 1, 2, 3, 4, 5, 6, 7];
            this.exponents = [1, 1.12, 1.14, 1.30, 1.33, 1.36, 1.50, 1.52];
            this.smoothMargins = [0, 2, 2, 3, 3, 3, 5, 5];
            this.spectrumHeightScalar =  0.4

            this.resolutionMultiplier = 1

            this.getConfig()
            this.addItem()
        }

        transform = function(spectrum) {
            const sb = this.config.startBin >= 0 && this.config.startBin < 2000 ? this.config.startBin : 0
            const kb = this.config.keepBins > 10 && this.config.keepBins < 2000 ? this.config.keepBins : 10
            let subArr = spectrum.slice(sb, sb + kb);
            return this.savitskyGolaySmooth(subArr);
        }
    
        multiplier = function(spectrum) {
            let sum = 0;
            let len = spectrum.length;
            for (let i = 0; i < len; i++) {
                sum += spectrum[i];
            }
            const kb =  this.config.keepBins > 10 && this.config.keepBins < 2000 ? this.config.keepBins : 10
            let intermediate = sum / kb / 256;
            let transformer = 1.2;
            return (1 / (transformer - 1)) * (-Math.pow(intermediate, transformer) + transformer * intermediate);
        }

        setSize = (width, height) => {
            this.width = width
            this.height = height
        }
    
        // I'm not convinced this is a Savitsky-Golay smooth. I'm not sure what it is actually.
        savitskyGolaySmooth = (array) => {
            let lastArray = array;
            let newArr = [];
            for (let pass = 0; pass < this.config.smoothingPasses; pass++) {
                let sidePoints = Math.floor(this.config.smoothingPoints / 2); // our window is centered so this is both nL and nR
                let cn = 1 / (2 * sidePoints + 1); // constant
                for (let i = 0; i < sidePoints; i++) {
                    newArr[i] = lastArray[i];
                    newArr[lastArray.length - i - 1] = lastArray[lastArray.length - i - 1];
                }
                for (let i = sidePoints; i < lastArray.length - sidePoints; i++) {
                    let sum = 0;
                    for (let n = -sidePoints; n <= sidePoints; n++) {
                        sum += cn * lastArray[i + n] + n;
                    }
                    newArr[i] = sum;
                }
                lastArray = newArr;
            }
            return newArr;
        }
        
        animate = (time, audioData) =>  {
            const spectrum = this.transform(audioData.bins)

            if(audioData.bins.length > 0) {
                if (this.spectrumCache.length >= this.config.spectrumCount) {
                    this.spectrumCache.shift();
                }
                
                this.spectrumCache.push(spectrum);
                let curRad = this.config.radius;
                
                for (let s = this.config.spectrumCount - 1; s >= 0; s--) {
                    const ind = Math.max(this.spectrumCache.length - this.delays[s] - 1, 0)
                    let curSpectrum = this.smooth(this.spectrumCache[ind], this.smoothMargins[s]);
                    
                    let points = [];
        
                    this.ctx.fillStyle = this.colors[s];
                    this.ctx.shadowColor = this.colors[s];
        
                    let len = curSpectrum.length;
                    for (let i = 0; i < len; i++) {
                        let t = Math.PI * (i / (len - 1)) - Math.PI / 2;
                        let r = curRad + Math.pow(curSpectrum[i] * this.config.spectrumHeightScalar * this.resolutionMultiplier, this.exponents[s]);
                        let x = r * Math.cos(t);
                        let y = r * Math.sin(t);

                        points.push({x: x, y: y});
                    }
        
                    this.drawPoints(points);
                }
            }
        }

    shakeCallback = () => {
        /*
        let step = Config.maxShakeIntensity * multiplier;
        waveFrameX += step * waveSpeedX;
        if (waveFrameX > WAVE_DURATION) {
            waveFrameX = 0;
            waveAmplitudeX = Util.random(Config.minShakeScalar, Config.maxShakeScalar);
            waveSpeedX = Util.random(Config.minShakeScalar, Config.maxShakeScalar) * (Math.random() < 0.5 ? -1 : 1);
            trigX = Math.round(Math.random());
        }
        waveFrameY += step * waveSpeedY;
        if (waveFrameY > WAVE_DURATION) {
            waveFrameY = 0;
            waveAmplitudeY = Util.random(Config.minShakeScalar, Config.maxShakeScalar);
            waveSpeedY = Util.random(Config.minShakeScalar, Config.maxShakeScalar) * (Math.random() < 0.5 ? -1 : 1);
            trigY = Math.round(Math.random());
        }

        let trigFuncX = trigX == 0 ? Math.cos : Math.sin;
        let trigFuncY = trigY == 0 ? Math.cos : Math.sin;

        let dx = trigFuncX(waveFrameX) * Config.maxShakeDisplacement * waveAmplitudeX * multiplier;
        let dy = trigFuncY(waveFrameY) * Config.maxShakeDisplacement * waveAmplitudeY * multiplier;

        Canvas.context.translate(dx, dy);
        */
    }
        
    drawPoints = (points) => {

       
        if (points.length === 0) {
            return;
        }

        this.ctx.beginPath();

        let halfWidth = this.canvas.width / 2;
        let halfHeight = this.canvas.height / 2;

        for (let neg = 0; neg <= 1; neg++) {
            let xMult = neg ? -1 : 1;
            this.ctx.moveTo(halfWidth, points[0].y + halfHeight);

            let len = points.length;
            for (let i = 1; i < len - 2; i++) {
                let c = xMult * (points[i].x + points[i + 1].x) / 2 + halfWidth;
                let d = (points[i].y + points[i + 1].y) / 2 + halfHeight;
                this.ctx.quadraticCurveTo(xMult * points[i].x + halfWidth, points[i].y + halfHeight, c, d);
            }
            this.ctx.quadraticCurveTo(xMult * points[len - 2].x + halfWidth + neg * 2,
                    points[len - 2].y + halfHeight, xMult * points[len - 1].x + halfWidth,
                    points[len - 1].y + halfHeight);
        }
        this.ctx.fill();
    }
    
    smooth = (points, margin) =>{
        if (margin == 0) {
            return points;
        }

        let newArr = Array();
        for (let i = 0; i < points.length; i++) {
            let sum = 0;
            let denom = 0;
            for (let j = 0; j <= margin; j++) {
                if (i - j < 0 || i + j > points.length - 1) {
                    break;
                }
                sum += points[i - j] + points[i + j];
                denom += (margin - j + 1) * 2;
            }
            newArr[i] = sum / denom;
        }
        return newArr;
    }
    
}
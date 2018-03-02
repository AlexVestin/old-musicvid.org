
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var source = audioCtx.createBufferSource();
var offlineContext

export default class Sound {
    constructor(filename){
        this.soundDataBuffer = []
        this.startTime = -1
        this.loaded = false
        this.dest = audioCtx.createMediaStreamDestination()
        this.stream = this.dest.stream
        this.loadSound(filename, (data) => this.fftData = data)

        this.loaded = false;
    }

    play = () => {
        this.source = audioCtx.createBufferSource();
        this.source.buffer = this.buffer;
        //video output
        this.source.connect(this.dest);
        //speaker output
        this.source.connect(audioCtx.destination)
        this.source.start(0)
        this.startTime = performance.now();
    }

    loadSound = (filename, callback) => {
        let that = this
        var reader = new FileReader();
            reader.onload = function(ev) {
                audioCtx.decodeAudioData(ev.target.result, function(buffer) {
                    that.buffer = buffer; 
                    that.left = new Float32Array(buffer.getChannelData(0))
                    that.right = new Float32Array(buffer.getChannelData(1))
                    that.sampleRate = buffer.sampleRate
                    that.duration = buffer.duration;
                    if(that.onload !== undefined)
                        that.onload()
                });
            }
        
        reader.onerror = (err) => { console.log(err) }
        fetch(filename).then(function(response) {
            return response.blob();
        }).then(function(audioBlob) {
            reader.readAsArrayBuffer(audioBlob);
        });
    }
}

function analyze(buffer, dataComplete){
    const context = new OfflineAudioContext(1, buffer.length, buffer.sampleRate);
    const source = context.createBufferSource();
    const processor = context.createScriptProcessor ? context.createScriptProcessor(0, 1, 1) : context.createJavaScriptNode(0, 1, 1);

    const analyser = context.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.25;

    source.buffer = buffer;

    source.connect(analyser);
    analyser.connect(processor);
    processor.connect(context.destination); // this is necessary for the script processor to start

    var freqData = new Uint8Array(analyser.frequencyBinCount);

    source.start(0);
    context.startRendering();

    context.oncomplete = (e) => {
        dataComplete(e.renderedBuffer.length)
        source.disconnect( analyser );
        processor.disconnect( context.destination );
        console.log("dfgji")
    };
};

function analyzeBeat(buffer, dataComplete){
    var offlineContext = new OfflineAudioContext(1, buffer.length, buffer.sampleRate);
    var source = offlineContext.createBufferSource();
    source.buffer = buffer;

    var filter = offlineContext.createBiquadFilter();
    filter.type = "lowpass";
    source.connect(filter);
    filter.connect(offlineContext.destination);
    source.start(0);

    offlineContext.startRendering()

    // Act on the result
    offlineContext.oncomplete = function(e) {
        var filteredBuffer = e.renderedBuffer;
        let peaks = getPeaksAtThreshold(filteredBuffer.getChannelData(0), 0.95)
        let intervals = countIntervalsBetweenNearbyPeaks(peaks)
        let nb = groupNeighborsByTempo(intervals)
    };
}

function getPeaksAtThreshold(data, threshold) {
    var peaksArray = [];
    var length = data.length;
    for(var i = 0; i < length;) {
      if (data[i] > threshold) {
        peaksArray.push(i);
        // Skip forward ~ 1/4s to get past this peak.
        i += 10000;
      }
      i++;
    }
    return peaksArray;
  }


function countIntervalsBetweenNearbyPeaks(peaks) {
    var intervalCounts = [];
    peaks.forEach(function(peak, index) {
      for(var i = 0; i < 10; i++) {
        var interval = peaks[index + i] - peak;
        var foundInterval = intervalCounts.some(function(intervalCount) {
          if (intervalCount.interval === interval)
            return intervalCount.count++;
        });
        if (!foundInterval) {
          intervalCounts.push({
            interval: interval,
            count: 1
          });
        }
      }
    });
    //let top = intervalCounts.sort((a,b) => {return a.count < b.count ? 1 : -1}).slice(0, 10)
    return intervalCounts;
}

function groupNeighborsByTempo(intervalCounts) {
    var tempoCounts = []
    intervalCounts.forEach(function(intervalCount, i) {
      // Convert an interval to tempo
      
      var theoreticalTempo = 60 / (intervalCount.interval / 48000 );
      // Adjust the tempo to fit within the 90-180 BPM range
        if(theoreticalTempo === theoreticalTempo/0 || isNaN(theoreticalTempo))
            return

        while (theoreticalTempo < 90) theoreticalTempo *= 2;
        while (theoreticalTempo > 180) theoreticalTempo /= 2; 
        
        theoreticalTempo = Math.floor(theoreticalTempo+0.5)
        var foundTempo = tempoCounts.some(function(tempoCount) {
            if (tempoCount.tempo === theoreticalTempo)
                return tempoCount.count += intervalCount.count;
        });
        if (!foundTempo) {
            tempoCounts.push({
            tempo: theoreticalTempo,
            count: intervalCount.count
            });
            }
        });

    tempoCounts.sort((a,b) => {return a.count < b.count ? 1 : -1})
    return tempoCounts.slice(0, 10)
  }
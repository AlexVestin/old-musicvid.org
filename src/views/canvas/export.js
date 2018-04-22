import React, {PureComponent} from 'react'
import VideoEncoder from '../../videoencoder/videoencoderworker'


const presetLookup = [
    "ultrafast",
    "veryfast",
    "fast",
    "medium",
    "slow",
    "veryslow"
  ];
  

export default class ExportModal extends PureComponent {

    constructor(props) {
        super(props)
  
        this.worker = false
  
        this.state = {
          encoderLoaded: false,
          encoding: false
        }
    }

    saveBlob = (vid) => {
        let fps = (this.frames * this.duration) / ((this.stopTime - this.startTime) / 1000)
        this.setState({info: "Saving video!", encoding: false}, () => setTimeout(this.setState({info: "Video encoded at: " + String(fps) + " frames per second"}), 8000 ))
        window.requestAnimationFrame(this.renderScene)
        const blob = new Blob([vid], { type: 'video/mp4' });
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob);
        }else { 
          const link = this.linkRef;
          link.setAttribute('href', URL.createObjectURL(blob));
          link.setAttribute('download', "vid.mp4");
          link.click();
        } 
        this.encodedFrames = 0
        //this.streamClosed = false
        this.setState({encoding: false})
    }

    encode = () => {
        //Video config
        let sp = this.res.split("x")
        let [w,h] = [Number(sp[0]), Number(sp[1])]
        this.frames = Number(this.fps)
        this.duration = Number(this.t.slice(0,-1))
        let br = Number(this.br.slice(0, -1)) * 1000
        let presetIdx = presetLookup.indexOf(this.pre)
  
        this.displayRenderer.setSize(w, h)
        this.setState({width: w, height: h, encoding: true, info: "Initializing encoder"})
        
        //audio config
    
        let sound = this.displayRenderer.sound
        let samplerate = sound.sampleRate
        let channels = sound.channels
        let { left, right } = sound
  
        let videoConfig = { w, h, fps: this.frames, bitrate: br, presetIdx }
        let audioConfig = { left, right, channels, samplerate, bitrate: 320000, duration: this.duration }
        this.videoEncoder.init(videoConfig, audioConfig, this.encoderInit, this.renderScene)
    }

    stopEncoding = ()  => {
        cancelAnimationFrame(this.frameId)
      }

    encoderInit = () => {
        this.setState({ info: "Encoder initialized"})
        this.startTime = performance.now()
    }

    onEncoderLoaded = () => {
        this.setState({encoderLoaded: true, info: "Module loaded"})
    }

    render() {
        return (
            <div className={classes.options_wrapper}>
                <Options onchange={v => this.res = v} name="resolution" labels={["720x480", "1280x720","1920x1080","2048x1080"]}></Options>
                <Options onchange={v => this.fps = v} name="fps" labels={["25", "30", "60"]}></Options>
                <Options onchange={v => this.br = v} name="bitrate" labels={["1000k", "2000k", "4000k", "6000k", "8000k", "12000k"]}></Options>
                <Options onchange={v => this.t = v} name="duration" labels={["15s", "20s", "30s", "60s", "120s", "300s"]}></Options>
                <Options onchange={v => this.pre = v} name="preset" labels={["ultrafast", "veryfast", "fast", "medium", "slow", "veryslow"]}></Options>
                
                <Button 
                onClick={this.encode} 
                variant="raised" 
                color="secondary"
                style={{minHeight: "40px", height:"40px", marginTop: "13px"}}
                disabled={!this.state.encoderLoaded || this.state.encoding || this.streamClosed}
                >
                Encode!
                </Button>
          </div>
        )
    }
} 
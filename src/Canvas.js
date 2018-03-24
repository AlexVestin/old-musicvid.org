
import React, {Component} from 'react'
import Sound from './js/sound'
import VideoEncoder from './videoencoder/videoencoderworker'
import classes from './canvas.css'
import Button from 'material-ui/Button';
import Options from './options'
import ThreeRenderer from './three/three';

const presetLookup = [
  "ultrafast",
  "veryfast",
  "fast",
  "medium",
  "slow",
  "veryslow"
];


export default class Canvas extends Component {
    constructor(props) {
      super(props)

      this.worker = false

      this.state = {
        encoderLoaded: false,
        encoding: false,
        width: 720,
        height: 480,
        info: "Loading module..."
      };

      this.streamClosed = false;
      this.enableAudio = true;
      if(this.enableAudio) {
        this.sound = new Sound("sound.mp3")
        this.sound.onload = this.audioLoaded;
      }

      this.frames = 60
      this.lastTime = 0
    }
  
    componentDidMount() {
      this.encodedFrames = 0;
      this.displayRenderer = new ThreeRenderer(this.mount)
      this.frameId = window.requestAnimationFrame(this.renderScene)
    }
  
    stop = ()  => {
      cancelAnimationFrame(this.frameId)
    }

    encoderInit = () => {
      this.setState({ info: "Encoder initialized"})
      this.startTime = performance.now()
    }

    onEncoderLoaded = () => {
      this.setState({encoderLoaded: true, info: "Module loaded"})
    }
    
    audioLoaded = () => {
      this.videoEncoder = new VideoEncoder(this.onEncoderLoaded)
    }
    
    componentWillUnmount() {
      this.stop()
      this.mount.removeChild(this.renderer.domElement)
    }
  
    encode = () => {
      //Video config
      let sp = this.res.split("x")
      let [w,h] = [Number(sp[0]), Number(sp[1])]
      this.frames = Number(this.fps)
      this.duration = Number(this.t.slice(0,-1))
      let br = Number(this.br.slice(0,-1)) * 1000
      let presetIdx = presetLookup.indexOf(this.pre)

      this.displayRenderer.setSize(w, h)
      this.setState({width: w, height: h, encoding: true, info: "Initializing encoder"})
      
      //audio config
      let sound = this.sound
      let samplerate = sound.sampleRate
      let channels = sound.channels
      let { left, right } = sound

      let videoConfig = { w, h, fps: this.frames, bitrate: br, presetIdx }
      let audioConfig = { left, right, channels, samplerate, bitrate: 320000, duration: this.duration }
      this.videoEncoder.init(videoConfig, audioConfig, this.encoderInit, this.renderScene)
    }

    renderScene = () => {
        const time = this.state.encoding ? this.encodedFrames / this.frames : this.frameId / 60
        //let frequencybins = this.sound.getFrequencyBins(time)
        this.displayRenderer.renderScene(time)
        if(!this.streamClosed) {
          if(this.state.encoding && this.encodedFrames < this.frames * this.duration){
            this.displayRenderer.readPixels()
            this.encodedFrames++

            this.setState({info:"Encoding frame: " + String(this.encodedFrames) + "/" + String(this.frames * this.duration)});

            this.videoEncoder.addFrame(this.displayRenderer.pixels, this.encodedFrames)
          }else if(this.state.encoding) {
            this.stopTime = performance.now()
            this.displayRenderer.setSize(720, 480)
            this.setState({width: 720, height: 480, info: "Encoding audio/preparing video..."})
            this.streamClosed = true
            this.videoEncoder.close(this.saveBlob)
          }
        }

        if(!this.state.encoding || !this.videoEncoder.isWorker)
          this.frameId = window.requestAnimationFrame(this.renderScene)
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
  
    render() {
      return (
        <div className={classes.canvas_wrapper}>
            <b>{this.state.info}</b>
            <div
                style={{ width: String(this.state.width) +'px', height: String(this.state.height) +'px' }}
                ref={(mount) => { this.mount = mount }}
            />
          
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
          
           <a ref={(linkRef) => this.linkRef = linkRef}></a>
        </div>
      )
    }
  }

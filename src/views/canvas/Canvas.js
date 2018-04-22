
import React, {Component} from 'react'
import Sound from '../../sound'
import ThreeCanvas from './three/three';

import classes from './canvas.css'
import PlaybackPanel from './playback'

import { setTime } from '../../redux/actions/globals' 

export default class Canvas extends Component {
    constructor(props) {
      super(props)

      this.state = {
        width: 720,
        height: 480,
        info: "",
        time: 0,
        playing: false
      };

      this.frames = 60
      this.frameId = 0
      this.lastTime = 0
    }
  
    componentDidMount() {
      this.encodedFrames = 0;
      this.displayRenderer = this.ThreeRenderer.getWrappedInstance()
      window.requestAnimationFrame(this.renderScene)

      //this.videoEncoder = new VideoEncoder()
    }
  
    componentWillUnmount() {
      this.stop()
      this.mount.removeChild(this.renderer.domElement)
    }
  
    renderScene = () => {
      if(this.state.playing) {
        const time = this.state.encoding ? this.encodedFrames / this.frames : this.frameId / 60
        this.displayRenderer.renderScene(time)
        this.setState({time: time})       
        
        setTime(time)
        this.frameId++
      }
      if(!this.state.encoding || !this.videoEncoder.isWorker)
          window.requestAnimationFrame(this.renderScene)
    }
    
    
    stop = () => {
      this.setState({playing: false, time: 0})
      this.frameId = 0
      this.displayRenderer.stop()
    }

    play = () => {
      this.setState({playing: !this.state.playing})
      this.displayRenderer.play(this.state.time)
    }
  
    render() {
      const {width, playing, time } = this.state

      return (
        <div className={classes.canvas_wrapper}>
            <b>{this.state.info}</b>
            <ThreeCanvas ref={ref => this.ThreeRenderer= ref } width={this.state.width} height={this.state.height}></ThreeCanvas>
            <PlaybackPanel width={width} playing={playing} time={time} play={this.play} stop={this.stop} ></PlaybackPanel>
            <a ref={(linkRef) => this.linkRef = linkRef}></a>
        </div>
      )
    }
  }

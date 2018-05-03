
import React, {Component} from 'react'
import ThreeCanvas from './three/three';

import classes from './canvas.css'
import PlaybackPanel from './playback'

import { setTime, togglePlaying, setPlaying, incrementTime } from '../../redux/actions/globals' 
import { connect } from 'react-redux';

class Canvas extends Component {
    constructor(props) {
      super(props)

      this.state = {
        width: 720,
        height: 480,
        info: "",
      };

      this.frames = 60
      this.frameId = 0
      this.lastTime = 0
      this.time = 0
    }
  
    componentDidMount() {
      this.encodedFrames = 0;
      this.displayRenderer = this.ThreeRenderer.getWrappedInstance()
      window.requestAnimationFrame(this.renderScene)
    }
  
    componentWillUnmount() {
      this.stop()
      this.mount.removeChild(this.renderer.domElement)
    }
  
    renderScene = () => {
      var time = this.props.time
      if(this.props.playing) {
        //const time = frameId / fps
        if(this.props.playing) {
          let now = performance.now()
          time = (now - this.lastTime) / 1000 + this.props.time
        
          incrementTime(time)
          this.lastTime = now
        }
      }
      
      this.displayRenderer.renderScene(time)
      if(!this.state.encoding || !this.videoEncoder.isWorker)
          window.requestAnimationFrame(this.renderScene)
    }
    
    stop = () => {
      this.frameId = 0
      this.displayRenderer.stop()
      setPlaying(false)
      setTime(0)
    }

    play = () => {
      this.lastTime = performance.now()
      togglePlaying()
      this.displayRenderer.play(this.props.time)
    }
  
    render() {
      const {width} = this.state
      const { playing, time } = this.props

      return (
        <div className={classes.canvas_wrapper}>
        	 <div className={classes.center_canvas}>
              <b>{this.state.info}</b>
              <ThreeCanvas ref={ref => this.ThreeRenderer= ref } width={this.state.width} height={this.state.height}></ThreeCanvas>
              <PlaybackPanel disabled={this.props.disabled} width={width} playing={playing} time={time} play={this.play} stop={this.stop} ></PlaybackPanel>
              <a aria-label="download ref" ref={(linkRef) => this.linkRef = linkRef}></a>
            </div>
        </div>
      )
    }
  }

const mapStateToProps = state => {
  return {
    time: state.globals.time,
    playing: state.globals.playing,
    frameId: state.globals.frameId,
    fps: state.globals.fps,
    disabled: state.globals.disabled
  }
}


export default connect(mapStateToProps)(Canvas)
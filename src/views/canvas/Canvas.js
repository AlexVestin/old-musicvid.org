
import React, {Component} from 'react'
import Sound from '../../sound'
import ThreeCanvas from './three/three';

import classes from './canvas.css'
import PlaybackPanel from './playback'

import { setTime, togglePlaying, setPlaying, incrementFrame } from '../../redux/actions/globals' 
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
      const {fps, frameId} = this.props
      if(this.props.playing) {

        const time = frameId / fps
        this.displayRenderer.renderScene(time)
                
        setTime(time)
        incrementFrame()
      }
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
      togglePlaying()
      this.displayRenderer.play(this.props.time)
    }
  
    render() {
      const {width} = this.state
      const { playing, time } = this.props

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

const mapStateToProps = state => {
  return {
    time: state.globals.time,
    playing: state.globals.playing,
    frameId: state.globals.frameId,
    fps: state.globals.fps
  }
}


export default connect(mapStateToProps)(Canvas)

import React, { Component } from 'react'
import ThreeCanvas from './scenemanager';

import classes from './canvas.css'
import PlaybackPanel from './playback'
import ExportModal from './export'

import { setTime, togglePlaying, setPlaying, incrementTime, setDisabled } from '@redux/actions/globals' 
import { connect } from 'react-redux';

class Canvas extends Component {
    constructor(props) {
      super(props)

      this.state = {
        width: 720,
        height: 480,
        info: "",
        modalOpen: false
      };

      this.frames = 60
      this.frameId = 0
      this.lastTime = 0
      this.time = 0
    }
  
    componentDidMount() {
      this.encodedFrames = 0;
      this.displayRenderer = this.ThreeRenderer
      window.requestAnimationFrame(this.renderScene)

      window.onkeyup = (e) => {
        var key = e.keyCode ? e.keyCode : e.which;
        switch(key) {

          case 83:
            this.stop()
            break;

          //SPACE
          case 32:
            this.play()
            break
          
            // .
          case 190:
            if(!this.props.playing)
              this.incrementFrame()
            break;
          
          // ,
          case 188:
            if(!this.props.playing)  
              this.decrementFrame()
            break

          default:
        }
     }
    }
  
    componentWillUnmount() {
      this.stop()
    }
  
    renderScene = () => {
      var time = this.props.time
      if(!this.props.encoding) {
        if(this.props.playing ) {
          //const time = frameId / fps
          if(this.props.playing) {
            let now = performance.now()
            time = (now - this.lastTime) / 1000 + this.props.time
          
            incrementTime(time)
            this.lastTime = now
          }
        }
        
        this.displayRenderer.renderScene(time)
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
      this.lastTime = performance.now()
      this.displayRenderer.play(this.props.time, !this.props.playing)
      togglePlaying()
      
    }

    incrementFrame = () => {
      var time = this.props.time + (1 / this.displayRenderer.fps)
      this.displayRenderer.renderScene(time, true)
      incrementTime(time)
    }

    decrementFrame = () => {
      var time = this.props.time - (1 / this.displayRenderer.fps)
      time = time > 0 ? time : 0
      this.displayRenderer.renderScene(time, true)
      incrementTime(time)
    }

    openEncodeModal = () => {
      this.setState({modalOpen: true})
    }

    startEncoding = (config, useAudioDuration) => {
      this.stop()
      setDisabled(true)
      this.setState({modalOpen: false})
      this.displayRenderer.initEncoder(config, useAudioDuration)
    }
  
    render() {
      const {width} = this.state
      const { playing, time } = this.props

      return (
        <div className={classes.canvas_wrapper}>
          {this.state.modalOpen && <ExportModal open={this.state.modalOpen} startEncoding={this.startEncoding} onCancel={() => this.setState({modalOpen: false})}></ExportModal>}
        	 <div className={classes.center_canvas}>
              <b>{this.state.info}</b>
              <ThreeCanvas ref={ref => this.ThreeRenderer= ref } width={this.state.width} height={this.state.height}></ThreeCanvas>
              <PlaybackPanel 
                  encodeDisabled={this.props.audioInfo === null} 
                  width={width} playing={playing} 
                  time={time} play={this.play} 
                  stop={this.stop} 
                  encode={this.openEncodeModal}
              >
              </PlaybackPanel>
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
    disabled: state.globals.disabled,
    encoding: state.globals.encoding,
    audioInfo: state.items.audioInfo
  }
}


export default connect(mapStateToProps)(Canvas)
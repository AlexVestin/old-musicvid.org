
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
        width: 640,
        height: 480,
        info: "",
        modalOpen: false
      };

      this.frames = 60
      this.frameId = 0
      this.lastTime = 0
      this.time = 0
    }

    setSize = (width, aspect) => {
      if(this.state.width === width) return
      this.setState({width: width, height: (width * aspect) >> 0})
      this.displayRenderer.setSize(width, (width * aspect) >> 0)
    }

    resizeCanvas = (height) => {
      const heightInPx =  (90 - height) * window.innerHeight / 100

      if(heightInPx < 300) {
        this.setSize(260, 3/4)
      } else if(heightInPx < 420) {
        this.setSize(400, 3/4)
      }
      else if(heightInPx < 530) {
        this.setSize(510, 3/4)
      }else if(heightInPx < 600) {
        this.setSize(610, 3/4)
      }else {
        this.setSize(680, 3/4)
      } 
    }
  
    componentDidMount() {
      this.encodedFrames = 0;
      this.displayRenderer = this.ThreeRenderer
      window.requestAnimationFrame(this.renderScene)

      window.onkeyup = this.handleKeys
      window.addEventListener('resize', () => this.resizeCanvas(this.props.playlistHeight), false);
      this.resizeCanvas(this.props.playlistHeight)
    }

    handleKeys = (e) => {
      var key = e.keyCode ? e.keyCode : e.which;
      console.log(key)
      switch(key) {
        // Escape
        case 27:
          console.log("escape")
          break;

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
    componentWillUnmount() {
      this.stop()
    }

    shouldComponentUpdate = (props, state) => {
      return state.width !== this.state.width || state.height !== this.state.height || state.modalOpen !== this.state.modalOpen
    }
  
    renderScene = () => {
      let time = this.props.time
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

    componentWillReceiveProps = (props) => {
      if(props.playlistHeight !== this.props.playlistHeight) {
        this.resizeCanvas(props.playlistHeight)
      }
    }

    setFullScreen = () => {
        this.savedWidth = this.state.width
        this.savedHeight = this.state.height

    }
  
    render() {
      const {width, height, modalOpen} = this.state
      const { playing } = this.props
      return (
        <div className={classes.canvas_wrapper} >
          {modalOpen && <ExportModal open={modalOpen} startEncoding={this.startEncoding} onCancel={() => this.setState({modalOpen: false})}></ExportModal>}
        	 <div >
              <ThreeCanvas ref={ref => this.ThreeRenderer= ref } width={width} height={height}></ThreeCanvas>
              <PlaybackPanel 
                  width={width} 
                  playing={playing}    
                  play={this.play} 
                  stop={this.stop}   
                  openEncodingModal={this.openEncodeModal}
                  openFullScreen={this.setFullScreen}
              >
              </PlaybackPanel>
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
    audioInfo: state.items.audioInfo,
    playlistHeight: state.window.playlistHeight
  }
}


export default connect(mapStateToProps)(Canvas)
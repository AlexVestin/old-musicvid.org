
import React, { Component } from 'react'
import ThreeCanvas from './graphics/scenemanager';

import classes from './canvas.css'
import PlaybackPanel from './canvas-ui/playback'
import ExportModal from './canvas-ui/export'
import LinkFilesModal from './canvas-ui/linkfilesmodal'

import { dispatchAction } from '@redux/actions/items' 
import { setTime, togglePlaying, setPlaying, incrementTime, setDisabled } from '@redux/actions/globals' 
import { connect } from 'react-redux';

class Canvas extends Component {
    constructor(props) {
      super(props)

      this.state = {
        width: 640,
        height: 480,
        info: "",
        linkFiles: [],
        openLinkFilesModal: false
      };

      this.frames = 60
      this.frameId = 0
      this.lastTime = 0
      this.time = 0
    }

    setSize = (width, aspect) => {
      if(this.state.width === width) return
      this.setState({width: width, height: (width * aspect) >> 0})
      this.sceneManager.setSize(width, (width * aspect) >> 0)
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
      this.sceneManager = this.ThreeRenderer
      window.requestAnimationFrame(this.renderScene)

      window.onkeyup = this.handleKeys
      window.addEventListener('resize', () => this.resizeCanvas(this.props.playlistHeight), false);
      this.resizeCanvas(this.props.playlistHeight)
    }

    handleKeys = (e) => {
      var key = e.keyCode ? e.keyCode : e.which;
      switch(key) {
        // Escape
        case 27:
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
      let shouldUpdate = state.width !== this.state.width || state.height !== this.state.height || this.state.openLinkFilesModal !== state.openLinkFilesModal
      shouldUpdate = shouldUpdate || props.exportVideo !== this.props.exportVideo || props.playing !== this.props.playing
      return  shouldUpdate
    }

    linkFiles = (files) => {
      this.setState({linkFiles: files, openLinkFilesModal: true})
    }
  
    renderScene = () => {
      let time = this.props.time
      if(!this.props.encoding) {
        if(this.props.playing ) {
          //const time = frameId / fps
          if(this.props.playing) {
            let now = performance.now()
            time = (now - this.lastTime) / 1000 + this.props.time
          
            
            incrementTime(time);
            //incrementTime(time)
            this.lastTime = now
          }
        }
        
        this.sceneManager.renderScene(time)
      }
      if(!this.state.encoding || !this.videoEncoder.isWorker)
          window.requestAnimationFrame(this.renderScene)
    }

    
    stop = () => {
      this.frameId = 0
      this.sceneManager.stop()
      setPlaying(false)
      setTime(0)
    }

    play = () => {
      this.lastTime = performance.now()
      this.sceneManager.play(this.props.time, !this.props.playing)
      togglePlaying()
    }

    incrementFrame = () => {
      var time = this.props.time + (1 / this.sceneManager.fps)
      this.sceneManager.renderScene(time, true)
      incrementTime(time)
    }

    decrementFrame = () => {
      var time = this.props.time - (1 / this.sceneManager.fps)
      time = time > 0 ? time : 0
      this.sceneManager.renderScene(time, true)
      incrementTime(time)
    }

    startEncoding = (config, useAudioDuration) => {
      this.stop()
      setDisabled(true)
      dispatchAction({type:"SET_EXPORT", payload: false})
      this.sceneManager.initEncoder(config, useAudioDuration)
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
      const {width, height, openLinkFilesModal, linkFiles } = this.state
      const { playing, exportVideo } = this.props

      return (
        <div className={classes.canvas_wrapper} >
         <ExportModal open={exportVideo} startEncoding={this.startEncoding} onCancel={() => dispatchAction({type:"SET_EXPORT", payload: false})}></ExportModal>
          <LinkFilesModal onCancel={() => this.setState({openLinkFilesModal: false})} files={linkFiles} open={openLinkFilesModal}></LinkFilesModal>
        	 <div >
              <ThreeCanvas 
                ref={ref => this.ThreeRenderer= ref } 
                width={width} 
                height={height} 
                loadFromFile={this.props.loadFromFile}
                linkFiles={this.linkFiles}
                >
              </ThreeCanvas>
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
    playlistHeight: state.window.playlistHeight,
    loadFromFile: state.items.loadFromFile,
    exportVideo: state.globals.exportVideo
  }
}


export default connect(mapStateToProps)(Canvas)
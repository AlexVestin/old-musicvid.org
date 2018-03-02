
import React, {Component} from 'react'
import * as THREE from 'three'
import Sound from './js/sound'
import VideoEncoder from './videoencoder/videoencoder'

export default class Canvas extends Component {
    constructor(props) {
      super(props)

      this.closeStream = false;
      this.streamClosed = false;
      
      this.width = 1080;
      this.height = 720;
      this.fps = 30;
      this.bitrate = 12000000;
      
      this.frameIdx = 0;

      this.enableAudio = true;

      this.start = this.start.bind(this)
      this.stop = this.stop.bind(this)
      this.animate = this.animate.bind(this)

      
      if(this.enableAudio) {
        this.sound = new Sound("sound.wav")
        this.sound.onload = this.audioLoaded
      }
    }
  
    componentDidMount() {
      const width = this.mount.clientWidth
      const height = this.mount.clientHeight
  
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(
        75,
        width / height,
        0.1,
        1000
      )
      const renderer = new THREE.WebGLRenderer({antialias:true})
      const geometry = new THREE.BoxGeometry(1, 1, 1)
      const material = new THREE.MeshBasicMaterial({ color: 0xff00ff })
      const cube = new THREE.Mesh(geometry, material)
  
      camera.position.z = 4
      cube.position.x -= 2;

      scene.add(cube)
      renderer.setClearColor('#00FF00')
      renderer.setSize(width, height)
  
      this.scene = scene
      this.camera = camera
      this.renderer = renderer
      this.material = material
      this.cube = cube
      this.mount.appendChild(this.renderer.domElement)
      this.mount.onclick = () =>this.closeStream=true;

      this.start()

      this.gl = renderer.getContext();
      this.renderTarget = new THREE.WebGLRenderTarget(this.width,this.height);    

      this.encodedFrames = 0;
      this.eloaded = false
    }

    encoderLoaded = () => {
        this.videoEncoder.openVideo( { w:this.width, h: this.height, fps: this.fps, bitrate: this.bitrate } )
        this.videoEncoder.openAudio( { sound: this.sound, bitrate: 320000 } )
        this.videoEncoder.writeHeader()
        this.eloaded = true;
    }
    
    audioLoaded = () => {
      this.videoEncoder = new VideoEncoder(this.encoderLoaded)
    }
    
    componentWillUnmount() {
      this.stop()
      this.mount.removeChild(this.renderer.domElement)
    }
  
    start() {
      if (!this.frameId) {
        this.frameId = requestAnimationFrame(this.animate)
      }
    }
  
    stop() {
      cancelAnimationFrame(this.frameId)
    }
  
    animate() {
      this.cube.rotation.x += 0.01
      this.cube.rotation.y += 0.01
  
      this.renderScene()
      this.frameId = window.requestAnimationFrame(this.animate)
    }
    
    renderScene() {
        const gl = this.renderer.getContext();
        let pixels  = new Uint8Array( this.height * this.width * 4 )
        this.renderer.render(this.scene, this.camera)
        gl.readPixels(0,0,this.width,this.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)

        if(this.eloaded && this.encodedFrames < 400){
          this.videoEncoder.encode(pixels)
          this.encodedFrames++;
        }else if(this.eloaded) {
          let blob = this.videoEncoder.close()
          this.saveBlob(blob)
        }
        
    }

    saveBlob = (blob) => {
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob);
          }else { 
            const link = this.linkRef;
            link.setAttribute('href', URL.createObjectURL(blob));
            link.setAttribute('download', "vid.mp4");
            link.click();
        } 
    }
  
    render() {
      return (
        <div className="canvas-wrapper">
            <div
                style={{ width: String(this.width) +'px', height: String(this.height) +'px' }}
                ref={(mount) => { this.mount = mount }}
            />
            <a ref={(linkRef) => this.linkRef = linkRef}>Download</a>
        </div>
      )
    }
  }

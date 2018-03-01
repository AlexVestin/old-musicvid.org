
import React, {Component} from 'react'
import * as THREE from 'three'
import Sound from './js/sound'
//import initModule from './webassembly/encode'

export default class Canvas extends Component {
    constructor(props) {
      super(props)

      this.closeStream = false;
      this.streamClosed = false;
      
      this.width = 1080;
      this.height = 720;
      
      this.frameIdx = 0;

      this.start = this.start.bind(this)
      this.stop = this.stop.bind(this)
      this.animate = this.animate.bind(this)
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
      const renderer = new THREE.WebGLRenderer()
      const geometry = new THREE.BoxGeometry(1, 1, 1)
      const material = new THREE.MeshBasicMaterial({ color: 0xff00ff })
      const cube = new THREE.Mesh(geometry, material)
  
      camera.position.z = 4
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

      window.Module["onRuntimeInitialized"] = () => {
          
          window.Module._open_video(this.width, this.height, 30, 1200000)
          //this.openAudio()
          window.Module._write_header();
          this.moduleLoaded = true;
        };

      this.gl = renderer.getContext();
      this.renderTarget = new THREE.WebGLRenderTarget(this.width,this.height);    

      this.encodedFrames = 0;
      //this.sound = new Sound("sound.wav", this.linkRef)
    }

    openAudio = () => {
      const { left, right, sampleRate } = this.sound; 
      const { Module } = window;

      console.log(this.sound)
      try {
        var left_p = Module._malloc(left.length * 4)
        Module.HEAPF32.set(left, left_p >> 2)
        
        var right_p = Module._malloc(right.length * 4)
        Module.HEAPF32.set(right, right_p >> 2)

        Module._open_audio(left, right, left.length, sampleRate, 2, 320000)
      }finally {
        this.left_p  = left_p;
        this.right_p  = right_p;   
        console.log("audio added")
      }
    }

    close_stream = () => {
        const { Module } = window;
        var video_p, size;
        try {
          size = Module._close_stream();
          video_p = Module._get_buffer();
          var buf = Buffer.from(Module.buffer, video_p, size)
          return Buffer.from(buf)
        }finally {
          Module._free(video_p)
        }
    }

    encode(buffer){
      if(this.encodedFrames === 0)
        this.startTime = performance.now()
      
      const Module = window.Module
      try {
        var encodedBuffer_p = Module._malloc(buffer.length)
        Module.HEAPU8.set(buffer, encodedBuffer_p)
        Module._add_frame(encodedBuffer_p)
      }finally {
        Module._free(encodedBuffer_p)
        this.encodedFrames++;
      }
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

        if( this.moduleLoaded && this.frameId < 600 ){
          this.encode(pixels)
        }else if ( this.moduleLoaded && !this.streamClosed){
            console.log("frames encoded: ", this.encodedFrames, " seconds taken: ", (performance.now() -this.startTime) / 1000)
            console.log("encoding audio...")
            //window.Module._write_audio_frame()
            console.log("closing streams")
            this.streamClosed = true;
            let vid = this.close_stream()
            const blob = new Blob([vid], { type: 'video/mp4' });
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
              window.navigator.msSaveOrOpenBlob(blob);
            }else { // Others
              const link = this.linkRef;
              link.setAttribute('href', URL.createObjectURL(blob));
              link.setAttribute('download', "vid.mp4");
              link.click();
          } 
            window.Module._free_buffer();
            window.Module._free(this.right_p)
            window.Module._free(this.left_p)
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

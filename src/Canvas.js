
import React, {Component} from 'react'
import * as THREE from 'three'
//import initModule from './webassembly/encode'

export default class Canvas extends Component {
    constructor(props) {
      super(props)

      this.closeStream = false;
      this.streamClosed = false;
      

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
      const renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true  })
      const geometry = new THREE.BoxGeometry(1, 1, 1)
      const material = new THREE.MeshBasicMaterial({ color: 0xff00ff })
      const cube = new THREE.Mesh(geometry, material)
  
      camera.position.z = 4
      scene.add(cube)
      renderer.setClearColor('#000000')
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
          window.Module._open_stream(400, 400, 20, 400000)
          this.moduleLoaded = true;
        };

      this.gl = renderer.getContext();
      this.renderTarget = new THREE.WebGLRenderTarget(400,400);    
    }

    close_stream = () => {
        const { Module } = window;
        var video_p, size, size2;
        try {
          video_p = Module._malloc(4)
          size = Module._close_stream(video_p, size2)
          var buf = Buffer.from(Module.buffer, video_p, size)
          return Buffer.from(buf)
        }finally {
          Module._free(video_p)
        }
    }

    async encode(buffer){
      const Module = window.Module
      try {
        var encodedBuffer_p = Module._malloc(buffer.length)
        Module.HEAPU8.set(buffer, encodedBuffer_p)
        Module._add_frame(encodedBuffer_p)
      }finally {
        Module._free(encodedBuffer_p)
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

    
    async renderScene() {
        const { gl } = this;
        let pixels  = new Uint8Array( 400 * 400 * 4 )
        //this.renderer.render(this.scene, this.camera)
        gl.readPixels(0,0,400,400, gl.RGBA, gl.UNSIGNED_BYTE, pixels)

        if(this.moduleLoaded && !this.closeStream && this.frameId < 500){
          console.log(this.frameId)
          await this.encode(pixels)
          console.log(this.frameId)

        }else if (this.closeStream && !this.streamClosed){
            this.streamClosed = true;
            let vid = this.close_stream()
            const blob = new Blob([vid], { type: 'video/mp4' });
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
              window.navigator.msSaveOrOpenBlob(blob);
              return;
            }else { // Others
              const link = this.linkRef;
              link.setAttribute('href', URL.createObjectURL(blob));
              link.setAttribute('download', "vid.mp4");
              link.click();
          } 
            window.Module._free_buffer();
        }
    }
  
    render() {
      return (
        <div className="canvas-wrapper">
            <div
                style={{ width: '400px', height: '400px' }}
                ref={(mount) => { this.mount = mount }}
            />
            <a ref={(linkRef) => this.linkRef = linkRef}>Download</a>
        </div>
      )
    }
  }

function fetchAndInstantiate(url, importObject) {

}

import React, {Component} from 'react'
import * as THREE from 'three'
//import initModule from './webassembly/encode'

export default class Canvas extends Component {
    constructor(props) {
      super(props)
  
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
      this.start()

  
      window.Module["onRuntimeInitialized"] = () => {
          this.moduleLoaded = true;
          window.Module._init(400, 400, 4, 500000, 60, "f");
          console.log(window.Module)
        };
      /*
      initModule( (Module) => {
        this.Module = Module;
        this.moduleLoaded = true;
      })  
      */
      this.gl = renderer.getContext();
      this.renderTarget = new THREE.WebGLRenderTarget(400,400);    
    }

     encode = (buffer) =>{
        console.log("encoding")
        const Module = window.Module
        var encodedBuffer_p, decodedBuffer_p;
        try{
            encodedBuffer_p = Module._malloc(buffer.length)
            decodedBuffer_p = Module._malloc(buffer.length)
    
            Module.HEAPU8.set(buffer, encodedBuffer_p)
            Module._invertColor(encodedBuffer_p, 400, 400, 4, decodedBuffer_p)
            var buf = Buffer.from(Module.buffer, decodedBuffer_p, buffer.length)
            return Buffer.from(buf);
        }finally {
            Module._free(decodedBuffer_p)
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

    
    renderScene() {
        const {gl } = this;
        let pixels  = new Uint8Array( 400 * 400 * 4)
        this.renderer.render(this.scene, this.camera)
        gl.readPixels(0,0,400,400, gl.RGBA, gl.UNSIGNED_BYTE, pixels)

        if(this.moduleLoaded){
          this.encode(pixels)
        }
    }
  
    render() {
      return (
        <div className="canvas-wrapper">
            <div
                style={{ width: '400px', height: '400px' }}
                ref={(mount) => { this.mount = mount }}
            />
        </div>
      )
    }
  }

function fetchAndInstantiate(url, importObject) {

}
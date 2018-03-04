import * as THREE from 'three'


export default class ThreeRenderer {

    constructor(mount) {

        const width = mount.clientWidth
        const height = mount.clientHeight
    
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
        cube.position.y -= 2;
        
        scene.add(cube)
        renderer.setClearColor('#00FF00')
        renderer.setSize(width, height)
    
        this.scene = scene
        this.camera = camera
        this.renderer = renderer
        this.material = material
        this.cube = cube
        mount.appendChild(this.renderer.domElement)
    
        this.gl = renderer.getContext();
        this.renderTarget = new THREE.WebGLRenderTarget(this.width,this.height);    
    }

    setSize(w, h) {
        this.height = h
        this.width = w
        this.renderer.setSize(w, h)
    }

    readPixels() {
        const gl = this.renderer.getContext();
        let pixels  = new Uint8Array( this.height * this.width * 4 )
        gl.readPixels(0,0,this.width,this.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
        return pixels
    }


    renderScene() {
        this.cube.rotation.x += 0.01
        this.cube.rotation.y += 0.01
        this.renderer.render(this.scene, this.camera)
    }
}
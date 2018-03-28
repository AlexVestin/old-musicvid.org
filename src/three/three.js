import {WebGLRenderTarget, WebGLRenderer} from 'three'

import OceanScene from './scenes/ocean/scene'
import Iris from './scenes/viss/scene'
import BarsScene from './scenes/bars/scene'


export default class ThreeRenderer {

    constructor(mount) {

        this.width = mount.clientWidth
        this.height = mount.clientHeight
        const renderer = new WebGLRenderer({antialias:true})
        renderer.setClearColor('#000000')
        renderer.setSize(this.width, this.height)
        this.renderer = renderer

        this.currentScene = new BarsScene(this.width, this.height, renderer)
        //this.currentScene = new OceanScene(this.width, this.height, renderer)
        //this.currentScene = new Iris(this.width, this.height, renderer)

        mount.appendChild(this.renderer.domElement)
        this.gl = this.renderer.getContext();
        this.renderTarget = new WebGLRenderTarget(this.width,this.height); 
    }   

    setSize(w, h) {
        this.height = h
        this.width = w
        this.renderer.setSize(w, h)        
    }

    readPixels() {
        const gl = this.renderer.getContext();
        this.pixels = new Uint8Array(this.width*this.height*4)
        gl.readPixels(0,0,this.width,this.height, gl.RGBA, gl.UNSIGNED_BYTE, this.pixels)
    }

    renderScene(time, frequencyBins) { 
        this.currentScene.animate(time, frequencyBins)
        const {scene, camera} = this.currentScene
        this.renderer.render(scene, camera)
    }
}
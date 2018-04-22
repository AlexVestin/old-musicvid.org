import {WebGLRenderTarget, WebGLRenderer} from 'three'

import BarsScene from './scene'
import React, { PureComponent } from 'react';
import { connect } from 'react-redux'

import { addItem } from '../../../redux/actions/items'
import Sound from "../../../sound"


class ThreeCanvas extends PureComponent {
    componentDidMount() {
        
        const mount = this.mountRef
        //const mount = this.mountRef
        this.width = mount.clientWidth
        this.height = mount.clientHeight
        const renderer = new WebGLRenderer({antialias:true})
        renderer.setClearColor('#000000')
        renderer.setSize(this.width, this.height)
        renderer.autoClear = false;

        this.renderer = renderer

        this.currentScene = new BarsScene(this.width, this.height, renderer)

        mount.appendChild(this.renderer.domElement)
        this.gl = this.renderer.getContext();
        this.renderTarget = new WebGLRenderTarget(this.width,this.height); 

        this.audioLoaded = false
        this.mount = mount 
    } 

    setSize(w, h) {
        this.height = h
        this.width = w
        this.renderer.setSize(w, h)        
    }

    componentWillReceiveProps(props) {
        switch(props.lastAction) {
            case "EDIT_SELECTED_ITEM":
                this.currentScene.updateConfig(props.selectedItem);
                break
            case "CREATE_ITEM":
                if(props.selectedItem.type === "SOUND") {
                    this.sound = new Sound(props.selectedItem, () => { this.audioLoaded = true;  addItem(this.sound.defaultConfig) })
                }else {
                    let name = props.selectedItem.type
                    while(this.props.items.find(e => e.name.value === name)){
                        name += "1"
                    }
                    this.currentScene.add(name, props.selectedItem)
                }    
                break; 
            default:
                console.log("IN ->>>>> canvas/three.js:  unknown item added")
        }
    }

    stop = () => {
        this.currentScene.stop()
        if(this.audioLoaded)
            this.sound.stop()
    }

    play = (time) => {
        const {fps, frameId} = this.props
        this.currentScene.play(time)
        
        if(this.audioLoaded)
            this.sound.play(time, fps)
    }

    readPixels() {
        const gl = this.renderer.getContext();
        this.pixels = new Uint8Array(this.width*this.height*4)
        gl.readPixels(0,0,this.width,this.height, gl.RGBA, gl.UNSIGNED_BYTE, this.pixels)
    }

    renderScene(time) { 
        
        var frequencyBins = []
        if(this.audioLoaded) {
            frequencyBins = this.sound.getFrequencyBins(time)               
        }
        
        this.currentScene.animate(time, frequencyBins)
        this.currentScene.render(this.renderer)
    }

    render() {
        return(
            <div
                ref={ref => this.mountRef = ref } 
                style={{ width: String(this.props.width) +'px',  height: String(this.props.height) +'px'}}                
            />
            
        )
    }
}

const mapStateToProps = state => {
    return {
        items: state.items.items,
        selectedItem: state.items.selectedItem,
        lastAction: state.items.lastAction,
        imagePath: state.items.imagePath,
        fps: state.globals.fps,
        frameId: state.globals.fps
    }
}

export default connect(mapStateToProps, null, null,  { withRef: true })(ThreeCanvas)
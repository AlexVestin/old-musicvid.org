import {WebGLRenderTarget, WebGLRenderer} from 'three'

import BarsScene from './scene'
import React, { Component } from 'react';
import { connect } from 'react-redux'

import { addItem } from '../../../redux/actions/items'
import Sound from "./items/sound"

import store from '../../../redux/store'

class ThreeCanvas extends Component {
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

    componentWillUnmount(){
        this.unsubscribe()
    }

    setSize(w, h) {
        this.height = h
        this.width = w
        this.renderer.setSize(w, h)        
    }

    shouldComponentUpdate() {
        return false;
    }

    componentWillReceiveProps(props) {
        switch(store.getState().lastAction.type) {
            case "REMOVE_ITEM":
                this.currentScene.removeItem(props.selectedItem)
                break;
            case "EDIT_SELECTED_ITEM":
                this.currentScene.updateConfig(props.selectedItem);
                break
            case "SET_TIME":
                this.currentScene.setTime(props.time, props.playing)
                break;
            case "CREATE_ITEM":
                if(props.selectedItem.type === "SOUND") {
                    this.sound = new Sound(props.selectedItem, () => { this.audioLoaded = true; })
                }else {
                    let name = props.selectedItem.type
                    this.currentScene.add(name, props.selectedItem)
                }    
                break; 
            default:
        }
    }

    stop = () => {
        this.currentScene.stop()
        if(this.audioLoaded)
            this.sound.stop()
    }

    play = (time) => {
        const {fps } = this.props
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
        frameId: state.globals.frameId,
        time: state.globals.time,
        playing: state.globals.playing
    }
}

export default connect(mapStateToProps, null, null,  { withRef: true })(ThreeCanvas)
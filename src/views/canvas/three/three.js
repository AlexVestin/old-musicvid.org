import {WebGLRenderTarget, WebGLRenderer} from 'three'

import OceanScene from './scenes/ocean/scene'
import Iris from './scenes/viss/scene'
import BarsScene from './scenes/bars/scene'
import React, { PureComponent } from 'react';
import { connect } from 'react-redux'

import Sound from "../../../sound"


class ThreeCanvas extends PureComponent {
    componentDidMount() {
        const mount = this.mountRef
        this.width = mount.clientWidth
        this.height = mount.clientHeight
        const renderer = new WebGLRenderer({antialias:true})
        renderer.setClearColor('#000000')
        renderer.setSize(this.width, this.height)
        renderer.autoClear = false;

        this.renderer = renderer

        this.currentScene = new BarsScene(this.width, this.height, renderer)
        //this.currentScene = new OceanScene(this.width, this.height, renderer)
        //this.currentScene = new Iris(this.width, this.height, renderer)

        mount.appendChild(this.renderer.domElement)
        this.gl = this.renderer.getContext();
        this.renderTarget = new WebGLRenderTarget(this.width,this.height); 

        this.audioLoaded = false
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
            case "APPEND_ITEM":
                this.currentScene.addItem(props.selectedItem)
                break;
            case "ADD_IMAGE":
                this.currentScene.addBackgroundImage(props.selectedItem)
                break
            case "ADD_SOUND":
                this.sound = new Sound(props.selectedItem, () => this.audioLoaded = true)
                break;
            case "ADD_TEXT3D":
                this.currentScene.addItem(props.selectedItem)
                break;
            default:
                console.log("IN ->>>>> canvas/three.js:  unknown item added")
        }

    }

    readPixels() {
        const gl = this.renderer.getContext();
        this.pixels = new Uint8Array(this.width*this.height*4)
        gl.readPixels(0,0,this.width,this.height, gl.RGBA, gl.UNSIGNED_BYTE, this.pixels)
    }

    renderScene(time) { 
        var frequencyBins = []
        if(this.audioLoaded)
            frequencyBins = this.sound.getFrequencyBins(time)
        
        this.currentScene.animate(time, frequencyBins)
        this.currentScene.render(this.renderer)
    }

    render() {
        return(
            <div
                style={{ width: String(this.props.width) +'px', height: String(this.props.height) +'px' }}
                ref={(mount) => { this.mountRef = mount }}
            />
        )
    }
}

const mapStateToProps = state => {
    return {
        items: state.items,
        selectedItem: state.selectedItem,
        lastAction: state.lastAction,
        imagePath: state.imagePath
    }
}

export default connect(mapStateToProps, null, null,  { withRef: true })(ThreeCanvas)
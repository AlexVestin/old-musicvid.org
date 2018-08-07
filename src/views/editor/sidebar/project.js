import React, {PureComponent} from 'react'

import { setFps, setClipDuration, setAudioBufferSize } from '@redux/actions/globals'
import {  setPostProcessingEnabled } from '@redux/actions/items'

import { connect } from 'react-redux'
import Checkbox from 'material-ui/Checkbox'


const listItemStyle = {
    height: 30, 
    borderBottom: "1px solid gray", 
    margin: 20, width: "calc(90% - 30px)", 
    display: "flex", 
    flexDirection: "row", 
    justifyContent: "space-between"

}

class ProjectSettings extends PureComponent {

    togglePostProcessingEnabled = () => {
        //setPostProcessingEnabled(!this.props.postProcessingEnabled)
    }

    render() {
        const { fps, clipDuration, postProcessingEnabled, audioBufferSize } = this.props

        return(
            <div style={{ width: "100%", height: "100%" , margin: 10, fontSize: 14}}>
                Configurarion
                <Input disabled onChange={(e) => setFps(e.target.value)}  value={fps} type="number" label="FPS"></Input>
                <Input onChange={(e) => setClipDuration(e.target.value)} value={clipDuration} type="number" label="CLIP DURATION"></Input>
                <Input onChange={(e) => setAudioBufferSize(e.target.value)} value={audioBufferSize} type="number" label="Audio buffer size"></Input>
                
                <div style={listItemStyle}>
                    <div style={{marginTop: 8}}> ENABLE POSTPROCESSING </div>
                    <Checkbox style={{marginTop: -10}} checked={postProcessingEnabled} onClick={this.togglePostProcessingEnabled}> </Checkbox>
                </div>
            </div>
        )
    }
}

class Input extends PureComponent {
    state = {value: ""}

    render() {
        const { label, type, value, onChange } = this.props
        return(
            <div style={listItemStyle}>
                <div style={{fontSize: 14, marginTop: 8}}>{label}</div>
                <div><input disabled={this.props.disabled} value={value} onChange={onChange} style={{height: 18, width: 40}} type={type}></input></div>
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        fps:  state.globals.fps,
        clipDuration:  state.globals.clipDuration,
        postProcessingEnabled: state.items.postProcessingEnabled,
        audioBufferSize: state.globals.audioBufferSize
    }
}

export default connect(mapStateToProps)(ProjectSettings)
import React, { PureComponent } from 'react'
import { dispatchAction } from '@redux/actions/items'
import { editProjectSettings } from '@redux/actions/globals'
import ConfigList from './input';
import { connect } from 'react-redux'
class ProjectSettings extends PureComponent {
    constructor(props){
        super(props)
         
        const resolutions = [
            "2048x1080",
            "1920x1080",
            "1280x720",
            "640x480"
        ]

        this.config = {
            fps: 60,
            clipDuration: 180,
            audioBufferSize: 0.1,
            postProcessingEnabled: false,
            resolution: "680x480",
            defaultConfig: [{
                title: "Project settings",
                expanded: true,
                items: {
                    fps: {type: "Number", value: 60, disabled: true},
                    clipDuration: {type: "Number", value: 180},
                    audioBufferSize: {type: "Number", value: 0.1},
                    postProcessingEnabled: {type: "Boolean", value: false},
                    resolution: { type: "List", options: resolutions }
                }
            }]
        }

        dispatchAction({type: "ADD_PROJECT_SETTINGS", payload: this.config})
    }

    addAutomation = () => {

    }

    render() {

        return(
            <ConfigList
                edit={editProjectSettings} 
                defaultConfig={this.config.defaultConfig} 
                item={{...this.props}} 
                addAutomation={this.addAutomation}
            >
            </ConfigList>
        )
    }
}

const mapStateToProps = state => {
    return {
        fps: state.globals.fps,
        clipDuration: state.globals.clipDuration,
        audioBufferSize: state.globals.audioBufferSize,
        postProcessingEnabled: state.globals.postProcessingEnabled,
        resolution: state.globals.resolution,
        expanded: true
    }
}

export default connect(mapStateToProps)(ProjectSettings)
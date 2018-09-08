import React, { PureComponent } from 'react'
import { dispatchAction } from '@redux/actions/items'
import { editProjectSettings } from '@redux/actions/globals'
import ConfigList from './input';
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import withHeader from '../withheader'
import * as FileSaver from 'file-saver'
import store from '@redux/store'

class ProjectSettings extends PureComponent {
    constructor(props){
        super(props)
         
        this.config = {
            fps: 60,
            clipDuration: 180,
            audioBufferSize: 0.1,
            postProcessingEnabled: false,
            resolution: "680x480",
            masterVolume: 100,
            defaultConfig: [{
                title: "Project settings",
                expanded: true,
                items: {
                    fps: {type: "Number", value: 60, disabled: true},
                    clipDuration: {type: "Number", value: 180},
                    postProcessingEnabled: {type: "Boolean", value: false},
                    masterVolume: {type: "Number", min: 0, max: 100, value: 100}
                }
            }]
        }

        dispatchAction({type: "ADD_PROJECT_SETTINGS", payload: this.config})
    }

    addAutomation = () => {

    }

    saveAsTemplate = () => {
        console.log()
        var blob = new Blob([JSON.stringify(store.getState().items)], {type: "application/json"});
        FileSaver.saveAs(blob, "proj.json")
    }
    render() {

        return(
            <div>
                <ConfigList
                    edit={editProjectSettings} 
                    defaultConfig={this.config.defaultConfig} 
                    item={{...this.props}} 
                    addAutomation={this.addAutomation}
                >
                </ConfigList>

                <Button onClick={this.saveAsTemplate}>Save project as template</Button>
                <Button >export to video</Button>
            </div>
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
        expanded: true,
        masterVolume: state.globals.masterVolume
    }
}

export default connect(mapStateToProps)(withHeader(ProjectSettings))
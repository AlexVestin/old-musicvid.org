import React, { PureComponent } from 'react'
import { dispatchAction } from '@redux/actions/items'
import { editProjectSettings } from '@redux/actions/globals'
import ConfigList from '../../input/input';
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import withHeader from '../../HOC/withheader'
import * as FileSaver from 'file-saver'
import store from '@redux/store'

import classes from './projectsettings.css'
const fftSizes = [ "2048", "4096", "8192" ]

const bootstrapButtonStyle = {
    marginLeft: 10,
    marginRight: 10,
    boxShadow: 'none',
    color: "white",
    fontSize: 14,
    padding: '6px 12px',
    border: '1px solid',
    backgroundColor: '#007bff',
    borderColor: '#007bff',
    width: 125,
    textAlign: "center"
}

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
            fftSize: "2048",
            defaultConfig: [{
                title: "Project settings",
                expanded: true,
                items: {
                    fps: {type: "Number", value: 60, disabled: true},
                    clipDuration: {type: "Number", value: 180},
                    postProcessingEnabled: {type: "Boolean", value: false},
                    masterVolume: {type: "Number", min: 0, max: 100, value: 100},
                    fftSize: {type: "List", options: fftSizes, value: "2048"}
                }
            }]
        }

        dispatchAction({type: "ADD_PROJECT_SETTINGS", payload: this.config})
    }

    addAutomation = () => {

    }

    exportVideo = () => {
        dispatchAction({type: "SET_EXPORT", payload: true})
    }
    saveAsTemplate = () => {
        const projectSettings = JSON.stringify({items: store.getState().items, globals:store.getState().globals})
        var blob = new Blob([projectSettings], {type: "application/json"});
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

                <div className={classes.buttonContainer}>
                <div className={classes.buttonWrapper}>
                    <button onClick={this.saveAsTemplate} style={{...bootstrapButtonStyle, width: 180}} className={classes.button}>Save as template</button>
                    <button onClick={this.exportVideo} style={bootstrapButtonStyle} className={classes.button}>Export video</button>
                </div>
                </div>
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
        masterVolume: state.globals.masterVolume,
        fftSize: state.globals.fftSize,
    }
}

export default connect(mapStateToProps)(withHeader(ProjectSettings))
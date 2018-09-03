import React from 'react';
import withHeader from '../withheader'

import { connect } from 'react-redux'
import { setSidebarWindowIndex,  editCamera, editControls, editLayer, dispatchAction } from '@redux/actions/items'
import GroupContainer from '../input/groupcontainer'
import ConfigList from '../input/input'
import ItemList from '../item/items'
import NameInput from './nameinput'
import AlertDialog from '../removemodal'


class Layer extends React.Component {

    state = {modalOpen: false};

    back = () => {
        setSidebarWindowIndex(this.props.idxs.LAYERS)
    };

    editName = event =>  {
        var value = event.target.value
        editLayer({key: "name", value: value})
    }

    addAction = () => {
        if(this.props.layer.layerType === 1){
            setSidebarWindowIndex(this.props.idxs.ADDRESOURCEOPTIONS)
        } else {
            setSidebarWindowIndex(this.props.idxs.ADDRESOURCEOPTIONS2D)
        }
    }

    closeModal = () => this.setState({modalOpen: false});

    removeItem = () => {
        dispatchAction({type: "REMOVE_LAYER", payload: this.props.layer})
    }

    removeMe = () => {
        this.setState({modalOpen: true});
    }
    
    render() {

        return (
            <div style={{height: "100%", overflowY: "scroll"}}>
                
               <AlertDialog open={this.state.modalOpen} yesResponse={this.removeItem} handleClose={this.closeModal}></AlertDialog>
               <NameInput onDelete={this.removeMe} value={this.props.layer.name} edit={this.editName}></NameInput>
               
                <GroupContainer label={"Items"} addAction={this.addAction}>
                    <ItemList idxs={this.props.idxs}></ItemList>
                </GroupContainer>

                {this.props.layer.layerType === 1 &&
                    <React.Fragment>
                        <ConfigList 
                            edit={editCamera} 
                            defaultConfig={this.props.camera.defaultConfig} 
                            item={this.props.camera} 
                            addAutomation={this.addAutomation}>
                        </ConfigList>
                    
                        <ConfigList 
                            edit={editControls} 
                            defaultConfig={this.props.controls.defaultConfig} 
                            item={this.props.controls} 
                            addAutomation={this.addAutomation}>
                        </ConfigList>
                    </React.Fragment>
                }

                <ConfigList 
                    edit={editLayer} 
                    defaultConfig={this.props.layer.defaultConfig} 
                    item={this.props.layer} 
                    addAutomation={this.addAutomation}>
                </ConfigList>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        selectedItem: state.items.items[state.items.selectedLayerId][state.items.selectedItemId],
        items: state.items.items,
        sideBarWindowIndex: state.items.sideBarWindowIndex,
        postProcessingEnabled: state.globals.postProcessingEnabled,
        layer: state.items.layers[state.items.selectedLayerId],
        camera: state.items.cameras[state.items.selectedLayerId],
        controls: state.items.controls[state.items.selectedLayerId],
        settings: state.items.settings[state.items.selectedLayerId]
    }
}

export default connect(mapStateToProps)(withHeader(Layer)) 

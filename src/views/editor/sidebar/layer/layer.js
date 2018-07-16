import React from 'react';
import withHeader from '../withheader'

import { connect } from 'react-redux'
import { setSidebarWindowIndex,  editCamera, editControls } from '@redux/actions/items'

import GroupContainer from '../groupcontainer'
import ConfigList from '../input'
import ItemList from '../item/items'
import EffectList from './effects'


class Layer extends React.Component {

    back = () => {
        setSidebarWindowIndex(this.props.idxs.LAYERS)
    };

    addAction = () => {
        if(this.props.layer.isThreeLayer){
            setSidebarWindowIndex(this.props.idxs.ADDRESOURCEOPTIONS)
        } else {
            setSidebarWindowIndex(this.props.idxs.ADDRESOURCEOPTIONS2D)
        }
    }
    
    render() {
        return (
            <div style={{height: "100%", overflowY: "scroll"}}>
                <GroupContainer label={"Items"} addAction={this.addAction}>
                    <ItemList idxs={this.props.idxs}></ItemList>
                </GroupContainer>

                {this.props.layer.isThreeLayer &&
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
                <GroupContainer disabled={this.props.postProcessingEnabled} label={"Effects"} addAction={() => setSidebarWindowIndex(this.props.idxs.NEWEFFECT)}>
                    <EffectList idxs={this.props.idxs}></EffectList>
                </GroupContainer> 
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        selectedItem: state.items.items[state.items.selectedLayerId][state.items.selectedItemId],
        items: state.items.items,
        sideBarWindowIndex: state.items.sideBarWindowIndex,
        postProcessingEnabled: state.items.postProcessingEnabled,
        layer: state.items.layers[state.items.selectedLayerId],
        camera: state.items.cameras[state.items.selectedLayerId],
        controls: state.items.controls[state.items.selectedLayerId],
        fog: state.items.fog[state.items.selectedLayerId]
    }
}

export default connect(mapStateToProps)(withHeader(Layer)) 

/*
<ConfigList 
    edit={editFog} 
    defaultConfig={this.props.fog.defaultConfig} 
    item={this.props.fog} 
    addAutomation={this.addAutomation}>
</ConfigList>
*/
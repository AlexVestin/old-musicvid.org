import React from 'react';
import withHeader from '../withheader'

import { connect } from 'react-redux'
import { setSidebarWindowIndex,  editCamera, editControls, editLayer } from '@redux/actions/items'

import GroupContainer from '../groupcontainer'
import ConfigList from '../input'
import ItemList from '../item/items'
import EffectList from './effects'


class Layer extends React.Component {

    back = () => {
        setSidebarWindowIndex(this.props.idxs.LAYERS)
    };

    editName = event =>  {
        var value = event.target.value
        editLayer({key: "name", value: value})
    }

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
                
                <div style= {{margin: 5, marginTop: 10, display: "flex", justifyContent:"space-between", flexDirection:"row", width: "100%", height: 24, overflow: "hidden"}}>
                    <div style={{height: "100%", marginTop: 2}}>{"Name:"}</div>
                    <input style={{height: 18, padding:0, marginTop: 1, marginRight: 10}} onChange={this.editName} value={this.props.layer.name} type="text"></input>
                </div>
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

                <ConfigList 
                    edit={editLayer} 
                    defaultConfig={this.props.layer.defaultConfig} 
                    item={this.props.layer} 
                    addAutomation={this.addAutomation}>
                </ConfigList>

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
        settings: state.items.settings[state.items.selectedLayerId]
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
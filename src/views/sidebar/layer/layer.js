import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import IconButton from 'material-ui/IconButton'


import { connect } from 'react-redux'
import { setSidebarWindowIndex,  editCamera, editFog, editControls } from '../../../redux/actions/items'

import GroupContainer from '../groupcontainer'
import ConfigList from '../input'
import ItemList from '../item/items'
import EffectList from './effects'

import AppBar from 'material-ui/AppBar'
import Typography from 'material-ui/Typography'

const styles = theme => ({
  root: {
    height: "100%", // height of the header/appbar
    width: '100%',
    overflowY: "scroll",
    margin: 0,
    tableLayout: "fixed"
  }
});

class Layer extends React.Component {

    back = () => {
        setSidebarWindowIndex(this.props.idxs.LAYERS)
    };
    render() {
        const { classes, sideBarWindowIndex } = this.props;

        return (
            <div className={classes.root}>
                <AppBar position="static" style={{display: "flex" , flexDirection: "row", backgroundColor: "#676767", height: 30, minHeight: 30, width: "100%", margin: 0, textAlign: "center"}}>
                    
                    <div style={{minWidth: 20, minHeight: 20, marginTop: 3}}>
                        <KeyboardArrowLeft onClick={this.back} ></KeyboardArrowLeft>
                    </div>
                    <div style={{marginTop: 3, height: 12}}>{this.props.layer.name} </div>
                    {sideBarWindowIndex === this.props.idxs.ITEM && <div>HELLO</div>}
                    {sideBarWindowIndex === this.props.idxs.EFFECTS && <div>HELLO</div>}
                    
                </AppBar>

                <GroupContainer label={"Items"} addAction={() => setSidebarWindowIndex(this.props.idxs.ADDRESOURCEOPTIONS)}>
                    <ItemList idxs={this.props.idxs}></ItemList>
                </GroupContainer>

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

                <ConfigList 
                    edit={editFog} 
                    defaultConfig={this.props.fog.defaultConfig} 
                    item={this.props.fog} 
                    addAutomation={this.addAutomation}>
                </ConfigList>

        
                <GroupContainer disabled={this.props.postProcessingEnabled} label={"Effects"} addAction={() => setSidebarWindowIndex(this.props.idxs.NEWEFFECT)}>
                    <EffectList idxs={this.props.idxs}></EffectList>
                </GroupContainer> 

            </div>
        );
    }
}




Layer.propTypes = {
  classes: PropTypes.object.isRequired,
};

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

export default connect(mapStateToProps)(withStyles(styles)(Layer)) 
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem,  ListItemText } from 'material-ui/List';
import { setSidebarWindowIndex, createItem } from '@redux/actions/items'
import {connect} from 'react-redux'
import withHeader from '../withheader'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import AppBar from 'material-ui/AppBar'

const items3D = [
  "Bars", 
  "Text3D", 
  "Water", 
  "Tesselated Text", 
  "Sphere", 
  "Random Geometry", 
  "Particles", 
  "Skybox", 
  "Skybox2", 
  "Northern Lights",
  "Audio Circle",
  "Noise Blob"
]

const items2D = [
  "Inception City",
  "Nebulosa",
  "Circle Rings",
  "Polartone",
  "Square",
  "jsnation",
  "Text",
  "Kinetic Text",
  "Circle Player",
  "Time Keeper",
  "Time Text"
]

class AudioReactiveTypeList extends React.Component {  
  setWindow = () => {
    this.props.setWindow(4)
  };

  add = (itemName) => {
    createItem({type: itemName.toUpperCase()})
  }

  back = () => {
    setSidebarWindowIndex(this.props.idxs.ADDRESOURCEOPTIONS)
  }

  render() {
    const items = this.props.layer.isThreeLayer ? items3D : items2D
    return (
        <List>
          {items.map(value => (
            <ListItem key={value} dense button onClick={() => this.add(value)}>
              <ListItemText primary={value} />
            </ListItem>
          ))}
        </List>
    );
  }
}


const mapStateToProps = state => {
  return {
    layer: state.items.layers[state.items.selectedLayerId]
  }
}

export default connect(mapStateToProps)(withHeader(AudioReactiveTypeList) )
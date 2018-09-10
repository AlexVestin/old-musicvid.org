import React from 'react';
import List, { ListItem,  ListItemText } from 'material-ui/List';
import { setSidebarWindowIndex, createItem } from '@redux/actions/items'
import {connect} from 'react-redux'
import withHeader from '../../HOC/withheader'

const items3D = [
  "Bars", 
  "Text3D", 
  "Tesselated Text", 
  "Sphere", 
  "Random Geometry", 
  "Particles", 
  "Skybox", 
  "Skybox2", 
  "Northern Lights",
  "Audio Circle",
  "Noise Blob",  
]

const bgItems = [
  "Video",
  "Image"
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
  "Time Text",
  "Circle2",
  "Wavelet Canvas"
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

    let items;

    console.log(this.props.layer)
    switch(this.props.layer.layerType){
      case 0:
        items = bgItems;
        break;
      case 1:
        items = items3D;
        break;
      case 2:
        items = items2D;
        break;
      default:  
    }

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
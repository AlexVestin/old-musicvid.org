import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem,  ListItemText } from 'material-ui/List';
import { setSidebarWindowIndex, createItem } from '@redux/actions/items'
import {connect} from 'react-redux'

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
  "Audio Circle"
]

const items2D = [
  "Inception City",
  "Nebulosa",
  "Circle Rings",
  "Polartone",
  "Square"
]

const styles = theme => ({
  root: {
    height: "100%", // height of the header/appbar
    width: '100%',
    overflowY:  "scroll",
    backgroundColor: theme.palette.background.paper,
  },
});

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
    const { classes } = this.props;
    const items = this.props.layer.isThreeLayer ? items3D : items2D
    return (

      <div className={classes.root}>
       <AppBar position="static" style={{display: "flex" , flexDirection: "row", backgroundColor: "#676767", height: 30, minHeight: 30, width: "100%", margin: 0, textAlign: "center"}}>
            <div style={{minWidth: 20, minHeight: 20, marginTop: 3}}>
                <KeyboardArrowLeft onClick={this.back} ></KeyboardArrowLeft>
            </div>
            <div style={{marginTop: 3, height: 12}}>{this.props.layer.name} </div>
        </AppBar>


        <List>
          {items.map(value => (
            <ListItem key={value} dense button className={classes.listItem} onClick={() => this.add(value)}>
              <ListItemText primary={value} />
            </ListItem>
          ))}
        </List>

      </div>
    );
  }
}

AudioReactiveTypeList.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    layer: state.items.layers[state.items.selectedLayerId]
  }
}

export default connect(mapStateToProps)(withStyles(styles)(AudioReactiveTypeList) )
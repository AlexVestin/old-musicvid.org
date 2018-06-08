import React from 'react';

import { connect } from 'react-redux'

import {selectLayer} from '@redux/actions/items'
import withHeader from '../withheader'

import List, { ListItem, ListItemText } from 'material-ui/List';
import Button from 'material-ui/Button'



class LayerList  extends React.Component {

  onClick = (layer) => {
    selectLayer(layer.id)
  }

  render() {
    const { layers } = this.props;

    const root = {
      height: "100%", 
      width: '100%',
      overflowY: "scroll"
    }

    return (
      <div className={root}>
        <List>
          {Object.keys(layers).map(key => (
            <ListItem key={layers[key].name} dense button onClick={() => this.onClick(layers[key])}>
              <ListItemText primary={layers[key].name} />
            </ListItem>
          ))}
        </List>
        
        <Button disabled variant="raised" fullWidth onClick={this.setWindow} color="secondary">
            Add New Layer
        </Button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    layers: state.items.layers
  }
}
export default connect(mapStateToProps)(withHeader(LayerList))
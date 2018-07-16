import React from 'react';
import { connect } from 'react-redux'
import { selectLayer, dispatchAction } from '@redux/actions/items'
import withHeader from '../withheader'
import List, { ListItem, ListItemText } from 'material-ui/List';
import Button from 'material-ui/Button'

class LayerList  extends React.Component {

  onClick = (layer) => {
    selectLayer(layer.id)
  }

  create2DLayer = () =>  {
    dispatchAction( { type: "CREATE_2D_LAYER" })
  }

  create3DLayer = () =>  {
    dispatchAction( { type: "CREATE_3D_LAYER" })
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
        
        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
          <Button disableRipple style={{  borderTop: "1px solid gray", borderBottom: "1px solid gray"}}  fullWidth onClick={this.create3DLayer} > Add 3d Layer</Button>
          <Button disableRipple style={{ borderTop: "1px solid gray", borderBottom: "1px solid gray"}}  fullWidth onClick={this.create2DLayer} > Add 2d Layer</Button>
        </div>
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
import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux'

import {selectLayer} from '@redux/actions/items'
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Button from 'material-ui/Button'

const styles = theme => ({
  root: {
    height: "100%", // height of the header/appbar
    width: '100%',
  },
});

class LayerList  extends React.Component {

  onClick = (layer) => {
    selectLayer(layer.id)
  }

  render() {
    const { classes, layers } = this.props;

    return (
      <div className={classes.root}>
      
        <List>
          {Object.keys(layers).map(key => (
            <ListItem key={layers[key].name} dense button className={classes.listItem} onClick={() => this.onClick(layers[key])}>
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

LayerList.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    layers: state.items.layers
  }
}

export default connect(mapStateToProps)(withStyles(styles)(LayerList))
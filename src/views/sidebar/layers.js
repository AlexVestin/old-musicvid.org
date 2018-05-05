import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux'

import {selectLayer} from '../../redux/actions/items'
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button'
import FolderIcon from 'material-ui-icons/Folder';
import DeleteIcon from 'material-ui-icons/Delete';
import IconButton from 'material-ui/IconButton';


const styles = theme => ({
  root: {
    height: "calc(100% - 78px)", // height of the header/appbar
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

class LayerList  extends React.Component {

  setWindow = () => {

  };

  onClick = (e) => {
    selectLayer(e)
  }

  render() {
    const { classes, layers } = this.props;

    return (
      <div className={classes.root}>
      
        <List>
          {this.props.layers.map(layer => (
            <ListItem key={layer.name} dense button className={classes.listItem} onClick={() => this.onClick(layer)}>
              <Avatar> <FolderIcon/></Avatar>
              <ListItemText primary={layer.name} />
              <ListItemSecondaryAction>
                    <IconButton aria-label="Delete">
                        <DeleteIcon />
                    </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <Button variant="raised" fullWidth onClick={this.setWindow} color="secondary">
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
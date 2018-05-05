import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux'

import {createRenderTarget, selectRenderTarget} from '../../../redux/actions/items'
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';
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

class RenderTargetList extends React.Component {

  setWindow = () => {
    console.log("createintg")
    createRenderTarget()
  };

  onClick = (e) => {
    selectRenderTarget(e)
  }

  render() {
    const { classes, renderTargets } = this.props;
    return (
      <div className={classes.root}>
      
        <List>
          {renderTargets.map(layer => (
            <ListItem key={layer.name} dense button className={classes.listItem} onClick={() => this.onClick(layer)}>
              <Avatar> <FolderIcon/></Avatar>
              <ListItemText primary={layer.name} />
            </ListItem>
          ))}
        </List>
        <Button variant="raised" fullWidth onClick={this.setWindow} color="secondary">
            Add New Rendertarget
        </Button>
      </div>
    );
  }
}

RenderTargetList.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    renderTargets: state.items.renderTargets
  }
}

export default connect(mapStateToProps)(withStyles(styles)(RenderTargetList))
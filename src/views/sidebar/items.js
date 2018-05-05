import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

import Button from 'material-ui/Button'

import FolderIcon from 'material-ui-icons/Folder';
import DeleteIcon from 'material-ui-icons/Delete';
import IconButton from 'material-ui/IconButton';

import { connect } from 'react-redux'
import { selectItem, setSidebarWindowIndex } from '../../redux/actions/items'
import { O_NONBLOCK } from 'constants';




const styles = theme => ({
  root: {
    height: "calc(100% - 78px)", // height of the header/appbar
    width: '100%',
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

class ResourceList extends React.Component {

  setWindow = () => {
    setSidebarWindowIndex(this.props.idxs.ADDRESOURCEOPTIONS)
  };

  selectItem = (obj) => {
    selectItem(obj)
  }

  back = () => {
    setSidebarWindowIndex(this.props.idxs.LAYER)
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <List>
          {this.props.items.map(obj => {
            return obj.sceneId === this.props.selectedLayer.id ?          
            <ListItem key={obj.id} dense button className={classes.listItem} onClick={() => this.selectItem(obj)}>
              <Avatar> <FolderIcon/></Avatar>
              <ListItemText primary={obj.name} />
              <ListItemSecondaryAction>
                    <IconButton aria-label="Delete">
                        <DeleteIcon />
                    </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          : null})}

            <Button variant="raised" fullWidth onClick={this.setWindow}>
                Add New Item
            </Button>

             
        </List>
        <Button variant="raised" fullWidth onClick={this.back}>
            Back
        </Button>
      </div>
    );
  }
}

ResourceList.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    items: state.items.items,
    selectedLayer: state.items.selectedLayer,
  }
}

export default connect(mapStateToProps)(withStyles(styles)(ResourceList))
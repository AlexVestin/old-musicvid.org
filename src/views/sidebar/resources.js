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
const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

class ResourceList extends React.Component {

  setWindow = () => {
    setSidebarWindowIndex(3)
  };

  selectItem = (obj) => {
    selectItem(obj)
    setSidebarWindowIndex(6)
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <List>
          {this.props.items.map(obj => (
            <ListItem key={obj.id} dense button className={classes.listItem} onClick={() => this.selectItem(obj)}>
              <Avatar> <FolderIcon/></Avatar>
              <ListItemText primary={obj.name} />
              <ListItemSecondaryAction>
                    <IconButton aria-label="Delete">
                        <DeleteIcon />
                    </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}

          <ListItem dense button className={classes.listItem}>
            <Button variant="raised" fullWidth onClick={this.setWindow}>
                Add New Item
            </Button>
            </ListItem>
        </List>
      </div>
    );
  }
}

ResourceList.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    items: state.items.items
  }
}

export default connect(mapStateToProps)(withStyles(styles)(ResourceList))
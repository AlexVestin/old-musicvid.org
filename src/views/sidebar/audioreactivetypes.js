import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

import Button from 'material-ui/Button'

import FolderIcon from 'material-ui-icons/Folder';
import DeleteIcon from 'material-ui-icons/Delete';
import IconButton from 'material-ui/IconButton';

import { setSidebarWindowIndex, createItem } from '../../redux/actions/items'
import {connect} from 'react-redux'

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
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
    setSidebarWindowIndex(3)
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <List>
          {["Bars", "Text3D", "Water"].map(value => (
            <ListItem key={value} dense button className={classes.listItem} onClick={() => this.add(value)}>
              <ListItemText primary={value} />
            </ListItem>
          ))}

          <ListItem dense button className={classes.listItem}>
            <Button variant="raised" fullWidth onClick={this.back}>
                Back
            </Button>
            </ListItem>
        </List>
      </div>
    );
  }
}

AudioReactiveTypeList .propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    items: state.items
  }
}

export default connect(mapStateToProps)(withStyles(styles)(AudioReactiveTypeList) )
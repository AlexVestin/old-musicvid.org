import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

import Button from 'material-ui/Button'

import FolderIcon from 'material-ui-icons/Folder';
import DeleteIcon from 'material-ui-icons/Delete';
import IconButton from 'material-ui/IconButton';


const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});

class LayerList  extends React.Component {

  setWindow = () => {
        this.props.setWindow(4)
    };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <List>
          {["Foreground", "Scene", "Background"].map(value => (
            <ListItem key={value} dense button className={classes.listItem}>
              <Avatar> <FolderIcon/></Avatar>
              <ListItemText primary={value} />
              <ListItemSecondaryAction>
                    <IconButton aria-label="Delete">
                        <DeleteIcon />
                    </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}

          <ListItem dense button className={classes.listItem}>
            <Button variant="raised" fullWidth onClick={this.setWindow}>
                Add New Layer
            </Button>
            </ListItem>
        </List>
      </div>
    );
  }
}

LayerList .propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LayerList ) 
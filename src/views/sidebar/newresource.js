import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

import Button from 'material-ui/Button'

import FolderIcon from 'material-ui-icons/Folder';
import DeleteIcon from 'material-ui-icons/Delete';
import IconButton from 'material-ui/IconButton';

import { appendItem, selectItem } from '../../redux/actions/items'

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 330,
    backgroundColor: theme.palette.background.paper,
  },
});

class AddResourceOptions extends React.Component {
    back = () => {
        this.props.back()
    };

    add = (e) => {
        switch(e) {
            case 0:
                this.uploadSound.click()
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                this.props.setWindow(5)
                break;
            case 4:
                break;
            default:
                console.log("unknown click type")
        }
    }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <input type="file" ref={(ref) => this.uploadSound = ref} style={{ display: 'none' }} />
        <input type="file" ref={(ref) => this.uploadImage = ref} style={{ display: 'none' }} />
        <input type="file" ref={(ref) => this.uploadVideo = ref} style={{ display: 'none' }} />
                        
        <List>
            <ListItem dense button className={classes.listItem}>
                <ListItemText primary={`Add sound`} onClick={() => this.add(0)}/>
            </ListItem>

            <ListItem dense button className={classes.listItem}>
                <ListItemText primary={`Add background image`} onClick={() => this.add(1)}/>
            </ListItem>

            <ListItem dense button className={classes.listItem} onClick={() => this.add(2)}>
                <ListItemText primary={`Add Video`} />
            </ListItem>

            <ListItem dense button className={classes.listItem} onClick={() => this.add(3)}>
                <ListItemText primary={`Add Audio Reactive Item`} />
            </ListItem>

            <ListItem dense button className={classes.listItem} onClick={() => this.add(4)}>
                <ListItemText primary={`Add Text`} />
            </ListItem>

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

AddResourceOptions .propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddResourceOptions )
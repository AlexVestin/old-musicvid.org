import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

import Button from 'material-ui/Button'

import FolderIcon from 'material-ui-icons/Folder';
import DeleteIcon from 'material-ui-icons/Delete';
import IconButton from 'material-ui/IconButton';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import { connect } from 'react-redux'
import { editItem } from '../../redux/actions/items'

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});

class Item extends React.Component {

    setWindow = () => {
        this.props.setWindow(4)
    };

    edit = () => {
        editItem({name: "Bars", color: "FFFF00", strength: 3, layer: "Scene"})
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
            <AppBar position="static" color="default">
                <Toolbar>
                <Typography variant="title" color="inherit">
                {this.props.selectedItem.name}
                </Typography>
                </Toolbar>
            </AppBar>

            <List>
                {Object.keys(this.props.selectedItem).map((key, index) => (
                    <ListItem key={key} dense button className={classes.listItem} onClick={this.edit}>
                        <ListItemText primary={key + ": " + this.props.selectedItem[key]}  />
                    </ListItem>
                ))}
                
                <ListItem dense button className={classes.listItem}>
                <Button variant="raised" fullWidth onClick={this.props.back}>
                    Back
                </Button>
                </ListItem>
            </List>
            </div>
        );
    }
}

Item .propTypes = {
  classes: PropTypes.object.isRequired,
};

/*
          {["dfgdf", "Scene", "Background"].map(value => (
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
*/


const mapStateToProps = state => {
    return {
        selectedItem: state.selectedItem
    }
}

export default connect(mapStateToProps)(withStyles(styles)(Item)) 
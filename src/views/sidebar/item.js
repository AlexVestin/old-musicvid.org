import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

import Button from 'material-ui/Button'

import FolderIcon from 'material-ui-icons/Folder';
import DeleteIcon from 'material-ui-icons/Delete';
import IconButton from 'material-ui/IconButton';

import TextField from 'material-ui/TextField';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Tooltip from 'material-ui/Tooltip';


import { connect } from 'react-redux'
import { editItem, setSidebarWindowIndex } from '../../redux/actions/items'

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 100,
  },

  listItem: {
      height: 50,
      minHeight: 50
  }
});

class Item extends React.Component {

    constructor() {
        super()
        this.state = {values: {}}
    }

    setWindow = () => {
        //this.props.setWindow(4)
    };

    back = () => {
        setSidebarWindowIndex(0)
    }

    handleChange = input => event => {
        var value = event.target.value
        var numberValue = -1
        if(input.type === "Number") {
            if(value[value.length -1] !== "." && value[0] !== "-")
                if(isNaN(value) || value.length > 12){
                return
            }
            
            // if only a '-' set value to zero and allow it to be set to state
            numberValue =( value[0] === "-" && value.length === 1) ? 0 : Number(value)
        }

        let values = {...this.state.values}
        values[input.key] = value
        this.setState({values})
        let val = numberValue !== -1 ? numberValue : value
        let key = { ["value"] : val } 

        const updatedItem = Object.assign({}, this.props.selectedItem, {
            ...this.props.selectedItem,
            [input.key]: {
                ...this.props.selectedItem[input.key],
                value: val
            }
        })

        editItem(updatedItem)
    }

    componentWillMount() {
        let values = []
        const si = this.props.selectedItem

        Object.keys(si).map((key, index) => {
            values[key] = si[key].value
        })
        this.setState({values})
    }

    render() {
        const { classes } = this.props;
        const si = this.props.selectedItem;

        return (
            <div className={classes.root}>
            <AppBar position="static" color="default">
                <Toolbar>
                <Typography variant="title" color="inherit">
                {this.props.selectedItem.name.value}
                </Typography>
                </Toolbar>
            </AppBar>

            <List>
                {Object.keys(si).map((key, index) => (
                    <div key={key}>
                        {si[key].show !== false &&
                        <ListItem  dense className={classes.listItem}>
                        <Tooltip id="tooltip-top-start" title={si[key].tooltip} placement="right-end">
                            <TextField
                                id={key}
                                label={key}
                                className={classes.textField}
                                value={this.state.values[key]}
                                margin="normal"
                                onChange={this.handleChange({type: si[key].type, key: key})}
                                disabled={!si[key].editable}
                            />
                        </Tooltip>
                        </ListItem>
                        }
                    </div>
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


                            <ListItem key={key} dense button className={classes.listItem} onClick={this.edit}>
                        
                        
                    
*/


const mapStateToProps = state => {
    return {
        selectedItem: state.selectedItem
    }
}

export default connect(mapStateToProps)(withStyles(styles)(Item)) 
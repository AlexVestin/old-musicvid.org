import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem } from 'material-ui/List';

import Button from 'material-ui/Button'
import Delete from 'material-ui-icons/Delete';
import TextField from 'material-ui/TextField';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Tooltip from 'material-ui/Tooltip';


import { connect } from 'react-redux'
import { editItem, setSidebarWindowIndex, removeItem } from '../../redux/actions/items'

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
        this.setState({values}, () => {
            let val = numberValue !== -1 ? numberValue : value
            editItem({key: input.key, value: val})
        })   
    }

    setInputValues = (props) => {
        let values = {}
        const si = props.selectedItem


        Object.keys(si).map((key, index) => 
            values[key] = this.state.values[key] !== (String(si[key]) + ".") ? si[key] : values[key] 
        )
        this.setState({values})
    
    }

    removeItem = () => {
        removeItem(this.props.selectedItem)
    }

    componentWillMount(props) {
        this.setInputValues(this.props)
    }
        
    componentWillReceiveProps(props) {
        this.setInputValues(props)
    } 

    render() {
        const { classes } = this.props;
        const conf = this.props.selectedItem.defaultConfig;


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
                {Object.keys(conf).map((key, index) => (
                    <div key={key}>
                        {conf[key].show !== false &&
                        <ListItem  dense className={classes.listItem}>
                        <Tooltip id="tooltip-top-start" title={conf[key].tooltip} placement="right-end">
                            <TextField
                                id={key}
                                label={key}
                                className={classes.textField}
                                value={this.state.values[key]}
                                margin="normal"
                                onChange={this.handleChange({type: conf[key].type, key: key})}
                                disabled={!conf[key].editable}
                            />
                        </Tooltip>
                        </ListItem>
                        }
                    </div>
                ))}
                <ListItem dense button className={classes.listItem}>
                <Button className={classes.button} onClick={this.removeItem} variant="raised" color="secondary">
                    Delete item
                    <Delete className={classes.rightIcon} />
                </Button>
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

Item.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    return {
        selectedItem: state.items.selectedItem
    }
}

export default connect(mapStateToProps)(withStyles(styles)(Item)) 
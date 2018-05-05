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
    height: "calc(100% - 78px)", // height of the header/appbar
    width: '100%',
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  textField: {
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    width: 80,
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
        setSidebarWindowIndex(this.props.idxs.ITEMS)
    }

    handleChange = input => event => {
        var value = event.target.value
        var numberValue = null
        if(input.type === "Number" && value !== "") {
            if(value === "" || value === ".") {
                numberValue = 0
            }else {
                if(value[value.length -1] !== "." && value[0] !== "-" ){
                    if(isNaN(value) || value.length > 12)
                        return
                    } 
                // if only a '-' set value to zero and allow it to be set to state
                numberValue = ( value[0] === "-" && value.length === 1) ? 0 : Number(value)
            }
        }

        let values = {...this.state.values}
        values[input.key] = value
        this.setState({values}, () => {
            let val = numberValue !== null ? numberValue : value
            editItem({key: input.key, value: val})
        })   
    }

    setInputValues = (props) => {
        let values = {}
        const si = props.selectedItem
        const conf = si.defaultConfig


        Object.keys(conf).map((key, index) => {
            // check if is negative or decimal
            const val = this.state.values[key]
            if (conf[key].type === "Number" && val !== undefined) {
                if (val === "-" || val === ".") {
                    if (si[key] !== 0) {
                        values[key] = si[key]
                    }
                } else {
                    values[key] = (val !== (String(si[key]) + ".") && val[val.length-1] !== "0") ? si[key] : values[key]
                }

            } else {
                values[key] = si[key]
            }

        })

        this.setState({ values })
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
            <div>
                <div style={{display: "flex", flexFlow: "row wrap", flexDirection: "row"}}>
                        {Object.keys(conf).map((key, index) => (
                            <div key={key}>
                                {conf[key].show !== false &&
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
                                }
                            </div>
                        ))}
                    </div>
                    
               
                </div>
                <div> 
                <Button className={classes.button} style={{marginLeft: "auto"}} fullWidth onClick={this.removeItem} variant="raised" color="secondary">
                    Delete item
                    <Delete className={classes.rightIcon} />
                </Button>               
                <Button variant="raised" fullWidth onClick={this.back}>
                    Back
                </Button>
                </div>
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
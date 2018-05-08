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
import { editEffect, setSidebarWindowIndex, removeEffect } from '../../../redux/actions/items'

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
    width: 75,
  },

  listItem: {
      height: 50,
      minHeight: 50
  }
});

class Effect extends React.PureComponent {

    constructor() {
        super()
        this.state = {values: {}}
    }

    setWindow = () => {
        //this.props.setWindow(4)
    };

    back = () => {
        setSidebarWindowIndex(this.props.idxs.EFFECTS)
    }

    charOccurances = (str, char) =>{
        for (var c = 0, i = 0, len = str.length; i < len; ++i){
            if (str[i] == char){
                ++c;
            }
        }
        return c;
    }

    handleChange = input => event => {
        var value = event.target.value
        var numberValue = null

        if(input.type === "Number") {
            if(this.charOccurances(value, ".") > 1 || this.charOccurances(value, "-") > 1)return
            if(value === "." || value === "-" || value === "") {
                numberValue = 0
            }else {
                if((!isNaN(value) && value.length < 12)) {
                    numberValue = Number(value)
                }else {
                    return
                }       
            }
        }

        let values = {...this.state.values}
        values[input.key] = value

        this.setState({values}, () => {
            let val = numberValue !== null ? numberValue : value
            editEffect({key: input.key, value: val})
        })   
    }

    checkIfNr = (nr) => {
        return 
    }

    setInputValues = (props, mounting) => {
       
        let values = {}
        const si = props.selectedLayer.selectedEffect
        const conf = si.defaultConfig

        Object.keys(conf).map((key, index) => {
            // check if is negative or decimal
            const val = this.state.values[key]
            if (conf[key].type === "Number" && val !== undefined) {
                if (val === "-" || val === "." || val === "") {
                   
                    if (si[key] !== 0) {
                        values[key] = si[key]
                    }else {
                        values[key] = val
                    }
                } else {
                    values[key] = (val !== (String(si[key]) + ".") && (val[val.length -1] !== "0" && val[val.length -1] !== ".")) ? si[key] : values[key]
                }

            } else {
                values[key] = si[key]
            }
            
        })
        this.setState({ values })
        
    }

    removeItem = () => {
        removeEffect(this.props.selectedLayer.selectedEffect)
    }

    componentWillMount(props) {
        this.setInputValues(this.props, true)
    }
        
    componentWillReceiveProps(props) {
        this.setInputValues(props)
    } 

    render() {
        const { classes } = this.props;
        const effect = this.props.selectedLayer.selectedEffect
        const conf = effect.defaultConfig;
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
                <Button disabled={effect.renderPass} className={classes.button} style={{marginLeft: "auto"}} fullWidth onClick={this.removeItem} variant="raised" color="secondary">
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

Effect.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    return {
        selectedLayer: state.items.selectedLayer
    }
}

export default connect(mapStateToProps)(withStyles(styles)(Effect)) 
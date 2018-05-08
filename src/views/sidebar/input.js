
import React, {PureComponent} from 'react'

import List, { ListItem } from 'material-ui/List';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types'

import Button from 'material-ui/Button'
import Delete from 'material-ui-icons/Delete';
import TextField from 'material-ui/TextField';

import Typography from 'material-ui/Typography';
import Tooltip from 'material-ui/Tooltip';


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

class ConfigList extends PureComponent {
    render(){
        const { classes } = this.props;
        const defaultConfig = this.props.defaultConfig
        const item = this.props.item

        const inputStyles = {
            Number: {marginRight: 25, width: 40, minWidth: 40},
            String: {width: "95%", marginRight: 20}
        }

        return(
            <div className={classes.root}>
                <div>
                    <div style={{display: "flex", flexFlow: "row wrap", flexDirection: "row", marginRight: 20, boxSizing: "content-box"}}>
                            {Object.keys(defaultConfig).map((key, index) => (
                            <div key={key} style={inputStyles[defaultConfig[key].type]}>

                                {defaultConfig[key].show !== false &&
                                <Tooltip id="tooltip-top-start" title={defaultConfig[key].tooltip ? defaultConfig[key].tooltip : ""} placement="right-end">
                                <TextField
                                    id={key}
                                    type={defaultConfig[key].type === "Number" ? "number" : "text"}
                                    label={key.substring(0, 9)}
                                    className={classes.textField}
                                    defaultValue={String(item[key])}
                                    fullWidth={defaultConfig[key].type === "String"}
                                    margin="normal"
                                    onChange={this.props.handleChange({type: defaultConfig[key].type, key: key})}
                                    disabled={!defaultConfig[key].editable}
                                    style={inputStyles[defaultConfig[key].type]}
                                />
                            </Tooltip>
                                }
                            </div>
                        ))}
                    </div>
                </div>
                
                <div>
                <Button 
                    disabled={item.renderPass} className={classes.button} style={{marginLeft: "auto"}} fullWidth onClick={this.props.onDelete} variant="raised" color="secondary">
                        Delete item
                        <Delete className={classes.rightIcon} />
                    </Button>               
                    <Button variant="raised" fullWidth onClick={this.props.onBack}>
                        Back
                </Button>
                </div>
            </div> 
        )
    }
}

ConfigList.propTypes = {
    classes: PropTypes.object.isRequired,
};
  

export default withStyles(styles)(ConfigList)
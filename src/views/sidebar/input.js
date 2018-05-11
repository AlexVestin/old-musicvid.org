
import React, {PureComponent} from 'react'

import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types'

import BrightnessAuto from '@material-ui/icons/BrightnessAuto'

import Button from 'material-ui/Button'
import Delete from 'material-ui-icons/Delete';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/Tooltip';


const inputStyles = {
    Number: {marginRight: 30, width: 40, minWidth: 40},
    String: { minWidth: "95%", marginRight: 20},
    Link: { width: 50 }
}


const styles = theme => ({
    root: {
      height: "calc(100% - 78px)", // height of the header/appbar
      width: '100%',
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      backgroundColor: theme.palette.background.paper,
      overflowX: "hidden",
    },
    textField: {
      marginLeft: theme.spacing.unit * 3,
      marginRight: theme.spacing.unit * 3,
      width: 75,
    },

    groupWrapper: {
        overflowY: "scroll",
        overflowX: "hidden",
        height: "100%",
        width: "100%"
    },
  
    listItem: {
        height: 50,
        minHeight: 50
    },
});


class ConfigList extends PureComponent {

    render(){
        const { classes } = this.props;
        const defaultConfig = this.props.defaultConfig
        const item = this.props.item

        return(
            <div className={classes.root}>
                <div className={classes.groupWrapper}>
                    {defaultConfig.map(group =>     
                       <GroupContainer item={item} group={group} addAutomation={this.props.addAutomation} handleChange={this.props.handleChange}></GroupContainer>
                    )}
                </div>
                
                <div>
                    <Button 
                        disabled={item.renderPass} 
                        className={classes.button} 
                        style={{marginLeft: "auto"}} 
                        fullWidth onClick={this.props.onDelete} 
                        variant="raised" 
                        color="secondary">
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


const groupContainerStyle = {
    width: "100%",       
    marginLeft: 10, 
    marginRight: 10, 
    marginBottom: 10,
    overflowX: "hidden",
}

const inputContainer = {
    boxSizing: "border-box",
    flex: "1 0 auto",
    display: "flex",
    minWidth: "100%",
    flexDirection: "row",
    overflowX: "hidden",
}

class GroupContainer extends PureComponent {

    render() {
        const {group, item, handleChange } = this.props

        return(
            <div key={group.title} style={groupContainerStyle}>
                <div>
                <p style={{ height: 20, margin: 5}}>{group.title} </p>
                <div  style={inputContainer}>
                
                    {Object.keys(group.items).map((key, index) =>{
                        const config = group.items[key]
                        const props = {key, keyVal: key, item, config, handleChange: this.props.handleChange, addAutomation: this.props.addAutomation}
                        return(
                            <div key={key} style={inputStyles[config.type]}>
                                {(config.type === "Number" || config.type ==="String") && <CustomTextField {...props}></CustomTextField>}
                                {(config.type === "Link") && <LinkField {...props}></LinkField>}

                            </div>
                         )
                        }
                    )}
                </div>
            </div>
         </div>  

        )
    }
}




class LinkField extends PureComponent {
    render() {
        const item = this.props.item
        const key = this.props.keyVal

        return(
            <div key={key} style={{display: "flex", flexDirection: "row"}}>
                <a href={String(item[key])}>{String(key)}</a>
            </div>
        )
    }
}


class CustomTextField extends PureComponent {
    render() {
        const { config, item } = this.props
        const key = this.props.keyVal

        const autoIconWidth = 12
        return(
            <div key={key} style={{...inputStyles[config.type], display: "flex", flexDirection: "row"}}>
                <Tooltip id="tooltip-top-start" title={config.tooltip ? config.tooltip : ""} placement="right-end">
                    <TextField
                        id={key}
                        type={config.type === "Number" ? "number" : "text"}
                        label={key.substring(0, 9)}
                        defaultValue={String(item[key])}
                        fullWidth={config.type === "String"}
                        onChange={this.props.handleChange({type: config.type, key: key})}
                        disabled={!config.editable}
                        style={inputStyles[config.type]}
                    />
                
                </Tooltip>

                {config.type === "Number" && config.editable &&
                    <Button 
                    onClick={() => this.props.addAutomation(key) }
                    style={{marginLeft: 30, marginTop: 25, position: "absolute", minWidth: autoIconWidth, minHeight: autoIconWidth, width: autoIconWidth, height: autoIconWidth}}>
                        <BrightnessAuto style={{marginTop: -autoIconWidth / 2}}></BrightnessAuto>
                    </Button>
                }
            </div> 
        )
    }
}

CustomTextField = withStyles(styles)(CustomTextField)

ConfigList.propTypes = {
    classes: PropTypes.object.isRequired,
};
  

export default withStyles(styles)(ConfigList)
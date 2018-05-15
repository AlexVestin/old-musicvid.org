
import React, {PureComponent} from 'react'

import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types'

import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp'


import BrightnessAuto from '@material-ui/icons/BrightnessAuto'
import Help from '@material-ui/icons/Help'

import Button from 'material-ui/Button'
import Delete from 'material-ui-icons/Delete';
import Tooltip from 'material-ui/Tooltip';


const inputStyles = {
    Number: {marginRight: 10, width: 40, minWidth: 40, marginLeft: 5},
    String: { minWidth: "25%", marginRight: 10, marginLeft: 5},
    Link: { width: 50, marginLeft: 10 }
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
                       <GroupContainer key={group.title} item={item} group={group} addAutomation={this.props.addAutomation} handleChange={this.props.handleChange}></GroupContainer>
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
    width: "95%",       
    marginLeft: 10, 
    marginRight: 20, 
    marginBottom: 10,
    marginTop: 10,
    overflowX: "hidden",
    boxShadow: "1px 1px 1px 2px #ccc"
}

const inputContainer = {
    boxSizing: "border-box",
    flex: "1 0 auto",
    display: "flex",
    minWidth: "100%",
    flexDirection: "column",
    overflowX: "hidden",
    marginBottom: 3
}

class GroupContainer extends PureComponent {

    state = {expanded: false}

    toggleExpanded = () => this.setState({expanded: !this.state.expanded})

    render() {
        const { group, item } = this.props

        return(
            <div key={group.title} style={groupContainerStyle}>
                <div>
                    <div style={{backgroundColor: "#eee", display: "flex", flexDirection: "row", justifyContent:"space-between"}}>
                        <p style={{ height: 20, margin: 5, fontSize: 16}}>{group.title} </p>
                        {this.state.expanded && <KeyboardArrowUp style={{marginTop: 3}} onClick={this.toggleExpanded}></KeyboardArrowUp>}
                        {!this.state.expanded && <KeyboardArrowDown style={{marginTop: 3}} onClick={this.toggleExpanded}></KeyboardArrowDown>}
                    </div>

                {this.state.expanded && <div style={inputContainer}>
                    {Object.keys(group.items).map((key, index) =>{
                        const config = group.items[key]
                        const props = {key, keyVal: key, item, config, handleChange: this.props.handleChange, addAutomation: this.props.addAutomation}
                        return(
                            <div key={key} style={{width: "100%"}}>
                                {(config.type === "Number" || config.type ==="String") && <CustomTextField {...props}></CustomTextField>}
                                {(config.type === "Link") && <LinkField {...props}></LinkField>}

                            </div>
                         )
                        }
                    )}
                </div>}

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
            <div key={key} style={{display: "flex", flexDirection: "row", marginTop: 10, marginleft: 10}}>
                <a href={String(item[key])}>{String(key)}</a>
            </div>
        )
    }
}


class CustomTextField extends PureComponent {
    state= {mouseOver: false}

    render() {
        let { config, item } = this.props
        const key = this.props.keyVal
        if(config === undefined)config = {value: item[key], type: "Number", editable: false}

        const autoIconWidth = 18
        const iconMarginTop = 2
        return(
            <div key={key} style={{width: "95%", display: "flex", flexDirection: "row", justifyContent:"space-between", marginTop: 10}}>
                <div style={{display: "flex", flexDirection: "row"}}>  
                    <Tooltip id="tooltip-top-start" title={config.tooltip ? config.tooltip : ""} placement="right-end">
                        <Help style={{ marginTop: iconMarginTop, width: autoIconWidth, height: autoIconWidth, color: config.tooltip ? "black" : "gray"}}></Help>                  
                    </Tooltip>
                    <div style={{ marginTop: 4, marginLeft: 5, fontSize: 14 }}>{key}</div>
                    
                </div>

                <div style={{display: "flex", flexDirection: "row"}}>
                    {config.type === "Number" && config.editable !== false && !config.disableAutomations &&
                        <Tooltip id="tooltip-top-start" title={"Add keyframe track"} placement="right-end">
                            <BrightnessAuto 
                                onClick={() => this.props.addAutomation(key) }
                                style={{ marginTop: iconMarginTop,  width: autoIconWidth, height: autoIconWidth, color: this.state.mouseOver ? "gray" : "black" }}
                                onMouseOver={() => this.setState({mouseOver: true})}
                                onMouseOut={() => this.setState({mouseOver: false})}    
                            ></BrightnessAuto>
                        </Tooltip>
                    }

                   <input 
                        onChange={this.props.handleChange({type: config.type, key: key})} 
                        value={item[key]} 
                        disabled={config.editable === false}    
                        style={inputStyles[config.type]}
                        type={config.type === "Number" ? "number" : "text"}
                    ></input>


                     </div>
            </div> 
        )
    }
}

CustomTextField = withStyles(styles)(CustomTextField)

ConfigList.propTypes = {
    classes: PropTypes.object.isRequired,
};
  

export default withStyles(styles)(ConfigList)



import React, { PureComponent } from 'react'
import BrightnessAuto from '@material-ui/icons/BrightnessAuto'
import Help from '@material-ui/icons/Help'
import Tooltip from '@material-ui/core/Tooltip';
import classes from './labeledfieldwrapper.css'

const iconStyle = {
    width: 18,
    height: 18,
    marginTop: 2
}


const Title = (props) => {
    const autoIconWidth = 18

    const showTooltip = (props.min !== undefined || props.max !== undefined || props.tooltip !== undefined);
    const toolTip = showTooltip ? 
        (
            <div>
                {props.tooltip ? props.tooltip  : ""}
                {props.tooltip && <br/>}
                {props.min !== undefined && 
                    <React.Fragment>{"  min: " + props.min}</React.Fragment>
                }
                {props.max !== undefined && 
                    <React.Fragment>{"  max: " + props.max}</React.Fragment>
                }
            </div>
        ) 
    :
        "" 

    return (
        <div style={{display: "flex", flexDirection: "row"}}>  
            <Tooltip 
                id="tooltip-top-start" 
                title={toolTip} 
                placement="bottom">
                
                <div style={{width: autoIconWidth, height: autoIconWidth}}>
                    <Help 
                        className={classes.helpIcon} 
                        style={{...iconStyle, color: showTooltip ? "black" : "gray"}}>
                    </Help>                  
                </div>
            </Tooltip>
            <div style={{ marginTop: 4, marginLeft: 5, fontSize: 14 }}>{props.keyVal}</div>  
        </div>
    )
}

const AutomationIcon = (props) => {
    const autoIconWidth = 18
    const iconMarginTop = 2

    return(
        <Tooltip id="tooltip-top-start" title={"Add keyframe track (disabled)"} placement="right-end">
            <div style={{width: autoIconWidth, height: autoIconWidth}}>
                <BrightnessAuto 
                    disabled
                    style={{ marginTop: iconMarginTop,  width: autoIconWidth, height: autoIconWidth, color:"gray"}}
                ></BrightnessAuto>
            </div>
        </Tooltip>
    )
}


export default class LabeledFieldWrapper extends PureComponent {

    render() {
        let { keyVal, disabled, tooltip, type, disableAutomations, min, max } = this.props

        return(
            <div key={keyVal} style={{width: "95%", display: "flex", flexDirection: "row", justifyContent:"space-between", marginBottom: 3, marginTop: 3}}>
                <Title tooltip={tooltip} min={min} max={max} keyVal={keyVal}></Title>
                
                <div style={{display: "flex", flexDirection: "row"}}>
                    {type === "Number" && disabled !== true && !disableAutomations &&
                       <AutomationIcon></AutomationIcon>
                    }
                    {this.props.children}
                </div>
            </div> 
        )
    }
}

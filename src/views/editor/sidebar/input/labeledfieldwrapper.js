
import React, { PureComponent } from 'react'
import Help from '@material-ui/icons/Help'
import Tooltip from '@material-ui/core/Tooltip';
import classes from './labeledfieldwrapper.css'
import { withStyles } from '@material-ui/core/styles';
import AutomationPopper from './automationpopper'


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
    

    return(
        <Tooltip id="tooltip-top-start" title={"Add keyframe track (disabled)"} placement="right-end">
            <div style={{width: autoIconWidth, height: autoIconWidth}}>
               <AutomationPopper item={props.item}></AutomationPopper>
            </div>
        </Tooltip>
    )
}



class LabeledFieldWrapper extends PureComponent {

    constructor(props) {
        super(props);

        this.popperRef = React.createRef();
        this.inputRef = React.createRef();
    }


    render() { 
        let { keyVal, disabled, tooltip, type, disableAutomations, min, max, _automationId, _automationType, _automationEnabled } = this.props
        
        return(
            <div key={keyVal} style={{width: "95%", display: "flex", flexDirection: "row", justifyContent:"space-between", marginBottom: 3, marginTop: 3}}>
                <Title tooltip={tooltip} min={min} max={max} keyVal={keyVal}></Title>
                
                <div style={{display: "flex", flexDirection: "row"}}>
        

                    {type === "Number" && disabled !== true && !disableAutomations &&
                       <AutomationIcon onChange={this.props.handleCustomChange} id={_automationId} enabled={_automationEnabled} type={_automationType} ></AutomationIcon>
                    }
                    {this.props.children}
                </div>
            </div> 
        )
    }
}

export default LabeledFieldWrapper

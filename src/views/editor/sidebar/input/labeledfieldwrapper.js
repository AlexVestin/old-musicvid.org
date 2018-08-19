
import React, { PureComponent } from 'react'
import BrightnessAuto from '@material-ui/icons/BrightnessAuto'
import Help from '@material-ui/icons/Help'
import Tooltip from 'material-ui/Tooltip';


const Title = (props) => {
    const autoIconWidth = 18
    const iconMarginTop = 2

    console.log(props.key, props)
    return (
        <div style={{display: "flex", flexDirection: "row"}}>  
                <Tooltip id="tooltip-top-start" title={props.tooltip ? props.tooltip : ""} placement="right-end">
                    <div style={{width: autoIconWidth, height: autoIconWidth}}>
                        <Help style={{ marginTop: iconMarginTop, width: autoIconWidth, height: autoIconWidth, color: "black"}}></Help>                  
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
        let { keyVal, disabled, tooltip, type, disableAutomations } = this.props
        
        return(
            <div key={keyVal} style={{width: "95%", display: "flex", flexDirection: "row", justifyContent:"space-between", marginTop: 10}}>
                <Title tooltip={tooltip} keyVal={keyVal}></Title>
                
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

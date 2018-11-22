
import React, { PureComponent } from 'react'
import CustomInput from './custominput'
//import { connect } from 'react-redux'

const inputContainer = {
    boxSizing: "border-box",
    minWidth: "100%",
    overflow: "hidden",
}


class GroupContent extends PureComponent {
    render() {
        const {group, item} = this.props
        const props = { handleChange: this.props.handleChange, addAutomation: this.props.addAutomation}
        
        return(
            <div style={inputContainer}>
                {group.map((item, index) =>{
                    const config = item
                    const itemProps = { 
                        tooltip: config.tooltip, 
                        keyVal: item.label, 
                        type: config.type, 
                        value: item.value, 
                        disabled: config.disabled, 
                        options: config.options, 
                        min: config.min, 
                        max:config.max, 
                        step: config.step,
                        item:item
                    } 
 
                    return(
                            <CustomInput key={item.id} name={item.type} {...props} {...itemProps}></CustomInput>
                        )
                    }
                )}
            </div>
        )
    }
}


export default GroupContent

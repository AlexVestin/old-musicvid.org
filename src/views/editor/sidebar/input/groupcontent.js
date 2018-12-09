
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
        const {group, item, handleChange, handleCustomChange, addAutomation }  = this.props
        const props = { handleChange, handleCustomChange, addAutomation }
        
        return(
            <div style={inputContainer}>
                {Object.keys(group.items).map((key, index) =>{
                    const config = group.items[key]
                    const itemProps = { 
                        tooltip: config.tooltip, 
                        keyVal: key, 
                        type: config.type, 
                        value: item[key], 
                        disabled: config.disabled, 
                        options: config.options, 
                        min: config.min, 
                        max:config.max, 
                        step: config.step,
                        item:item,
                        _automationEnabled: item[key]._automationEnabled,
                        _automationId: item[key]._automationId,
                        _automationType: item[key]._automationType,
                    } 
                    
                    console.log(itemProps, "sdfkomnsdfpiomsdfop", config);
                    return(
                            <CustomInput key={key} name={item.type} {...props} {...itemProps}></CustomInput>
                        )
                    }
                )}
            </div>
        )
    }
}


export default GroupContent
/*
const mapStateToProps = (state, ownProps) => {
    return {
        item: state.items.items[ownProps.itemId]
    }
}

export default connect (mapStateToProps(GroupContent))
*/
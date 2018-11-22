
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
                        item:item
                    } 
 
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
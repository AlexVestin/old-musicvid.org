
import React, {PureComponent} from 'react'

import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types'

import BrightnessAuto from '@material-ui/icons/BrightnessAuto'
import Help from '@material-ui/icons/Help'

import GroupContainer from './groupcontainer'
import Tooltip from 'material-ui/Tooltip';

const inputStyles = {
    Number: {marginRight: 10, width: 40, minWidth: 40, marginLeft: 5},
    String: { minWidth: "25%", marginRight: 10, marginLeft: 5},
    Link: { width: 50, marginLeft: 10 },
    Boolean: {marginLeft: 10, height: 12, width: 12, marginTop: 5, marginRight: 20 - 6},
    List : {marginRight: 10}
}

const styles = theme => ({
    root: {
      width: '100%'
    }
});


class ConfigList extends PureComponent {
    handleChange = input => event =>  {
        var value = event.target.value
        if(input.type === "Boolean")value = !input.prev
        this.props.edit({key: input.key, value: value })
    }

    render(){
        const { classes } = this.props;
        const defaultConfig = this.props.defaultConfig
        const item = this.props.item

        return(
            <div className={classes.root}>
                {defaultConfig.map(group =>     
                    <GroupContainer label={group.title} key={group.title}>
                            <InputContent item={item} group={group} addAutomation={this.props.addAutomation} handleChange={this.handleChange} ></InputContent>
                    </GroupContainer>
                )}
            </div> 
        )
    }
}

const inputContainer = {
    boxSizing: "border-box",
    minWidth: "100%",
    overflow: "hidden",
    marginBottom: 3
}


class InputContent extends PureComponent {
    render() {
        const {group, item} = this.props

        return(
            <div style={inputContainer}>
                {Object.keys(group.items).map((key, index) =>{
                    const config = group.items[key]
                    const props = {key, keyVal: key, item, config, handleChange: this.props.handleChange, addAutomation: this.props.addAutomation}
                    return(
                        <div key={key} style={{width: "100%"}}>
                            {(config.type === "Number" || config.type ==="String") && <LabeledFieldWrapper {...props}>
                                <input 
                                    onChange={this.props.handleChange({type: config.type, key: key})} 
                                    value={item[key]} 
                                    disabled={config.editable === false}    
                                    style={inputStyles[config.type]}
                                    type={config.type === "Number" ? "number" : "text"}
                            ></input>
                            </LabeledFieldWrapper>}

                            {(config.type === "Link") && <LinkField {...props}></LinkField>}
                            {config.type === "List" && <LabeledFieldWrapper {...props} >
                            <select style={inputStyles[config.type]} value={item.type} onChange={this.props.handleChange({type: config.type, key: key})}>
                                {config.options.map(e => <option key={e}  value={e}>{e}</option>)}
                            </select>

                            </LabeledFieldWrapper>}

                            {(config.type === "Boolean") && 
                            <LabeledFieldWrapper {...props}>
                                <input 
                                    type="checkbox"
                                    checked={item[key]}
                                    onChange={this.props.handleChange({type: config.type, key: key, prev: item[key]})} 
                                    disabled={config.editable === false}    
                                    style={inputStyles[config.type]}>
                                </input>
                            </LabeledFieldWrapper>}
                        </div>
                        )
                    }
                )}
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


class LabeledFieldWrapper extends PureComponent {
    state= { mouseOver: false }

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
                        <div style={{width: autoIconWidth, height: autoIconWidth}}>
                            <Help style={{ marginTop: iconMarginTop, width: autoIconWidth, height: autoIconWidth, color: config.tooltip ? "black" : "gray"}}></Help>                  
                        </div>
                    </Tooltip>
                    <div style={{ marginTop: 4, marginLeft: 5, fontSize: 14 }}>{key}</div>  
                </div>

                <div style={{display: "flex", flexDirection: "row"}}>
                    {config.type === "Number" && config.editable !== false && !config.disableAutomations &&
                        <Tooltip id="tooltip-top-start" title={"Add keyframe track"} placement="right-end">
                            <div style={{width: autoIconWidth, height: autoIconWidth}}>
                                <BrightnessAuto 
                                    onClick={() => this.props.addAutomation(key) }
                                    style={{ marginTop: iconMarginTop,  width: autoIconWidth, height: autoIconWidth, color: this.state.mouseOver ? "gray" : "black" }}
                                    onMouseOver={() => this.setState({mouseOver: true})}
                                    onMouseOut={() => this.setState({mouseOver: false})}    
                                ></BrightnessAuto>
                            </div>
                        </Tooltip>
                    }
                    {this.props.children}
                
                </div>
            </div> 
        )
    }
}

ConfigList.propTypes = {
    classes: PropTypes.object.isRequired,
};
  

export default withStyles(styles)(ConfigList)


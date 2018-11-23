import React, { PureComponent } from 'react'
import Model3D from './3DModels'
import LabeledFieldWrapper from './labeledfieldwrapper'
import {dispatchAction} from '@redux/actions/items'

import ColorPicker from './colorpicker';




const inputStyles = {
    Number: {marginRight: 10, width: 50, minWidth: 50, marginLeft: 5},
    String: { minWidth: "25%", marginRight: 10, marginLeft: 5},
    Link: { width: 50, marginLeft: 10 },
    Boolean: {marginLeft: 10, height: 12, width: 12, marginTop: 5, marginRight: 14},
    List : {marginRight: 10}
}


export default class CustomInput extends PureComponent {
    constructor(props) {
        super(props);

        this.state = { 
            modal3DOpen: false, 
            colorPickerOpen: false, 
            colorAnchorEl: null 
        }
        this.colorPickerRef = React.createRef();
    }


    open3DModal = () => this.setState({modal3DOpen: true})
    close3DModal = () =>  this.setState({modal3DOpen: true}) 
    add3DModel = (item) =>  {
        dispatchAction({type: "UPDATE_ITEM_FILE", payload: {...item, keyVal: this.props.keyVal}})
        this.setState({modal3DOpen: false})
    }

    

    render() {
        const { keyVal, type, value, disabled, options, min, max, step } = this.props
        const key = keyVal

        
        return (
            <div key={key} style={{width: "100%", borderBottom: "1px solid #e0e0e0"}}>
               <Model3D addItem={this.add3DModel} open={this.state.modal3DOpen} handleClose={this.close3DModal}></Model3D>
               {(type === "3DModel") && 
                    <LabeledFieldWrapper {...this.props} >
                        <button onClick={this.open3DModal}>{value}</button>
                    </LabeledFieldWrapper>
                }
                
                {type=== "Color" && 
                    <LabeledFieldWrapper {...this.props}>
                        <ColorPicker type={type} keyVal={key} onChange={this.props.handleChange} onCustomChange={this.props.handleCustomChange} value={value}></ColorPicker>
                    </LabeledFieldWrapper>
                }
                
                {type === "Number" && 
                    <LabeledFieldWrapper {...this.props}>
                        <input 
                            onKeyUp={(event) => event.stopPropagation()} 
                            onChange={this.props.handleChange({type, key, min, max})}
                            value={value} 
                            disabled={disabled === true}   
                            style={inputStyles[type]}
                            type={"number"}
                            min={(min !== undefined) ? min : Number.NEGATIVE_INFINITY}
                            max={(max !== undefined) ? max : Number.POSITIVE_INFINITY}
                            step={step || 1}
                        >
                        </input>
                    </LabeledFieldWrapper>
                }

                {type === "String" &&
                    <LabeledFieldWrapper {...this.props}>
                        <input 
                            onKeyUp={(event) => event.stopPropagation()} 
                            onChange={this.props.handleChange({type, key})}
                            value={value} 
                            disabled={disabled === true}   
                            style={inputStyles[type]}
                            type={"text"}
                        >
                        </input>
                    </LabeledFieldWrapper>
                }

                {(type === "Link") && <LinkField value={value} keyVal={keyVal}></LinkField>}
                {(type === "Text") && <TextField value={value} keyVal={keyVal}></TextField>}
               
                
                {type === "List" && <LabeledFieldWrapper {...this.props} >
                    
                    <select style={inputStyles[type]} value={value} onChange={this.props.handleChange({type: type, key: key})}>
                        {options.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                    </LabeledFieldWrapper>
                }

                {(type === "Boolean") && 
                    <LabeledFieldWrapper {...this.props}>
                        <input 
                            type="checkbox"
                            checked={value}
                            onChange={this.props.handleChange({type: type, key: key, prev: value})} 
                            disabled={disabled === true}    
                            style={inputStyles[type]}>
                        </input>
                    </LabeledFieldWrapper>
                }
            </div>
        )
    }
}


class LinkField extends PureComponent {
    render() {
        return(
            <LabeledFieldWrapper {...this.props}>
                <a href={String(this.props.value)}>Link</a>
            </LabeledFieldWrapper>
        )
    }
}


class TextField extends PureComponent {
    render() {
        return(
            <LabeledFieldWrapper {...this.props}>
                <div style={{marginLeft: 20}}>{this.props.value}</div>
            </LabeledFieldWrapper>
        )
    }
}

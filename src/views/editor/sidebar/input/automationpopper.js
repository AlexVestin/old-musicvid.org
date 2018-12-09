

import React, { PureComponent } from 'react'
import Popper from '@material-ui/core/Popper';
import BrightnessAuto from '@material-ui/icons/BrightnessAuto'
import { connect } from 'react-redux'
import classes from './automationpopper.css'

class AutomationPopper extends PureComponent {

    constructor(props) {
        super(props);

        this.state = { 
            colorPickerOpen: false, 
            colorAnchorEl: null 
        }
        this.colorPickerRef = React.createRef();
    }

    toggleColorPickerOpen = () => this.setState({colorPickerOpen: !this.state.colorPickerOpen});

    handleClick = event => {
        const { currentTarget } = event;
        this.setState(state => ({
            colorAnchorEl: currentTarget,
            colorPickerOpen: !state.colorPickerOpen,
            initialColor: this.props.value
        }));
      };


      handleChangeComplete = (color, event) => {
          const { type, keyVal } = this.props;
          this.props.onCustomChange({type, key:keyVal, value: color.hex.substr(1)});

      };

      onAccept = (color, event) => {
        this.toggleColorPickerOpen()
      }

      onCancel = ( ) => {
        const { type, keyVal } = this.props;
        this.props.onCustomChange({type, key:keyVal, value: this.state.initialColor});
        this.toggleColorPickerOpen();
      }

      onChange = (e) => {
          const idx = e.target.selectedIdx;
          const item = this.props.automations[Object.keys(this.props.automations)[idx]];
          this.props.onChange({type: "Number", key:"_automationId", value: item.id});
          this.props.onChange({type: "Boolean", key:"_automationEnabled", value: true});
      }

    render() {
        const id = this.state.open ? 'simple-popper' : null;
        const iconMarginTop = 2;
        const autoIconWidth = 18;

        return (
            <React.Fragment>
                 <BrightnessAuto 
                    ref={this.colorPickerRef}
                    style={{ marginTop: iconMarginTop,  width: autoIconWidth, height: autoIconWidth, color:"gray"}}
                    onClick={this.handleClick}
                ></BrightnessAuto>
                <Popper
                    id={id}
                    open={this.state.colorPickerOpen}
                    anchorEl={this.state.colorAnchorEl}
                >
                    <div style={{width: 220, height: 120, backgroundColor: "gray"}}>

                        <div className={classes.header}>
                            <select style={{width: 120}} onChange={this.onChange}>
                                {this.props.automations && Object.keys(this.props.automations).map(key => {
                                    let e = this.props.automations[key];
                                    return (
                                        <option key={e.id} value={e.name}>{e.name} </option>
                                    )
                                })}
                            </select>
                            
                            <div>
                                enabled
                                <input value={this.props._automationEnabed} type="checkbox"></input>
                            </div>
                        </div>
                    </div>
                </Popper>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        automations: state.items.automations
    }
}

export default connect(mapStateToProps)(AutomationPopper);
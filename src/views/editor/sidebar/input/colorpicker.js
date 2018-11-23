

import React, { PureComponent } from 'react'
import { PhotoshopPicker  } from 'react-color';
import Popper from '@material-ui/core/Popper';

export default class ColorPicker extends PureComponent {

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

    render() {
        const { type, keyVal } = this.props;
        const id = this.state.open ? 'simple-popper' : null;
        return (
            <React.Fragment>
                <button onClick={this.handleClick} ref={this.colorPickerRef} style={{ backgroundColor: "#"+ this.props.value, cursor: "pointer"}}></button>
                <input style={{width: 70, marginRight: 10, marginLeft: 5}} onChange={this.props.onChange({type, key: keyVal})} value={this.props.value}></input>
                <Popper
                    id={id}
                    open={this.state.colorPickerOpen}
                    anchorEl={this.state.colorAnchorEl}
                >
                    <PhotoshopPicker 
                        disableAlpha
                        color={this.props.value}
                        onChangeComplete={this.handleChangeComplete}
                        onAccept={this.onAccept}
                        onCancel={this.onCancel}
                    />
                </Popper>
            </React.Fragment>
        )
    }

}
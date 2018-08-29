import React, { PureComponent } from 'react'
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

export default class TextInput extends PureComponent {
    state = { value: "" }


    handleChange = (event) => {
        this.setState({value: event.target.value})
    }

    getValue = () => this.state.value

    render() {
        const {type, label, errorMsg } = this.props
        const error = (errorMsg !== "" && errorMsg !== undefined)

        return(

            <FormControl error={error} aria-describedby="name-error-text" className={this.props.className}>
                <InputLabel>{label}</InputLabel>
                <Input onChange={this.handleChange} value={this.state.value} type={type}  />
                {errorMsg !== "" && <FormHelperText id="name-error-text">{errorMsg}</FormHelperText>}
            </FormControl>
        )
    }
}
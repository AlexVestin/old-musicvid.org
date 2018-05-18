import React from 'react';
import ConfigList from './input'
import { connect } from 'react-redux'
import {  setSidebarWindowIndex } from '../../redux/actions/items'
import {  editFFT } from '../../redux/actions/globals'


class FFTSettings extends React.PureComponent {
    back = () => {
        this.props.onBack()
    }

    handleChange = input => event => {
        var value = event.target.value
        editFFT({key: input.key, value: value})
    }

    addAutomation = (key) => {
        console.log("add global automations")
    }

    render() {
        const item = this.props.fftSettings
        const defaultConfig = item.defaultConfig;
        return (
            <ConfigList 
                handleChange={this.handleChange} 
                defaultConfig={defaultConfig} 
                item={item} 
                addAutomation={this.addAutomation}
                onBack={this.back}>
            </ConfigList>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        fftSettings: state.globals.fftSettings
    }
}

export default connect(mapStateToProps)(FFTSettings)
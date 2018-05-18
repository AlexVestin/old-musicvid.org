import React from 'react';
import ConfigList from '../input'
import { connect } from 'react-redux'
import { editEffect, setSidebarWindowIndex, removeEffect } from '../../../redux/actions/items'


class Effect extends React.PureComponent {
    back = () => {
        setSidebarWindowIndex(this.props.idxs.EFFECTS)
    }

    handleChange = input => event => {
        var value = event.target.value
        if(input.type === "Number")value = isNaN(value) ? 0 : Number(value)
        editEffect({key: input.key, value})
    }

    removeItem = () => {
        removeEffect(this.props.selectedLayer.selectedEffect)
    }

    render() {
        const {  passes, effectId } = this.props
        const item = passes.find(e => e.id == effectId)
        const defaultConfig = item.defaultConfig;
        return (
            <ConfigList 
                handleChange={this.handleChange} 
                defaultConfig={defaultConfig} 
                item={item} 
                onDelete={this.removeItem} 
                onBack={this.back}>
            </ConfigList>
        );
    }
}

const mapStateToProps = state => {
    return {
        passes: state.items.passes[state.items.selectedLayerId],
        effectId: state.items.effectId,
    }
}

export default connect(mapStateToProps)(Effect)
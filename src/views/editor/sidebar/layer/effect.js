import React from 'react';
import ConfigList from '../input/input'
import { connect } from 'react-redux'
import { editEffect, setSidebarWindowIndex, removeEffect } from '@redux/actions/items'

class Effect extends React.PureComponent {
    back = () => {
        setSidebarWindowIndex(this.props.idxs.EFFECTS)
    }

    removeItem = () => {
        removeEffect(this.props.selectedLayer.selectedEffect)
    }

    render() {
        const {  passes, effectId } = this.props
        const item = passes.find(e => e.id === effectId)
        const defaultConfig = item.defaultConfig;
        
        return (
            

            <ConfigList 
                handleChange={this.handleChange} 
                defaultConfig={defaultConfig} 
                item={item} 
                edit={editEffect}
                onDelete={this.removeItem} 
                onBack={this.back}>
            </ConfigList>
        );
    }
}

const mapStateToProps = state => {
    return {
        passes: state.items.passes,
        effectId: state.items.effectId,
    }
}

export default connect(mapStateToProps)(Effect)
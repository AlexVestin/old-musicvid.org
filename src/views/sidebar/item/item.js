import React from 'react';
import ConfigList from '../input'
import { connect } from 'react-redux'
import { editItem, setSidebarWindowIndex, removeItem } from '../../../redux/actions/items'


class Item extends React.PureComponent {
    back = () => {
        setSidebarWindowIndex(this.props.idxs.ITEMS)
    }

    handleChange = input => event => {
        var value = event.target.value
        if(input.type === "Number")value=isNaN(value) ? 0 : Number(value)
        editItem({key: input.key, value })
    }

    removeItem = () => {
        removeItem(this.props.selectedItem)
    }

    render() {
        const item = this.props.selectedItem
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
        selectedItem: state.items.selectedItem
    }
}

export default connect(mapStateToProps)(Item)
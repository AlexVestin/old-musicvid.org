import React from 'react';
import ConfigList from '../input'
import { connect } from 'react-redux'
import { editItem, setSidebarWindowIndex, removeItem, addAutomation } from '../../../redux/actions/items'

class Item extends React.PureComponent {
    back = () => {
        setSidebarWindowIndex(this.props.idxs.ITEMS)
    }

    handleChange = input => event => {
        var value = event.target.value
        editItem({key: input.key, value: value})
    }

    removeItem = () => {
        removeItem(this.props.selectedItem)
    }

    addAutomation = (key) => {
        addAutomation(key)
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
                addAutomation={this.addAutomation}
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
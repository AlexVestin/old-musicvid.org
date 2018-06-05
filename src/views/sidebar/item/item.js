import React from 'react';
import ConfigList from '../input'
import { connect } from 'react-redux'
import { editItem, setSidebarWindowIndex, removeItem, addAutomation } from '../../../redux/actions/items'

class Item extends React.PureComponent {
    back = () => {
        setSidebarWindowIndex(this.props.idxs.ITEMS)
    }

    removeItem = () => {
        removeItem({id: this.props.selectedItem.id, type: this.props.selectedItem.type})
    }

    addAutomation = (key) => {
        const {selectedItem} = this.props 
        const point = {time: selectedItem.start, value: selectedItem[key], id: Math.floor(Math.random() * 1000000)}
        const automation = {name: key, points: [point], interpolationPoints: [], id: Math.floor(Math.random() * 1000000) }
        addAutomation({key, automation})
    }

    render() {
        const item = this.props.selectedItem
        const defaultConfig = item.defaultConfig;
        return (
            <div>
                
                <ConfigList 
                    edit={editItem} 
                    defaultConfig={defaultConfig} 
                    item={item} 
                    onDelete={this.removeItem} 
                    addAutomation={this.addAutomation}>
                </ConfigList>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        selectedItem: state.items.items[state.items.selectedLayerId][state.items.selectedItemId],
        items: state.items.items
    }
}

export default connect(mapStateToProps)(Item)
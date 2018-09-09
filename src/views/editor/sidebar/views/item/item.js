import React from 'react';
import ConfigList from '../../input/input'
import { connect } from 'react-redux'
import { editItem, setSidebarWindowIndex, removeItem, addAutomation } from '@redux/actions/items'
import withHeader from '../../HOC/withheader'
import NameInput from '../layer/nameinput'

class Item extends React.PureComponent {
    back = () => {
        setSidebarWindowIndex(this.props.idxs.LAYER)
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
    editName =  event => {
        editItem({key: "name", value: event.target.value})
    }

    onDelete = () => {
        removeItem(this.props.selectedItem)
    }

    render() {
        const item = this.props.selectedItem
        const defaultConfig = item.defaultConfig;

        return (
            <div style={{ height: "calc(100% - 30px)", overflowX: "hidden"}}>
                <div style={{flexGrow: 1, height: "100%", overflowY: "scroll", overflowX: "hidden"}}>
                <NameInput value={item.name} edit={this.editName} onDelete={this.removeItem}></NameInput>
                    
                <ConfigList 
                    edit={editItem} 
                    defaultConfig={defaultConfig} 
                    item={item} 
                    onDelete={this.removeItem} 
                    addAutomation={this.addAutomation}>
                </ConfigList>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        selectedItem: state.items.items[state.items.selectedLayerId][state.items.selectedItemId],
        items: state.items.items,
        layer: state.items.layers[state.items.selectedLayerId]
    }
}

export default connect(mapStateToProps)(withHeader(Item))
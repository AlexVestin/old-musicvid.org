import React from 'react';
import ConfigList from '../input'
import { connect } from 'react-redux'
import { editItem, setSidebarWindowIndex, removeItem, addAutomation } from '@redux/actions/items'

import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import AppBar from 'material-ui/AppBar'

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

    render() {
        const item = this.props.selectedItem
        const defaultConfig = item.defaultConfig;

        return (
            <div>
                 <AppBar position="static" style={{display: "flex" , flexDirection: "row", backgroundColor: "#676767", height: 30, minHeight: 30, width: "100%", margin: 0, textAlign: "center"}}>
                    <div style={{minWidth: 20, minHeight: 20, marginTop: 3}}>
                        <KeyboardArrowLeft onClick={this.back} ></KeyboardArrowLeft>
                    </div>
                    <div style={{marginTop: 3, height: 12}}>{this.props.layer.name + " - " + item.name} </div>
                </AppBar>

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
        items: state.items.items,
        layer: state.items.layers[state.items.selectedLayerId]
    }
}

export default connect(mapStateToProps)(Item)
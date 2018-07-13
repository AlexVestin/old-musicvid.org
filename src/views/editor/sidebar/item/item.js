import React from 'react';
import ConfigList from '../input'
import { connect } from 'react-redux'
import { editItem, setSidebarWindowIndex, removeItem, addAutomation } from '@redux/actions/items'
import withHeader from '../withheader'
import Delete from '@material-ui/icons/Delete'


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

    onDelete = () => {
        removeItem(this.props.selectedItem)
    }

    render() {
        const item = this.props.selectedItem
        const defaultConfig = item.defaultConfig;

        return (
            <div style={{ height: "calc(100% - 30px)"}}>
                <div style={{flexGrow: 1, height: "100%", overflowY: "scroll"}}>
                    <div style={{height: 28, width: "100%", display:"flex", flexDirection: "row", justifyContent: "space-between", backgroundColor: "#AAA"}}> 
                        {item.name} 
                                                    
                        <div style={{color:"#F50057", minWidth: 10, minHeight: 10 }}>
                            <Delete onClick={this.onDelete}  style={{cursor: "pointer"}}></Delete>
                        </div>
                    </div>
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
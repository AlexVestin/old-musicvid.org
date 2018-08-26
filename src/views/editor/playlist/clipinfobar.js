import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import ClipItem from './clipitem'

class ClipInfoBar extends PureComponent {

    render(){
        const {items, layers} = this.props
        let allItems = []

        Object.keys(layers).forEach(layerId =>  {
            const layer = layers[layerId]
            
            layer.items.forEach(itemId => {
                allItems = [...allItems, items[layerId][itemId]] 
            })
        })

        allItems = [...allItems, ...this.props.audioItems].sort((a, b) => a.index - b.index )

        return (
            <div style={{width: "100%"}} draggable="false">
                <div style={{position: "absolute", width: "20%", height: "100%", backgroundColor: "#434343"}}></div>
                {items && allItems.map((item, index) => 
                      <ClipItem key={item.id} info={this.props.info} item={item} index={index}></ClipItem>
                )}
            </div>
        )
    }
}
const mapStateToProps2 = (state, ownProps) => {
    return {
        items: state.items.items,
        audioItems: state.items.audioItems,
        layers: state.items.layers
    }
}
export default connect(mapStateToProps2)(ClipInfoBar)





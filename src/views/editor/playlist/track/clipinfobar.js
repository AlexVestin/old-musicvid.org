import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import ClipItem from './track'

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
        let tracks = []
        for(var i = 0; i < 20; i++) 
            tracks.push(allItems[i] || null)
        
        console.log(tracks)

        return (
            <div style={{width: "100%"}} draggable="false">
                <div style={{position: "absolute", width: "20%", height: "100%", backgroundColor: "#434343"}}></div>
                <div style={{height: 1}}></div>
                {items && tracks.map((item, index) => 
                      <ClipItem key={index} info={this.props.info} item={allItems[index]} index={index}></ClipItem>
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





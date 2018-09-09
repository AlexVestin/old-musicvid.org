

import React, { PureComponent} from 'react'
import {connect} from 'react-redux'

import { removeItem } from "@redux/actions/items"
import Effect from './effect'
import NewEffect from './neweffect'
import AddResourceOptions from '../item/newitem'
import AddResourceOptions2D from '../item/newitem2d'
import Layer from './layer'
import Item from '../item/item'
import AudioReactiveTypeList from '../item/audioreactivetypes'

class LayerContainer extends PureComponent {
    render() { 
        const  { index, idxs, selectedItemId, items, layer } = this.props
        let itemName = ""
        if(index === idxs.ITEM)
            itemName = items[selectedItemId].name

        return (
            <div style={{height: "100%", overflow: "hidden"}}>
                {index === idxs.LAYER && <Layer layerName={layer.name} idxs={idxs} idx={idxs.LAYER} backIdx={idxs.LAYERS}></Layer>}
                {index === idxs.NEWEFFECT && <NewEffect idxs={idxs} idx={idxs.NEWEFFECT} backIdx={idxs.LAYERS}></NewEffect>}
                {index === idxs.EFFECT && <Effect idxs={idxs} idx={idxs.EFFECT} backIdx={idxs.LAYERS}></Effect>}
                {index === idxs.ADDRESOURCEOPTIONS && <AddResourceOptions idx={idxs.ADDRESOURCEOPTIONS} layerName={layer.name} idxs={idxs} backIdx={idxs.LAYER}></AddResourceOptions>}
                {index === idxs.ADDRESOURCEOPTIONS2D && <AddResourceOptions2D idx={idxs.ADDRESOURCEOPTIONS} layerName={layer.name} idxs={idxs} backIdx={idxs.LAYER}></AddResourceOptions2D>}
                {index === idxs.AUDIOREACTIVETYPELIST && <AudioReactiveTypeList idx={idxs.AUDIOREACTIVETYPELIST} layerName={layer.name} backIdx={idxs.LAYER} idxs={idxs}></AudioReactiveTypeList>}
                {index === idxs.ITEM && <Item onDelete={removeItem} itemName={itemName} layerName={layer.name} idxs={idxs} backIdx={idxs.LAYER} idx={idxs.ITEM}></Item>}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        index: state.items.sideBarWindowIndex,
        items: state.items.items[state.items.selectedLayerId],
        layer: state.items.layers[state.items.selectedLayerId],
        selectedItemId: state.items.selectedItemId
    }
}

export default connect(mapStateToProps)(LayerContainer)
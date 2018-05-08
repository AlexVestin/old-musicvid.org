
import SidebarContainer from '../../views/sidebar/sidebarcontainer'
import { selectEffect } from '../actions/items';

export default function itemsReducer(state = {
    items: [],
    selectedItem: null,
    lastAction: "",
    sideBarWindowIndex: 0,
    layers: [],
    selectedLayer: {},
    audioInfo: null,
    renderTargets:  [],
    selectedRenderTarget: null,
    createEffect: null
    }, action){
        var idx, scene;
        switch(action.type){   

            case "REMOVE_EFFECT":
                scene = state.layers.find(e => e.id === state.selectedLayer.id)
                idx = state.layers.findIndex(e => e.id === state.selectedLayer.id)
                const nscene = {...scene,  selectedEffect: action.payload, passes: scene.passes.filter(e => e.id !== action.payload.id)}
                const nscenes = [...state.layers.slice(0, idx), nscene, ...state.layers.slice(idx+1)]
                return {...state, layers: nscenes, selectedLayer: nscene, sideBarWindowIndex: SidebarContainer.INDEXES.EFFECTS}
            case "ADD_EFFECT": 
                idx = state.layers.findIndex(e => e.id === state.selectedLayer.id)
                const lay = state.layers[idx]
                var fg =  {...lay, passes: [...lay.passes, action.payload], selectedEffect: action.payload }
                return {...state, selectedLayer: fg, layers: [...state.layers.slice(0, idx), fg, ...state.layers.slice(idx+1)], sideBarWindowIndex: SidebarContainer.INDEXES.EFFECT}
            case "CREATE_EFFECT":   
                return {...state, createEffect: action.payload} 
            case "EDIT_EFFECT":
                idx = state.selectedLayer.passes.findIndex(e => e.id === state.selectedLayer.selectedEffect.id)
                const updatedEffect  = Object.assign({}, state.selectedLayer.selectedEffect, {
                    ...state.selectedLayer.selectedEffect,
                    [action.payload.key]: action.payload.value
                }) 
                const passes = state.selectedLayer.passes
                const ns = {
                    ...state.selectedLayer, 
                    passes: [...passes.slice(0, idx), updatedEffect, ...passes.slice(idx+1)],
                    selectedEffect: updatedEffect
                }
                return {...state, selectedLayer: ns}
            case "SELECT_EFFECT":
                const newSelectedLayer = {...state.selectedLayer, selectedEffect: action.payload}
                return {...state, selectedLayer: newSelectedLayer, sideBarWindowIndex: SidebarContainer.INDEXES.EFFECT}
            case "REMOVE_AUDIO":
                return {...state, audioInfo: null, sideBarWindowIndex: SidebarContainer.INDEXES.AUDIO}
            case "ADD_SOUND": 
                return {...state, audioInfo: action.payload}
            case "ADD_LAYER":
                return {...state, layers: [...state.layers, action.payload], selectedLayer: action.payload}
            case "SELECT_LAYER":
                return {...state, selectedLayer: action.payload, sideBarWindowIndex: SidebarContainer.INDEXES.LAYER}
            case "SET_SIDEBAR_WINDOW_INDEX":
                return {...state, sideBarWindowIndex: action.payload}
            case "SELECT_ITEM":
                const item = state.items.find((e) => action.payload.id === e.id)
                const layer = state.layers.find((e) => action.payload.sceneId === e.id)
                return {...state, selectedItem: item, sideBarWindowIndex: SidebarContainer.INDEXES.ITEM, selectedLayer: layer}
            case "CREATE_ITEM":
                return {...state, selectedItem: action.payload}
            case "ADD_ITEM":
                return {...state, selectedItem: action.payload, items: [...state.items, action.payload],  sideBarWindowIndex: SidebarContainer.INDEXES.ITEM}
            case "REMOVE_ITEM":
                let index = state.items.findIndex((e) => state.selectedItem.name === e.name)
                return {...state, items: state.items.filter((_, i) => i !== index), sideBarWindowIndex: SidebarContainer.INDEXES.ITEMS}
            case "EDIT_SELECTED_ITEM": 
                const updatedItem = Object.assign({}, state.selectedItem, {
                    ...state.selectedItem,
                    [action.key]: action.value
                })

                idx = state.items.findIndex((e) => state.selectedItem.id === e.id)
                const prevState = [...state.items]
                const items = [...prevState.slice(0,idx), updatedItem, ...prevState.slice(idx+1)]
                return {
                    ...state,
                    items: items, 
                    selectedItem: updatedItem
                }
            default:
                return state;
        }
}
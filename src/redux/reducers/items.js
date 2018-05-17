
import SidebarContainer from '../../views/sidebar/sidebarcontainer'
import update from 'immutability-helper'

export default function itemsReducer(state = {
    layers: {}, // scenes
    passes: {},
    items: {},
    automations: {},
    
    cameras: {},
    controls: {},
    audioInfo: null,
    sideBarWindowIndex: 0,
    selectedItemId: 0,
    selectedLayerId: 0,
    audioItems: [],
    createEffect: null,
    itemIdx: 0,
    audioIDx: 0,
    audioItemView: false
    
    }, action){

        var items, passes, layers, automations, id, idx, key, cameras, audioItems
        switch(action.type){  
            case "EDIT_CAMERA": 
                cameras =  update(state.cameras, {[state.selectedLayerId]: {[action.payload.key]: {$set: action.payload.value}}})
                return {...state, cameras}
            case "REPLACE_CAMERA":
                cameras =  update(state.cameras, {[state.selectedLayerId]: {$set: action.payload }})
                return {...state, cameras}
            case "EDIT_AUTOMATION_POINT":
                key = action.payload.key
                idx =  state.automations[state.selectedItemId].findIndex(e => e.name === key)
                const pointIdx  = state.automations[state.selectedItemId][idx].points.findIndex(e => e.id === action.payload.id)
                const newPoint = {time: action.payload.time, id: action.payload.id, value: action.payload.value}
                //TODO fix nesting
                automations = update(state.automations, {[state.selectedItemId]: {[idx]: {points: {[pointIdx]: {$set: newPoint }}}}})
                return {...state, automations}
            case "ADD_AUTOMATION_POINT":
                key = action.payload.key
                idx =  state.automations[state.selectedItemId].findIndex(e => e.name === key)
                automations = update(state.automations, {[state.selectedItemId]:  {[idx]: {points: {$push: [action.payload.point] }}}})
                return {...state, automations}
            case "ADD_AUTOMATION":
                id = action.payload.automation.id
                automations = update(state.automations, {[state.selectedItemId]:  {$push: [action.payload.automation] }})
                items       = update(state.items,       {[state.selectedLayerId]: {[state.selectedItemId]: {automations: {$push: [id]}}}})
                return {...state, automations, items}
            case "REMOVE_EFFECT":
                return state
            case "ADD_EFFECT":
                return state
            case "CREATE_EFFECT":
                return state
            case "EDIT_EFFECT":
                return state
            case "SELECT_EFFECT":
                return state
            case "REMOVE_SOUND":
                idx         = state.audioItems.findIndex(e => e.id === action.payload) 
                audioItems  = [...state.audioItems.slice(0, idx), ...state.audioItems.slice(idx+1)]
                return {...state, audioItems, sideBarWindowIndex: SidebarContainer.INDEXES.AUDIO, audioItemView: false}
            case "CREATE_SOUND":
                return {...state, audioInfo: action.payload}
            case "ADD_SOUND": 
                audioItems  = update(state.audioItems, {$push: [{...action.payload, index: state.itemIdx}]})
                return {...state, audioInfo: action.payload, audioItems, itemIdx: state.itemIdx + 1}
            case "ADD_LAYER":
                id      = action.payload.id
                items   = update(state.items,  {[id]: {$set: {}}})
                passes  = update(state.passes, {[id]: {$set: {}}})
                layers  = update(state.layers,  {[id]: {$set: {...action.payload, items: [], passes: [], camera: undefined }}})
                cameras = update(state.cameras, {[id]: {$set: action.payload.camera }})
                return {...state, items, layers, passes, cameras, selectedLayerId: id}
            case "SELECT_LAYER":
                return {...state, sideBarWindowIndex: SidebarContainer.INDEXES.LAYER, selectedLayerId: action.payload }
            case "SET_SIDEBAR_WINDOW_INDEX":
                return {...state, sideBarWindowIndex: action.payload }
            case "SELECT_ITEM":
                return {...state, selectedItemId: action.payload.itemId, selectedLayerId: action.payload.layerId, sideBarWindowIndex: SidebarContainer.INDEXES.ITEM}
            case "ADD_ITEM":
                id          = action.payload.id
                items       = update(state.items,  {[state.selectedLayerId]: {[id]: {$set: {...action.payload, index: state.itemIdx}}}})
                layers      = update(state.layers, {[state.selectedLayerId]: {items: {$push: [id]}}})
                automations = update(state.automations, {[id]: {$set: [] }}) 
                return {...state, items, layers, automations, selectedItemId: id, sideBarWindowIndex: SidebarContainer.INDEXES.ITEM, itemIdx: state.itemIdx + 1}
            case "REMOVE_ITEM":
                idx     = state.layers[state.selectedLayerId].items.findIndex(e => e.id === action.payload.id)
                items   = update(state.items,  {[state.selectedLayerId]: {$unset: [action.payload.id]}})  
                layers  = update(state.layers, {[state.selectedLayerId]: {items: {$splice: [[idx, 1]]}}})

                return {...state, items, layers, selectedItemId: -1, sideBarWindowIndex: SidebarContainer.INDEXES.ITEMS}
            case "UPDATE_ITEM_CONFIG":
                const newItem = {...state.items[action.payload.sceneId][action.payload.id], ...action.payload}
                items   = update(state.items, {[action.payload.sceneId]: {[action.payload.id]: {$set: newItem }}})
                return {...state, items}
            case "SET_AUDIO_WINDOW":
                return {...state, audioItemView: action.payload}
            case "SELECT_AUDIO_ITEM": 
                idx = state.audioItems.findIndex(e => e.id === action.payload.itemId)
                return {...state, audioIdx: idx, sideBarWindowIndex: SidebarContainer.INDEXES.AUDIO, audioItemView: true}
            case "EDIT_AUDIO_ITEM": 
                var value = action.value
                if(action.key === "offsetLeft")
                    value +=  state.audioItems[state.audioIdx].offsetLeft
                
                audioItems   = update(state.audioItems, {[state.audioIdx]: {[action.key]: {$set: value}}} )
                return {...state, audioItems}
            case "EDIT_SELECTED_ITEM":
                value = action.value
                if(action.key === "offsetLeft")
                    value +=  state.items[state.selectedLayerId][state.selectedItemId].offsetLeft
                
                items   = update(state.items, {[state.selectedLayerId]: {[state.selectedItemId]: {[action.key]: {$set: value}}}} )
                return {...state, items}
            default:
                return state;
        }
}
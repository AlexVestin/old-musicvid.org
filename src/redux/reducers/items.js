
import SidebarContainer from '../../views/sidebar/sidebarcontainer'
import update from 'immutability-helper'

export default function itemsReducer(state = {
    layers: {}, // scenes
    passes: {},
    items: {},
    automations: {},
    
    
    audioInfo: null,
    sideBarWindowIndex: 0,
    selectedItemId: 0,
    selectedLayerId: 0,
    
    tempInfoHolder: {},
    createEffect: null
    }, action){

        var items, passes, layers, automations, id, idx, key
        console.log(action.type)
        switch(action.type){  
            case "EDIT_AUTOMATION_POINT":
                key = action.payload.key
                
                idx =  state.automations[state.selectedItemId].findIndex(e => e.name === key)
                const pointIdx  = state.automations[state.selectedItemId][idx].points.findIndex(e => e.id === action.payload.id)
                const newPoint = {time: action.payload.time, id: action.payload.id, value: action.payload.value}
                //TODO fix nesting
                automations = update(state.automations, {[state.selectedItemId]: {[idx]: {points: {[pointIdx]: {$set: newPoint }}}}})

                console.log(automations)
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
            case "REMOVE_AUDIO":
            return {...state, audioInfo: null, sideBarWindowIndex: SidebarContainer.INDEXES.AUDIO}
            case "ADD_SOUND":
                return {...state, audioInfo: action.payload}
            case "ADD_LAYER":
                id      = action.payload.id
                items   = update(state.items,  {[id]: {$set: {}}})
                passes  = update(state.passes, {[id]: {$set: {}}})
                layers  = update(state.layers, {[id]: {$set: {...action.payload, items: [], passes: [] }}})
                return {...state, items, layers, passes, selectedLayerId: id}
            case "SELECT_LAYER":
                return {...state, sideBarWindowIndex: SidebarContainer.INDEXES.LAYER, selectedLayerId: action.payload }
            case "SET_SIDEBAR_WINDOW_INDEX":
                return {...state, sideBarWindowIndex: action.payload }
            case "SELECT_ITEM":
                return {...state, selectedItemId: action.payload}
            case "CREATE_ITEM":
                return {...state, tempInfoHolder: action.payload}
            case "ADD_ITEM":
                id          = action.payload.id
                items       = update(state.items,  {[state.selectedLayerId]: {[id]: {$set: action.payload}}})
                layers      = update(state.layers, {[state.selectedLayerId]: {items: {$push: [id]}}})
                automations = update(state.automations, {[id]: {$set: [] }}) 
                return {...state, items, layers, automations, selectedItemId: id, sideBarWindowIndex: SidebarContainer.INDEXES.ITEM}
            case "REMOVE_ITEM":
                idx     = state.layers[state.selectedLayerId].items.findIndex(e => e.id === action.payload.id)
                items   = update(state.items,  {[state.selectedLayerId]: {$unset: [action.payload.id]}})  
                layers  = update(state.layers, {[state.selectedLayerId]: {items: {$splice: [[idx, 1]]}}})
                return {...state, items, layers, selectedItemId: -1, sideBarWindowIndex: SidebarContainer.INDEXES.ITEMS}
            case "UPDATE_ITEM_CONFIG":
                return state
            case "EDIT_SELECTED_ITEM":
                items   = update(state.items, {[state.selectedLayerId]: {[state.selectedItemId]: {[action.key]: {$set: action.value}}}} )
                return {...state, items}
            default:
                return state;
        }
}
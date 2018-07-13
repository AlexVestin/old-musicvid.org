
import SidebarContainer from '@/views/editor/sidebar/sidebarcontainer'
import update from 'immutability-helper'

export default function itemsReducer(state = {
    layers: {}, // scenes
    passes: {},
    items: {},
    automations: {},
    cameras: {},
    controls: {},
    fog: {},
    audioInfo: null,
    sideBarWindowIndex: 0,
    selectedItemId: 0,
    selectedLayerId: 0,
    audioItems: [],
    createEffect: null,
    itemIdx: 0,
    audioIDx: 0,
    audioItemView: 0,
    effectId: 0,
    postProcessingEnabled: false,
    initialized: false,
    
    }, action){

        var items, passes, layers, automations, id, idx, key, cameras, audioItems, controls, fog
        switch(action.type){  
            case "EDIT_FOG": 
                fog =  update(state.fog, {[state.selectedLayerId]: {[action.payload.key]: {$set: action.payload.value}}})
                return { ...state, fog }
            case "SET_POST_PROCESSING_ENABLED":
                return {...state, postProcessingEnabled: action.payload}
            case "EDIT_CAMERA": 
                cameras =  update(state.cameras, {[state.selectedLayerId]: {[action.payload.key]: {$set: action.payload.value}}})
                return {...state, cameras}
            case "EDIT_CONTROLS": 
                controls =  update(state.controls, {[state.selectedLayerId]: {[action.payload.key]: {$set: action.payload.value}}})
                return {...state, controls}
            case "REPLACE_CONTROLS":
                controls = update(state.controls, {[state.selectedLayerId]: { $set: action.payload }})
                return {...state, controls}
            case "REPLACE_CAMERA":
                cameras =  update(state.cameras, {[state.selectedLayerId]: { $set: action.payload }})
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

                const lId = state.selectedLayerId
                idx = state.passes[state.selectedLayerId].findIndex(e => e.id === action.payload.id)
                //passes = [...state.passes[state.selectedLayerId].slice(0, idx), ...state.passes[state.selectedLayerId].slice(idx+1)]
                passes =    update(state.passes, {[lId]: {$splice: [[idx, 1]]  }})
                layers =    update(state.layers, {[lId]: {passes: {$splice: [[idx, 1]] }}})
                return {...state, layers, passes}
            case "ADD_EFFECT":
                passes       = update(state.passes, {[state.selectedLayerId]: {$push: [action.payload] }})
                layers       = update(state.layers, {[state.selectedLayerId]: {passes: {$push: [action.payload.id]}}})
                return {...state, layers, passes, sideBarWindowIndex: SidebarContainer.INDEXES.EFFECT, effectId: action.payload.id} 

            case "EDIT_EFFECT":
                idx = state.passes[state.selectedLayerId].findIndex(e => e.id === state.effectId)
                const pass = state.passes[state.selectedLayerId][idx]                
                passes   = update(state.passes, {[state.selectedLayerId]: {$splice: [[idx, 1, {...pass, [action.payload.key]: action.payload.value}]] }})
                return {...state, passes }
            case "SELECT_EFFECT":
                return { ...state, effectId: action.payload, sideBarWindowIndex: SidebarContainer.INDEXES.EFFECT }
            case "REMOVE_SOUND":
                idx         = state.audioItems.findIndex(e => e.id === action.payload) 
                audioItems  = [...state.audioItems.slice(0, idx), ...state.audioItems.slice(idx+1)]
                return {...state, audioItems, sideBarWindowIndex: SidebarContainer.INDEXES.AUDIO, audioItemView: 0}
            case "CREATE_SOUND":
                return {...state, audioInfo: action.payload}
            case "ADD_SOUND": 
                audioItems  = update(state.audioItems, {$push: [{...action.payload, index: state.itemIdx}]})
                return {...state, audioInfo: action.payload, audioItems, itemIdx: state.itemIdx + 1}
            case "ADD_LAYER":
                id          = action.payload.id
                items       = update(state.items,  {[id]: {$set: {} }})
                passes      = update(state.passes, {[id]: {$set: [] }})
                
                layers      = update(state.layers,  {[id]: 
                                {$set: {...action.payload,  
                                    items: [], passes: [], camera: action.payload.camera.id, 
                                    controls: action.payload.controls.id, fog: action.payload.fog.id }}})

                cameras     = update(state.cameras, {[id]: {$set: action.payload.camera }} )
                controls    = update(state.controls, {[id]: {$set: action.payload.controls }} )
                fog         = update(state.fog,  {[id]: {$set: action.payload.fog }} )
                return {...state, items, layers, passes, cameras, controls, fog, selectedLayerId: id }
            case "SELECT_LAYER":
                return {...state, sideBarWindowIndex: SidebarContainer.INDEXES.LAYER, selectedLayerId: action.payload }
            case "SET_SIDEBAR_WINDOW_INDEX":
                return {...state, sideBarWindowIndex: action.payload }
            case "SELECT_ITEM":
                return {...state, selectedItemId: action.payload.itemId, selectedLayerId: action.payload.layerId, sideBarWindowIndex: SidebarContainer.INDEXES.ITEM }
            case "ADD_ITEM":
                id          = action.payload.id
                items       = update(state.items,  {[state.selectedLayerId]: {[id]: {$set: {...action.payload, index: state.itemIdx}}}})
                layers      = update(state.layers, {[state.selectedLayerId]: {items: {$push: [id]}}})
                automations = update(state.automations, {[id]: {$set: [] }}) 
                return {...state, items, layers, automations, selectedItemId: id, sideBarWindowIndex: SidebarContainer.INDEXES.ITEM, itemIdx: state.itemIdx + 1}
            case "REMOVE_ITEM":
                console.log(action.payload)
                console.log("????", state.items)
                idx     = state.layers[state.selectedLayerId].items.findIndex(e => e.id === action.payload.id)
                items   = update(state.items,  {[state.selectedLayerId]: {$unset: [action.payload.id]}})  
                layers  = update(state.layers, {[state.selectedLayerId]: {items: {$splice: [[idx, 1]]}}})

                console.log(".....", items)
                return {...state, items, layers, selectedItemId: -1, sideBarWindowIndex: SidebarContainer.INDEXES.LAYER}
            case "UPDATE_ITEM_CONFIG":
                const newItem = {...state.items[action.payload.sceneId][action.payload.id], ...action.payload}
                items   = update(state.items, {[action.payload.sceneId]: {[action.payload.id]: {$set: newItem }}})
                return {...state, items}
            case "SET_AUDIO_WINDOW":
                return {...state, audioItemView: action.payload}
            case "SELECT_AUDIO_ITEM": 
                idx = state.audioItems.findIndex(e => e.id === action.payload.itemId)
                return {...state, audioIdx: idx, sideBarWindowIndex: SidebarContainer.INDEXES.AUDIO, audioItemView: 1}
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
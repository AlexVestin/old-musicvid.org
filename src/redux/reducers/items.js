
import indices from '@/views/editor/sidebar/indices'
import update from 'immutability-helper'


const baseSettings  = {
    layers: {}, // scenes
    passes: [],
    items: {},
    automations: {},
    automationIdx: 0,
    selectedAutomation: null,
    cameras: {},
    controls: {},
    fog: {},
    settings: {},
    audioInfo: null,
    sideBarWindowIndex: 0,
    selectedItemId: 0,
    selectedLayerId: 0,
    audioItems: [],
    createEffect: null,
    itemIdx: 0,
    audioIdx: 0,
    audioItemView: 0,
    effectId: 0,
    initialized: false,
    loadFromFile: false,
    masterSettings: { defaultConfig: [] }
}

export default function itemsReducer(state = baseSettings, action){
        var items, passes, layers, automations, id, idx, key, cameras, audioItems, controls, fog, settings, newItem, pointId
        switch(action.type){  

            case "REMOVE_AUTOMATION_POINT":
                id = action.payload.id;
                key= action.payload.key;
                idx = state.automations[id].points.findIndex(e => e.id === action.payload.pointId)
                state.automations[id].points.forEach(e =>{if(e.id === action.payload.pointId) console.log("FOUND")})
                automations = update(state.automations, {[id]: {points: {$splice: [[idx, 1]]}}})
                return {...state, automations}
            case "ADD_AUTOMATION_POINT":
                id = action.payload.id;
                key= action.payload.key;
                automations = update(state.automations, {[id]: {points: {$push: [{time: action.payload.time, value: 0, id: action.payload.pointId}]}}})
                return {...state, automations}
            case "EDIT_AUTOMATION_POINT":
                id = action.payload.id;
                key= action.payload.key;
                pointId = action.payload.pointId;
                idx = state.automations[id].points.findIndex(e => e.id === action.payload.pointId)
                automations = update(state.automations, {[id]: {points: {[idx]: {[key]: {$set: action.payload.value}} }}})
                return {...state, automations}
            case "EDIT_AUTOMATION":
                id = action.payload.id;
                key= action.payload.key;
                automations = update(state.automations, {[id]: {[key]: {$set: action.payload.value}}})
                return {...state, automations}
            case "SET_SELECTED_AUTOMATION":
                return {...state, selectedAutomation: action.payload, automationIdx: 1}
            case "SET_AUTOMATION_IDX":
                return {...state, automationIdx: action.payload}
            case "ADD_AUTOMATION":
                let au = {type: "Points", points: [], name: "New automation", id: action.payload.id, amplitude: 1, speed: 1, constant: 0,  offset: 0}
                return {...state, automationIdx: 1, automations: update(state.automations, {[action.payload.id]: {$set: au}}), selectedAutomation: action.payload.id}
            case "ADD_MASTER_SETTINGS":
                return {...state, masterSettings: action.payload}
            case "EDIT_MASTER_SETTINGS":
                return {...state, masterSettings: update(state.masterSettings, {[action.payload.key]: {$set: action.payload.value}})}
            case "RESET_AUDIO_FILES":
                return {...state, audioItems: []}
            case "LOAD_PROJECT_FROM_FILE":
                return {...action.payload, loadFromFile: true}
            case "SET_LOAD_FROM_FILE":
                return {...state, laodFromFile: action.payload}
            case "RESET_REDUCER":
                if(state.loadFromFile){
                    return {...baseSettings}
                }
            
                return {...baseSettings, loadFromFile: false}
            case "EDIT_FOG": 
                fog =  update(state.fog, {[state.selectedLayerId]: {[action.payload.key]: {$set: action.payload.value}}})
                return { ...state, fog }
            case "EDIT_SETTINGS": 
                settings =  update(state.settings, {[state.selectedLayerId]: {[action.payload.key]: {$set: action.payload.value}}})
                return { ...state, settings }
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
    
            case "REMOVE_EFFECT":

                idx = state.passes.findIndex(e => e.id === action.payload.id)
                //passes = [...state.passes[state.selectedLayerId].slice(0, idx), ...state.passes[state.selectedLayerId].slice(idx+1)]
                passes =    update(state.passes, {$splice: [[idx, 1]]  })
                return {...state, passes}
            case "ADD_EFFECT":
                passes       = update(state.passes, {$push: [action.payload] })
                return {...state, passes, sideBarWindowIndex: indices.EFFECT, effectId: action.payload.id} 
            case "EDIT_EFFECT":
                idx = state.passes.findIndex(e => e.id === state.effectId)
                const pass = state.passes[idx]                
                passes   = update(state.passes, {$splice: [[idx, 1, {...pass, [action.payload.key]: action.payload.value}]] })
                return {...state, passes }
            case "SELECT_EFFECT":
                return { ...state, effectId: action.payload, sideBarWindowIndex: indices.EFFECT }
            case "REMOVE_SOUND":
                idx         = state.audioItems.findIndex(e => e.id === action.payload) 
                audioItems  = [...state.audioItems.slice(0, idx), ...state.audioItems.slice(idx+1)]
                return {...state, audioItems, sideBarWindowIndex: indices.AUDIO, audioItemView: 0}
            case "CREATE_SOUND":
                return {...state, audioInfo: action.payload}
            case "ADD_SOUND": 
                audioItems  = update(state.audioItems, {$push: [{...action.payload, index: state.itemIdx}]})
                return {...state, audioInfo: action.payload, audioItems, itemIdx: state.itemIdx + 1}

            case "EDIT_LAYER":
                const newLayer = {...state.layers[state.selectedLayerId], [action.payload.key]: action.payload.value}
                layers   = update(state.layers, {[state.selectedLayerId]: {$set: newLayer }})
                return {...state, layers}
            case "ADD_3D_LAYER":
                id          = action.payload.id
                items       = update(state.items,  {[id]: {$set: {} }})
 
                
                layers      = update(state.layers,  {[id]: 
                                {$set: {...action.payload,  
                                    items: [], camera: action.payload.camera.id, 
                                    controls: action.payload.controls.id, fog: action.payload.fog.id }}}
                                )

                cameras     = update(state.cameras, {[id]: {$set: action.payload.camera }} )
                controls    = update(state.controls, {[id]: {$set: action.payload.controls }} )
                fog         = update(state.fog,  {[id]: {$set: action.payload.fog }} )
                return {...state, items, layers, cameras, controls, fog, selectedLayerId: id }
            case "ADD_2D_LAYER":
                id          = action.payload.id
                items       = update(state.items,  {[id]: {$set: {} }})
                layers      = update(state.layers,  {[id]: {$set: {...action.payload, items: []}}})
                return {...state, items, layers, selectedLayerId: id }
            case "SELECT_LAYER":
                return {...state, sideBarWindowIndex: indices.LAYER, selectedLayerId: action.payload }
            case "SET_SIDEBAR_WINDOW_INDEX":
                return {...state, sideBarWindowIndex: action.payload }
            case "SELECT_ITEM":
                return {...state, selectedItemId: action.payload.itemId, selectedLayerId: action.payload.layerId, sideBarWindowIndex: indices.ITEM }

            case "ADD_ITEM":
                id          = action.payload.id
                
                items       = update(state.items,  {[state.selectedLayerId]: {[id]: {$set: {...action.payload, index: state.itemIdx}}}})
                layers      = update(state.layers, {[state.selectedLayerId]: {items: {$push: [id]}}})
                automations = update(state.automations, {[id]: {$set: [] }}) 

                return {...state, items, layers, automations, selectedItemId: id, sideBarWindowIndex: indices.ITEM }
            case "REMOVE_LAYER":
                id = action.payload.id
                layers  = update(state.layers, {$unset: [id] })
                return {...state, layers, sideBarWindowIndex: indices.LAYERS }
           
            case "REMOVE_ITEM":
                idx     = state.layers[state.selectedLayerId].items.findIndex(e => e === action.payload.id)
                items   = update(state.items,  {[state.selectedLayerId]: {$unset: [action.payload.id]}})  
                layers  = update(state.layers, {[state.selectedLayerId]: {items: {$splice: [[idx, 1]]}}})
                return {...state, items, layers, selectedItemId: -1, sideBarWindowIndex: indices.LAYER}
            
            case "TOGGLE_ITEMS_ENABLED":
                const s = {...state.items[state.selectedLayerId][state.selectedItemId], ...action.payload}
                action.payload.items.forEach(e => {
                    s.defaultConfig[action.payload.groupIndex].items[e].disabled = action.payload.disabled
                })
                
                items   = update(state.items, {[state.selectedLayerId]: {[state.selectedItemId]: {$set: s }}})
                return {...state, items}
            
            case "UPDATE_ITEM_CONFIG":
                newItem = {...state.items[action.payload.sceneId][action.payload.id], ...action.payload}
                items   = update(state.items, {[action.payload.sceneId]: {[action.payload.id]: {$set: newItem }}})
                return {...state, items}
            case "SET_AUDIO_WINDOW":
                return {...state, audioItemView: action.payload}
            case "SELECT_AUDIO_ITEM": 
                idx = state.audioItems.findIndex(e => e.id === action.payload.itemId)
                return {...state, audioIdx: idx, sideBarWindowIndex: indices.AUDIO, audioItemView: 1}
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

import SidebarContainer from '../../views/sidebar/sidebarcontainer'

export default function itemsReducer(state = {
    items: [],
    selectedItem: null,
    lastAction: "",
    sideBarWindowIndex: 0,
    layers: [],
    selectedLayer: 0,
    audioInfo: null

    }, action){
        switch(action.type){
            case "ADD_SOUND": 
                return {...state, audioInfo: action.payload}
            case "ADD_LAYER":
                return {...state, layers: [...state.layers, action.payload]}
            case "SELECT_LAYER":
                return {...state, selectedLayer: action.payload, sideBarWindowIndex: SidebarContainer.INDEXES.LAYER}
            case "SET_SIDEBAR_WINDOW_INDEX":
                return {...state, sideBarWindowIndex: action.payload}
            case "SELECT_ITEM":
                const item = state.items.find((e) => action.payload.id === e.id)
                return {...state, selectedItem: item, sideBarWindowIndex: SidebarContainer.INDEXES.ITEM}
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

                const idx = state.items.findIndex((e) => state.selectedItem.id === e.id)
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
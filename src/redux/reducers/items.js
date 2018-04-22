export default function itemsReducer(state = {
    items: [],
    selectedItem: null,
    lastAction: "",
    sideBarWindowIndex: 0

    }, action){
        switch(action.type){
            case "SET_SIDEBAR_WINDOW_INDEX":
                return {...state, sideBarWindowIndex: action.payload}
            case "SELECT_ITEM":
                return {...state, selectedItem: action.payload, lastAction: "SELECT_ITEM", sideBarWindowIndex: 6}
            case "CREATE_ITEM":
                return {...state, selectedItem: action.payload, lastAction: "CREATE_ITEM"}
            case "ADD_ITEM":
                return {...state, selectedItem: action.payload, items: [...state.items, action.payload], lastAction: action.itemType, sideBarWindowIndex: 6}
            case "REMOVE_ITEM":
                let { items } = state    
                let index = items.indexOf(action.payload)
                items.splice(index, 1)
                return {...state, items, lastAction: "REMOVE_ITEM"}
            case "EDIT_SELECTED_ITEM": 
                const updatedItem = Object.assign({}, state.selectedItem, {
                    ...state.selectedItem,
                    [action.key]: {
                        ...state.selectedItem[action.key],
                        value: action.value
                    }
                })
                const idx = state.items.findIndex((e) => state.selectedItem.name.value === e.name.value)
                return {
                    ...state,
                    items: [...state.items.splice(0, idx), updatedItem, ...state.items.splice(idx+1)], 
                    selectedItem: updatedItem,
                    lastAction: "EDIT_SELECTED_ITEM"
                }
        }
    return state
}
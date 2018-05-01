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
                return {...state, selectedItem: action.payload, sideBarWindowIndex: 6}
            case "CREATE_ITEM":
                return {...state, selectedItem: action.payload}
            case "ADD_ITEM":
                return {...state, selectedItem: action.payload, items: [...state.items, action.payload],  sideBarWindowIndex: 6}
            case "REMOVE_ITEM":
                let index = state.items.findIndex((e) => state.selectedItem.name === e.name)
                return {...state, items: state.items.filter((_, i) => i !== index), sideBarWindowIndex: 0}
            case "EDIT_SELECTED_ITEM": 
                const updatedItem = Object.assign({}, state.selectedItem, {
                    ...state.selectedItem,
                    [action.key]: action.value
                })

                console.log(updatedItem)
                const idx = state.items.findIndex((e) => state.selectedItem.name === e.name)
                return {
                    ...state,
                    items: [...state.items.splice(0, idx), updatedItem, ...state.items.splice(idx+1)], 
                    selectedItem: updatedItem
                }
            default:
                return state;
        }
}
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
                const item = state.items.find((e) => action.payload.id === e.id)
                return {...state, selectedItem: item, sideBarWindowIndex: 6}
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
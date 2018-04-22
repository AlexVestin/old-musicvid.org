export default function reducer(state = {
    items: [],
    selectedItem: null,
    lastAction: "",
    sideBarWindowIndex: 0

    }, action){
        switch(action.type){
            case "SET_SIDEBAR_WINDOW_INDEX":
                return {...state, sideBarWindowIndex: action.payload}
            case "SELECT_ITEM":
                return {...state, selectedItem: action.payload, lastAction: "SELECT_ITEM"}
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
                return {...state, selectedItem: action.payload, lastAction: "EDIT_SELECTED_ITEM"}
        }
    return state
}
export default function reducer(state = {
    items: [],
    selectedItem: null,
    lastAction: ""

    }, action){
        switch(action.type){
            case "SELECT_ITEM":
                return {...state, selectedItem: action.payload, lastAction: "SELECT_ITEM"}
            case "APPEND_ITEM":
                return {...state, selectedItem: action.payload, items: [...state.items, action.payload], lastAction: "APPEND_ITEM"}
            case "REMOVE_ITEM":
                let { items } = state    
                let index = items.indexOf(action.payload)
                items.splice(index, 1)
                return {...state, items, lastAction: "REMOVE_ITEM"}
            case "EDIT_SELECTED_ITEM": 
                const idx = state.items.findIndex((e) => action.payload.name === e.name)
                return {
                    ...state,
                    items: [...state.items.splice(0, idx), action.payload, ...state.items.splice(idx+1)], 
                    selectedItem: action.payload,
                    lastAction: "EDIT_SELECTED_ITEM"
                }
        }
    return state
}
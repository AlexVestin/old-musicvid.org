import store from '../store'
export function selectItem(item){
    store.dispatch({
        type: "SELECT_ITEM",
        payload: item
        } 
    );  
}

export function appendItem(item){
    store.dispatch({
        type: "APPEND_ITEM",
        payload: item
        } 
    );  
}

export function removeItem(item){
    store.dispatch({
        type: "REMOVE_ITEM",
        payload: item
        } 
    );  
}

export function editItem(item){
    store.dispatch({
        type: "EDIT_SELECTED_ITEM",
        payload: item
        } 
    );  
}


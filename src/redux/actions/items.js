import store from '../store'
export function selectItem(item){
    store.dispatch({
        type: "SELECT_ITEM",
        payload: item
        } 
    );  
}

export function setSidebarWindowIndex(item) {
    store.dispatch({
        type: "SET_SIDEBAR_WINDOW_INDEX",
        payload: item,
        } 
    ); 
}

export function addItem(item, itemType){
    store.dispatch({
        type: "ADD_ITEM",
        payload: item,
        itemType
        } 
    );  
}

export function createItem(item, itemType){
    store.dispatch({
        type: "CREATE_ITEM",
        payload: item,
        itemType
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
        key: item.key,
        value: item.value
    });  
}


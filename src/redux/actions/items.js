import store from '../store'
export function selectItem(item){
    store.dispatch({
        type: "SELECT_ITEM",
        payload: item
        } 
    );  
}

export function editAutomationPoint(item) {
    store.dispatch({
        type: "EDIT_AUTOMATION_POINT",
        payload: item
        } 
    );
}

export function editCamera(item) {
    store.dispatch({
        type: "EDIT_CAMERA",
        payload: item
        } 
    );
}

export function replaceCamera(item) {
    store.dispatch({
        type: "REPLACE_CAMERA",
        payload: item
        } 
    );
}

export function addAutomationPoint(item) {
    store.dispatch({
        type: "ADD_AUTOMATION_POINT",
        payload: item
        } 
    );
}


export function addAutomation(item){
    store.dispatch({
        type: "ADD_AUTOMATION",
        payload: item
        } 
    );  
}

export function addLayer(item){
    const id = Math.floor(Math.random() * 100000000)

    store.dispatch({
        type: "ADD_LAYER",
        payload: item,
        id    
    } 
    );  
}

export function addSound(item){
    store.dispatch({
        type: "ADD_SOUND",
        payload: item
        } 
    ); 
}

export function createSound(item){
    store.dispatch({
        type: "CREATE_SOUND",
        payload: item
        } 
    ); 
}



export function selectLayer(index){
    store.dispatch({
        type: "SELECT_LAYER",
        payload: index
    });  
}


export function removeSound(){
    store.dispatch({
        type: "REMOVE_SOUND",

        } 
    );  
}


export function editEffect(item) {
    store.dispatch({
        type: "EDIT_EFFECT",
        payload: item
        } 
    );  
} 

export function addEffect(item) {
    store.dispatch({
        type: "ADD_EFFECT",
        payload: item
        } 
    );  
} 

export function createEffect(item) {
    store.dispatch({
        type: "CREATE_EFFECT",
        payload: item
        } 
    );  
} 


export function removeEffect(item) {
    store.dispatch({
        type: "REMOVE_EFFECT",
        payload: item
        } 
    );  
} 

export function selectEffect(item) {
    store.dispatch({
        type: "SELECT_EFFECT",
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

export function updateItemConfig(item){
    store.dispatch({
        type: "UPDATE_ITEM_CONFIG",
        payload: item
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
        value: item.value,
    });  
}


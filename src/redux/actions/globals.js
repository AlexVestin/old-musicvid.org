import store from '../store'
export function setTime(item){
    store.dispatch({
        type: "SET_TIME",
        payload: item
        } 
    );  
}

export function setSidebarWindowIndex(item) {
    store.dispatch({
        type: "SET_FPS",
        payload: item,
        } 
    ); 
}

export function togglePlaying(){
    store.dispatch({
        type: "TOGGLE_PLAYING",
        } 
    );  
}

export function setPlaying(item){
    store.dispatch({
        type: "SET_PLAYING",
        payload: item
        } 
    );  
}

export function setDisabled(item){
    store.dispatch({
        type: "SET_DISABLED",
        payload: item
        } 
    );  
}


export function incrementFrame(){
    store.dispatch({
        type: "INCREMENT_FRAME"
        } 
    );  
}
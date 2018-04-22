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

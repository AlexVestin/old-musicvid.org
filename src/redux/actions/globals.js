import store from '../store'

export function incrementTime(item){
    store.dispatch({
        type: "INCREMENT_TIME",
        payload: item
        } 
    );  
}

export function editProjectSettings(item){
    store.dispatch({
        type: "EDIT_PROJECT_SETTINGS",
        payload: item
    })
}

export function setAudioBufferSize(item){
    store.dispatch({
        type: "SET_AUDIO_BUFFER_SIZE",
        payload: item
        } 
    );  
}

export function setTime(item){
    store.dispatch({
        type: "SET_TIME",
        payload: item
        } 
    );  
}

export function editFFT(item){
    store.dispatch({
            type: "EDIT_FFT",
            payload: item
        } 
    );  
}

export function addFFTSettings(item){
    store.dispatch({
        type: "ADD_FFT_SETTINGS",
        payload: item
        } 
    );  
}


export function setEncoding(item){
    store.dispatch({
        type: "SET_ENCODING",
        payload: item
        } 
    );  
}

export function setFps(item) {
    store.dispatch({
        type: "SET_FPS",
        payload: item,
        } 
    ); 
}

export function setClipDuration(item) {
    store.dispatch({
        type: "SET_CLIP_DURATION",
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
export default function playbackReducer(state = {
    time: 0,
    clipLength: 300,
    fps: 30,

    }, action){
        switch(action.type){
            case "SET_CLIP_LENGTH":
                return {...state, clipLength: action.payload}
            case "SET_TIME":
                return {...state, time: action.payload}
            case "SET_FPS":
                return {...state, fps: action.payload}
            default:
                return state
        }
    return state
}
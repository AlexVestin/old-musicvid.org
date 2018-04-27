export default function playbackReducer(state = {
    time: 0,
    clipLength: 300,
    fps: 60,
    playing: false,
    frameId: 0,
    disabled: false

    }, action){
        switch(action.type){
            case "SET_CLIP_LENGTH":
                return {...state, clipLength: action.payload}
            case "SET_DISABLED":
                return {...state, disabled: action.payload}
            case "INCREMENT_FRAME":
                return {...state, frameId: state.frameId + 1}
            case "TOGGLE_PLAYING":
                return {...state, playing: !state.playing}
            case "SET_PLAYING":
                return {...state, playing: action.payload}
            case "SET_TIME":
                const f = Math.floor(action.payload * state.fps + 0.00001)
                return {...state, time: action.payload, frameId: f, lastAction: "SET_TIME"}
            case "INCREMENT_TIME":
                const frameId = Math.floor(action.payload * state.fps + 0.00001)
                return {...state, time: action.payload, frameId: frameId}
            case "SET_FPS":
                return {...state, fps: action.payload}
            default:
                return state
        }
    return state
}
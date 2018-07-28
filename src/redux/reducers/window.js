export default function windowReducer(state = {
    playlistHeight: 32,

    }, action){
        switch(action.type){
            case "UPDATE_PLAYLIST_HEIGHT":
                return {...state, playlistHeight: action.payload}
            default:
                return state
        }
}
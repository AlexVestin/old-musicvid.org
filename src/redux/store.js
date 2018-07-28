import { createStore, combineReducers} from "redux"

import itemReducer from "./reducers/items"
import playbackReducer from "./reducers/globals"
import windowReducer from "./reducers/window"

function lastAction(state = null, action) {
    return action;
}
const rootReducer = combineReducers({globals: playbackReducer, items: itemReducer, lastAction: lastAction, window: windowReducer})
const store = createStore(
    rootReducer, 
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )

export default store
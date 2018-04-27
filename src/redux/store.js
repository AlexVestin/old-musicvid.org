import {applyMiddleware, createStore, combineReducers} from "redux"

import itemReducer from "./reducers/items"
import playbackReducer from "./reducers/globals"

function lastAction(state = null, action) {
    return action;
}

const rootReducer = combineReducers({globals: playbackReducer, items: itemReducer, lastAction: lastAction})

const store = createStore(rootReducer)

export default store
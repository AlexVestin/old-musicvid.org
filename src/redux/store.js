import {applyMiddleware, createStore, combineReducers} from "redux"

import itemReducer from "./reducers/items"
import playbackReducer from "./reducers/globals"

const rootReducer = combineReducers({globals: playbackReducer, items: itemReducer})


export default createStore(rootReducer)
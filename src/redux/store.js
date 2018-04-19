import {applyMiddleware, createStore} from "redux"
import reducer from "./reducers/items"

export default createStore(reducer)
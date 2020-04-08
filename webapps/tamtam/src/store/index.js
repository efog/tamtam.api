import { applyMiddleware, createStore } from "redux";
import reducers from "./reducers";
import reduxThunk from "redux-thunk";

export default createStore(reducers, {}, applyMiddleware(reduxThunk));
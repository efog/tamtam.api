
import { combineReducers } from "redux";
import tokenReducer from "./token-reducer";

const rootReducer = (state = {}, action) => {
    return state;
};

export default combineReducers({
    "tokens": tokenReducer,
    "root": rootReducer
});

import { combineReducers } from "redux";
import identityReducer from "./identity-reducer";
import tokenReducer from "./token-reducer";
import userReducer from "./user-reducer";

const rootReducer = (state = {}, action) => {
    return state;
};

export default combineReducers({
    "identity": identityReducer,
    "tokens": tokenReducer,
    "root": rootReducer,
    "user": userReducer
});
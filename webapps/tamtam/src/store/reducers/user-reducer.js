import actions from "../../actions";
export default (state = {}, action) => {
    switch (action.type) {
    case actions.FETCHED_USERPROFILE: {
        return Object.assign({}, action.user);
    }
    case actions.SET_USERPROFILE: {
        return Object.assign({}, state, action.user);
    }
    default:
        return state;
    }
};
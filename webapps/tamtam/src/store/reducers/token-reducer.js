import actions from "../../actions";

export default (state = {}, action) => {
    switch (action.type) {
    case actions.CLEARED_TOKENS:
    case actions.FETCHED_TOKENS: 
    case actions.GOT_TOKENS: {
        return Object.assign({}, state, JSON.parse(action.tokens));
    }
    default:
        return state;
    }
};
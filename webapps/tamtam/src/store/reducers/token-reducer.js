import actions from "../../actions";

export default (state = {}, action) => {
    switch (action.type) {
    case actions.FETCHED_TOKENS: 
    case actions.GOT_TOKENS: {
        const updated = Object.assign(state, JSON.parse(action.tokens));
        return updated;
    }
    default:
        return state;
    }
};
import actions from "../../actions";

export default (state = { "name": "" }, action) => {
    switch (action.type) {
    case actions.GOT_IDENTITY: {
        return Object.assign({}, state, action.identity);
    }
    default:
        return state;
    }
};
import actions from "./";

/**
 * Updates user's definition
 * @param {User} user user definition
 * @returns {function} dispatch method
 */
export function updateUser(user) {
    return (dispatch) => {
        dispatch(
            {
                "type": actions.SET_USERPROFILE,
                "user": user
            }
        );
    };
}

/**
 * Fetches user
 * @returns {function} dispatch function
 */
export function getUser() {

    return (dispatch) => {
        dispatch(
            {
                "type": actions.FETCHED_USERPROFILE,
                "user": {"name": "nobody"}
            }
        );
    };
}
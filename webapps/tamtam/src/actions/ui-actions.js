import actions from "./";

/**
 * Requests the display of an error toast
 * @param {string} message message to display in toast
 * @returns {function} dispatch method
 */
export function displayErrorToast(message) {
    return (dispatch) => {
        dispatch(
            {
                "type": actions.SHOW_TOAST,
                "data": {
                    "id": new Date().toString(),
                    "type": "error",
                    "message": message
                }
            }
        );
    };
}

/**
 * Dismisses toast
 * @param {string} id of toast to dismiss
 * @returns {function} dispatch method
 */
export function dismissToast(id) {
    return (dispatch) => {
        dispatch(
            {
                "type": actions.DISMISS_TOAST,
                "data": {
                    "id": id
                }
            });
    };
}

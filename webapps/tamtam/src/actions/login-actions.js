import actions from "./";
import request from "request";

/**
 * Gets tokens from local storage
 * @returns {function} dispatch method
 */
export function getTokens() {
    return (dispatch) => {
        dispatch(
            {
                "type": actions.GETTING_TOKENS
            }
        );
        if (window.localStorage && window.localStorage.getItem("tokens")) {
            const tokens = window.localStorage.getItem("tokens");
            dispatch(
                {
                    "type": actions.GOT_TOKENS,
                    "tokens": tokens
                }
            );
        }
    };
}

/**
 * Fetches asynchroneously access, refresh and id tokens for code
 * @param {string} code authorization code to get tokens for
 * @returns {function} dispatch method
 */
export function fetchTokens(code) {
    return (dispatch) => {
        dispatch(
            {
                "type": actions.FETCHING_TOKENS
            }
        );
        const apiBackendHost = process.env.REACT_APP_CONFIG_APIBACKENDHOST;
        const env = process.env.REACT_APP_CONFIG_ENV;
        const data = JSON.stringify({ "code": `${code}` });
        const options = {
            "method": "POST",
            "url": `https://${apiBackendHost}/${env}/tokens`,
            "headers": {
                "Content-Type": ["application/json"],
                "Accept": "application/json"
            },
            "body": data
        };
        request(options, function (error, response) {
            if (error) {
                dispatch({
                    "type": actions.SHOW_ERROR,
                    "error": error
                });
            }
            if (window.localStorage) {
                window.localStorage.setItem("tokens", response.body);
            }
            dispatch({
                "type": actions.FETCHED_TOKENS,
                "tokens": response.body
            });
        });
    };
}
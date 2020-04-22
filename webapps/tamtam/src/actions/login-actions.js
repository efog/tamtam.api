import actions from "./";
import request from "request";
import tokenManager from "../services/token-manager";

/**
 * Fetches asynchroneously access, refresh and id tokens for code
 * @param {string} code authorization code to get tokens for
 * @returns {function} dispatch method
 */
export function getAccessToken(code) {
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
                tokenManager.tokens = response.body;
                console.log(response);
            }
            dispatch({
                "type": actions.FETCHED_TOKENS,
                "tokens": response.body
            });
        });
    };
}
import actions from "./";
import fetch from "fetch";

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
        const data = JSON.stringify({ "code": code });
        const options = {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            "body": data,
            "redirect": "follow"
        };
        fetch.fetchUrl(`https://${apiBackendHost}/${env}/tokens`, options)
            .then((response) => {
                response.text();
            })
            .then((result) => {
                console.log(result);
                dispatch(
                    {
                        "type": actions.FETCHED_TOKENS
                    }
                );
                if (window.localStorage) {
                    window.localStorage.setItem("tokens", result);
                }
            })
            .catch((error) => {
                console.log("error", error);
            });
    };
}
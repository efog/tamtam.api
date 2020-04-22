import React from "react";

class TokenManager {
    get tokens() {
        if (window.localStorage && window.localStorage.getItem("tokens")) {
            const retVal = JSON.parse(window.localStorage.getItem("tokens"));
            return retVal;
        }
        return this._tokens;
    }
    set tokens(value) {
        if (window.localStorage) {
            window.localStorage.setItem("tokens", value);
        }
        this._tokens = value;
    }
    get identity() {
        if (!this.tokens) {
            return null;
        }
        const idToken = this.tokens.idToken;
        const idTokenObject = JSON.parse(atob(idToken));
        return idTokenObject;
    }
    withIdentity(WrappedComponent) {
        const identity = this.identity;
        return class extends React.Component {
            render() {
                return <WrappedComponent identity={identity}></WrappedComponent>;
            }
        };
    }
}
export default new TokenManager();
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
            window.localStorage.setItem("tokens", JSON.stringify(value));
        }
        this._tokens = value;
    }
    withToken(component) {
        component.props.tokens = this.tokens;
        return component;
    }
}
export default new TokenManager();
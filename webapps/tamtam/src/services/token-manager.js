class TokenManager {
    get tokens() {
        return this._tokens;
    }
    set tokens(value) {
        this._tokens = value;
    }
    withToken(component) {
        component.props.tokens = this.tokens;
        return component;
    }
}
export default new TokenManager();
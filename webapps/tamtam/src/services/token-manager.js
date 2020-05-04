import React from "react";
import { connect } from "react-redux";
import { getTokens } from "../actions/login-actions";

const mapStateToProps = (state = {}) => {
    return {
        "tokens": state.tokens
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        "getTokens": () => {
            dispatch(getTokens());
        }
    };
};

class TokenManager {
    withIdentity(WrappedComponent) {
        return connect(mapStateToProps, mapDispatchToProps)(class extends React.Component {
            componentWillMount() {
                this.props.getTokens();
            }
            getIdentityFromIdToken() {
                if (this.props.tokens && this.props.tokens.idToken) {
                    const idToken = this.props.tokens.idToken;
                    const idTokenObject = JSON.parse(atob(idToken.split(".")[1]));
                    return idTokenObject;
                }
                console.log("didn't have token");
                return null;
            }
            render() {
                const identity = this.getIdentityFromIdToken();
                return <WrappedComponent identity={identity}></WrappedComponent>;
            }
        });
    }
}
export default new TokenManager();
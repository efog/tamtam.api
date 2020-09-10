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
            componentDidMount() {
                this.props.getTokens();
            }
            render() {
                return <WrappedComponent id={this.props.identity}></WrappedComponent>;
            }
        });
    }
}
export default new TokenManager();
import React, { Component } from "react";
import { Redirect, withRouter } from "react-router-dom";
import { clearTokens, getTokens } from "../../actions/login-actions";
import { connect } from "react-redux";

const mapStateToProps = (state = {}) => {
    return {
        "tokens": state.tokens
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        "clearTokens": () => {
            dispatch(clearTokens());
        },       
        "getTokens": () => {
            dispatch(getTokens());
        }   
    };
};

class Logout extends Component {
    componentDidMount() {
        this.props.getTokens();
        this.props.clearTokens();
    }
    render() {
        console.log(`${JSON.stringify(this.props.tokens)}`);
        if (this.props.tokens.accessToken) {
            console.log("waiting for token to be cleared");
            return <div>Clearing tokens...</div>;
        }
        const redirect = this.props.tokens.accessToken ? <div>Clearing tokens...</div> : <Redirect to="/"></Redirect>;
        return (
            <div className="container">
                <h1>Log out</h1>
                {redirect}
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Logout));
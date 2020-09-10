import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const mapStateToProps = (state = {}) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

class SignIn extends Component {
    componentDidMount() {
    }
    render() {
        const authUrl = process.env.REACT_APP_AUTH_HOST || "dev.auth.efog.ca";
        const clientId = process.env.REACT_APP_AUTH_CLIENT_ID || "4kgjo809ktom8l15456hoqu7sb";
        const redirectUrl = process.env.REACT_APP_AUTH_REDIRECT_URL || "http://localhost:3000/login/callback";
        const scopes = process.env.REACT_APP_AUTH_SCOPES || "email+https://dev.api.tamtam.efog.ca/api.access+https://dev.api.tamtam.efog.ca/user.read+https://dev.api.tamtam.efog.ca/user.write+openid+phone+profile";
        return (
            <div className="container">
                <h1>Sign in</h1>
                <div>To sign into this application, simply click the following link and you'll be redirected to AWS Cognito sign in page.</div>
                <div>
                    <a href={`https://${authUrl}/login?client_id=${clientId}&response_type=code&scope=${scopes}&redirect_uri=${redirectUrl}`}>Sign in using Cognito</a>
                </div>
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignIn));
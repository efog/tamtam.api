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

class Signout extends Component {
    componentDidMount() {
    }
    render() {
        const authUrl = process.env.REACT_APP_AUTH_HOST || "dev.auth.efog.ca";
        const clientId = process.env.REACT_APP_AUTH_CLIENT_ID || "4kgjo809ktom8l15456hoqu7sb";
        const logoutUrl = process.env.REACT_APP_AUTH_LOGOUT_URL || "http://localhost:3000/logout";
        return (
            <div className="container">
                <h1>Sign out</h1>
                <div>To sign out of this application, simply click the following link.</div>
                <div>
                    <a href={`https://${authUrl}/logout?client_id=${clientId}&logout_uri=${logoutUrl}`}>Sign out</a>
                </div>
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Signout));
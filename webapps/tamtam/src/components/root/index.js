import { Link, withRouter } from "react-router-dom";
import React, { Component } from "react";
import Header from "./header";
import SigninButton from "../signin/signin-button";
import { connect } from "react-redux";

const mapStateToProps = (state = {}) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

class Root extends Component {
    componentDidMount() {
    }
    componentWillMount() {
    }
    render() {
        return (
            <div className="container-fluid no-pad">
                <Header></Header>
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Root));
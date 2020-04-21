import { Link, withRouter } from "react-router-dom";
import React, { Component } from "react";
import { connect } from "react-redux";

const mapStateToProps = (state = {}) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

class Signup extends Component {
    componentDidMount() {
    }
    componentWillMount() {
    }
    render() {
        return (
            <div className="container">
                <h1>Sign up</h1>
                <div>
                    Welcome friend from the future! If you would like to use this application, please sign up so you can start rolling on TamTam!
                </div>
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Signup));
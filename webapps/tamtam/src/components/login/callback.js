import { Link, Redirect, withRouter } from "react-router-dom";
import React, { Component } from "react";
import { connect } from "react-redux";
import { getAccessToken } from "../../actions/login-actions";


const mapStateToProps = (state = {}) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        "getAccessToken": (code) => {
            dispatch(getAccessToken(code));
        }
    };
};

class LoginCallback extends Component {
    constructor(props) {
        super(props);
        const { code } = props;
        this.code = code;
    }
    componentDidMount() {
    }
    componentWillMount() {
        if (this.code) {
            this.props.getAccessToken(this.code);
        }
    }
    render() {
        return (
            <div className="container">
                <Redirect to="/"></Redirect>
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginCallback));
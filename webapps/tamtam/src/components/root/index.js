import React, { Component } from "react";
import { getUser, updateUser } from "../../actions/user-actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const mapStateToProps = (state = {}) => {
    return {
        "identity": state.identity,
        "user": state.user
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        "getUser": () => {
            return dispatch(getUser());
        },
        "updateUser": (user) => {
            return dispatch(updateUser(user));
        }
    };
};

class Root extends Component {
    componentDidMount() {
        this.props.getUser();
    }
    componentDidUpdate() {
    }
    handleOnChange(evt) {
        this.props.updateUser({"name": evt.target.value});
    }
    render() {
        return (
            <div className="container">
                <h1>Hello</h1>
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Root));
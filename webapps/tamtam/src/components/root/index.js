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

class Root extends Component {
    componentDidMount() {
    }
    componentWillMount() {
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
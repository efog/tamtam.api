import { Link, withRouter } from "react-router-dom";
import React, { Component } from "react";
import { connect } from "react-redux";
import tokenManager from "../../services/token-manager";


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
        console.log(JSON.stringify(this.props.identity));
        return (
            <div className="container">
                <h1>Hello</h1>
                <div>{this.props.identity || "Someone"}</div>
            </div>
        );
    }
}

export default tokenManager.withIdentity(withRouter(connect(mapStateToProps, mapDispatchToProps)(Root)));
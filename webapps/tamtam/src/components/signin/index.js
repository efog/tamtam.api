import { Link, withRouter } from "react-router-dom";
import React, { Component } from "react";
import { Alert } from "react-bootstrap";
import { connect } from "react-redux";

const mapStateToProps = (state = {}) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

class Signin extends Component {
    componentDidMount() {
    }
    componentWillMount() {
    }
    render() {
        return (
            <div>
                
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Signin));
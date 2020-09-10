import React, { Component } from "react";
import { Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { fetchTokens } from "../../actions/login-actions";


const mapStateToProps = (state = {}) => {
    console.log(`receiving update ${JSON.stringify(state.tokens)}`);
    return {
        "tokens": state.tokens
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        "fetchTokens": (code) => {
            dispatch(fetchTokens(code));
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
        if (this.code) {
            this.props.fetchTokens(this.code);
        }
    }
    render() {
        const defaultContent = this.props.tokens.accessToken ? <Redirect to="/"></Redirect> : <div>Finishing authentication...</div>;
        return (
            <div className="container">
                {defaultContent}
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginCallback));
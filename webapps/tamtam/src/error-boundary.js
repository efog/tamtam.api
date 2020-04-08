import { Link, Redirect, withRouter } from "react-router-dom";
import React from "react";
import { SeverityLevel } from "@microsoft/applicationinsights-web";
import { ai } from "./telemetry-service";
import { connect } from "react-redux";
import { createBrowserHistory } from "history";
import { displayErrorToast } from "./actions/ui-actions";

const history = createBrowserHistory({ "basename": "" });
ai.initialize({ "history": history });

const mapStateToProps = (state = {}) => {
    return {
        "ui": state.ui
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        "displayErrorToast": (message) => {
            return dispatch(displayErrorToast(message));
        }
    };
};

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { "hasError": false };
    }
  
    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { "hasError": true };
    }
  
    componentDidCatch(error, info) {
        // You can also log the error to an error reporting service
        ai.appInsights.trackException({ 
            "error": error, 
            "severityLevel": SeverityLevel.Error });
        this.props.displayErrorToast(`${error.message}`);
    }
  
    render() {
        if (this.state.hasError) {
        // You can render any custom fallback UI
            return <div className="container-fluid">
                <h1 className="mt-4">**Cough**</h1>
                <p>
                    Obviously, something went wrong. We are tracking the issue so you don't need to act upon anything *yet*.
                    <br></br>
                    Meanwhile you can resume what you were doing, a bunch of monkeys with wrenches and saws is working 24/7 to resolve this problem.
                </p>
            </div>;

        }
        return this.props.children; 
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ErrorBoundary));
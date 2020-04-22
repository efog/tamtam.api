import { Link, useLocation, useParams, withRouter } from "react-router-dom";
import React, { Component, useCallback } from "react";
import Callback from "./callback";
import tokenManager from "../../services/token-manager";

/**
 * Custom hook to fetch query parameters
 * @returns {URLSearchParams} url search parameter object
 */
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

/**
 * Renders the signin button
 * @param {*} props component props
 * @param {*} context component context
 * @returns {object} rendered signin button
 */
export default tokenManager.withIdentity(function (props, context) {
    const { action } = useParams();
    const code = useQuery().get("code");
    switch (action) {
    case "callback":
        return <Callback code={code}></Callback>;
    default: 
        return <div className="container">
            <h1>Login Page</h1>
        </div>;
    }
});
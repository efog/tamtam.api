import { BrowserRouter, StaticRouter } from "react-router-dom";
import App from "../App";
import React from "react";

/**
 * Client side render component
 * @returns {DOM} render DOM
 */
export function Client() {
    return (
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    );
}

/**
 * Server side render component
 * 
 * @param {*} props component props
 * @returns {DOM} render DOM
 */
export function Server(props) {  
    return (
        <StaticRouter location={props.location} context={props.context}>
            <App />
        </StaticRouter>
    );
}
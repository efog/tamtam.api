import Nav from "./nav";
import React from "react";

/**
 * Renders the page header
 * @param {*} props component props
 * @param {*} context component context
 * @returns {object} rendered component
 */
export default function (props, context) {
    return <div>
        <div className="page-header">
            <div className="content">
                <div id="brandname">TamTam</div>
            </div>
        </div>
        <Nav></Nav>
    </div>;
}
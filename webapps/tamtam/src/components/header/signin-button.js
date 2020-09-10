import { LinkContainer } from "react-router-bootstrap";
import { Nav } from "react-bootstrap";
import React from "react";

/**
 * Renders the signin button
 * @param {*} props component props
 * @param {*} context component context
 * @returns {object} rendered signin button
 */
export default function (props, context) {
    return <LinkContainer to="/signin">
        <Nav.Link>Sign in</Nav.Link>
    </LinkContainer>;
}
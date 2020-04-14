import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import React, { Component } from "react";
import { LinkContainer } from "react-router-bootstrap";

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
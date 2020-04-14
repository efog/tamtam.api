import { Container, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import React from "react";
import SigninButton from "./signin-button";

/**
 * Renders the nav
 * @param {*} props component props
 * @param {*} context component context
 * @returns {object} rendered component
 */
export default function (props, context) {
    return <Navbar expand="lg" variant="light" bg="light">
        <Container>
            <Nav className="mr-auto">
                <Nav.Item>
                    <LinkContainer to="/">
                        <Nav.Link>Home</Nav.Link>
                    </LinkContainer>
                </Nav.Item>
                <Nav.Item>
                    <SigninButton></SigninButton>
                </Nav.Item>
            </Nav>
        </Container>
    </Navbar>;
}
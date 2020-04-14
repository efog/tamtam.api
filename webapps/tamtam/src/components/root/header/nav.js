import { Container, Nav, Navbar } from "react-bootstrap";
import React from "react";

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
                <Nav.Link href="#/">Home</Nav.Link>
                <Nav.Link href="#/signin">Sign in</Nav.Link>
            </Nav>
        </Container>
    </Navbar>;
}
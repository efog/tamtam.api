import { Container, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import React from "react";
import SigninButton from "./signin-button";
import { connect } from "react-redux";
import { getIdentity } from "../../actions/login-actions";
import { withRouter } from "react-router-dom";

const mapStateToProps = (state = {}) => {
    return {
        "identity": state.identity
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        "getIdentity": () => {
            dispatch(getIdentity());
        }
    };
};

class NavBar extends React.Component {
    componentDidMount() {
        this.props.getIdentity();
    }
    render() {
        const homeNavItem = <Nav.Item>
            <LinkContainer to="/">
                <Nav.Link>Home</Nav.Link>
            </LinkContainer>
        </Nav.Item>;
        const signupNavItem = this.props.identity.email ? <Nav.Item></Nav.Item> : <Nav.Item>
            <LinkContainer to="/signup">
                <Nav.Link>Sign up</Nav.Link>
            </LinkContainer>
        </Nav.Item>;
        const signinNavItem = this.props.identity.email ? <Nav.Item></Nav.Item> : <Nav.Item>
            <SigninButton></SigninButton>
        </Nav.Item>;
        const signoutNavItem = this.props.identity.email ? <Nav.Item>
            <LinkContainer to="/signout">
                <Nav.Link>Sign out</Nav.Link>
            </LinkContainer>
        </Nav.Item>
            : <Nav.Item></Nav.Item>;
        return <Navbar expand="lg" variant="light" bg="light">
            <Container>
                <Nav className="mr-auto">
                    {homeNavItem}
                    {signupNavItem}
                    {signinNavItem}
                    {signoutNavItem}
                </Nav>
            </Container>
        </Navbar>;
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar));
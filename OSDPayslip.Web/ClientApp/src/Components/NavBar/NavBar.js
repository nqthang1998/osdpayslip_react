import React from "react";
import {
    Collapse,
    Container,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from "reactstrap";
import "@fortawesome/fontawesome-free/css/all.css";

function UserAvatar(props) {
    // If a user avatar is available, return an img tag with the pic
    if (props.user.avatar) {
        return (
            <React.Fragment>
                <img
                    src={props.user.avatar}
                    alt="user"
                    className="rounded-circle align-self-center mr-2"
                    style={{ width: "32px" }}
                />
            </React.Fragment>
        );
    }

    // No avatar available, return a default icon
    return (
        <React.Fragment>
            <span style={{fontSize: "16px", paddingRight:"3px"}}>{props.user.displayName} </span>

            <i
                className="far fa-user-circle fa-lg fa-2x rounded-circle align-self-center mr-2"
            ></i>

        </React.Fragment>
    );
}

function AuthNavItem(props) {
    // If authenticated, return a dropdown with the user's info and a
    // sign out button
    if (props.isAuthenticated) {
        return (
            <UncontrolledDropdown>
                <DropdownToggle nav caret>
                    <UserAvatar user={props.user} />
                </DropdownToggle>
                <DropdownMenu right style={{fontSize: "14px"}}>
                    <h4 className="dropdown-item-text mb-0">
                        {props.user.displayName}
                    </h4>
                    <p className="dropdown-item-text text-muted mb-0">
                        {props.user.email}
                    </p>
                    <DropdownItem divider />
                    <DropdownItem
                        onClick={props.authButtonMethod}
                        style={{ fontWeight: "bold" }}
                    >
                        Log Out
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
        );
    }

    // Not authenticated, return a sign in link
    return (
        <NavItem>
            <NavLink
                onClick={props.authButtonMethod}
                style={{ cursor: "pointer", fontWeight: "bold" , fontSize: "16px" }}
            >
                Log In
            </NavLink>
        </NavItem>
    );
}

export default class NavBar extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return (
            <div>
                <Navbar color="dark" dark expand="md" fixed="top">
                    <Container>
                        <NavbarBrand href="/">
                            <img
                                alt=""
                                src="https://www.orientsoftware.net/Themes/OrientSoftwareTheme/Content/Images/header/osd-logo-white.png"
                                style={{ width: "100%" }}
                            />
                        </NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="mr-auto" navbar></Nav>
                            <Nav className="justify-content-end" navbar>
                                <AuthNavItem
                                    isAuthenticated={this.props.isAuthenticated}
                                    authButtonMethod={
                                        this.props.authButtonMethod
                                    }
                                    user={this.props.user}
                                />
                            </Nav>
                        </Collapse>
                    </Container>
                </Navbar>
            </div>
        );
    }
}

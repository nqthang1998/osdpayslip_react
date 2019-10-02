import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";
import { UserAgentApplication } from "msal";
import NavBar from "./Components/NavBar/NavBar";
import ErrorMessage from "./Services/ErrorMessage";
import Content from "./Components/Content/Content";
import config from "./Services/Config";
import { getUserDetails, sendMail } from "./Services/GraphService";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import PayslipList from "./Components/Content/ListMonthPayslip/PayslipList/PayslipList";
import PayslipPreview from "./Components/Content/ListMonthPayslip/PayslipPreview/PayslipPreview";
import Footer from "./Components/Footer/Footer";

import { ProtectedRoute } from "./Services/protected.route";

class App extends Component {
    constructor(props) {
        super(props);

        this.userAgentApplication = new UserAgentApplication({
            auth: {
                clientId: config.appId
            },
            cache: {
                cacheLocation: "localStorage",
                storeAuthStateInCookie: true
            }
        });

        var user = this.userAgentApplication.getAccount();

        this.state = {
            isAuthenticated: user !== null,
            user: user,
            error: null,
            accessToken: "",
            response: null
        };

        if (user) {
            // Enhance user object with data from Graph
            this.getUserProfile();
        }
    }
    render() {
        let error = null;
        var welcomeBackground = true;
        if (this.state.error) {
            error = (
                <ErrorMessage
                    message={this.state.error.message}
                    debug={this.state.error.debug}
                />
            );
        }
        if (this.state.user !== null) {
            welcomeBackground = false;
        }

        return (
            <React.Fragment>
                <BrowserRouter>
                    <div
                        className={
                            welcomeBackground === true
                                ? "welcome-background"
                                : "default-background"
                        }
                    >
                        <NavBar
                            isAuthenticated={this.state.isAuthenticated}
                            authButtonMethod={
                                this.state.isAuthenticated
                                    ? this.logout.bind(this)
                                    : this.login.bind(this)
                            }
                            user={this.state.user}
                        />
                        <Container className="front-ground">
                            {error}
                            <Switch>
                                <Route
                                    exact
                                    path="/"
                                    render={props => (
                                        <Content
                                            {...props}
                                            isAuthenticated={
                                                this.state.isAuthenticated
                                            }
                                            user={this.state.user}
                                        />
                                    )}
                                />
                                <ProtectedRoute
                                    exact
                                    path="/details/:requestId"
                                    component={PayslipList}
                                    isAuthenticated={this.state.isAuthenticated}
                                />
                                <ProtectedRoute
                                    exact
                                    path="/preview/:requestId/:employeeId"
                                    component={PayslipPreview}
                                    isAuthenticated={this.state.isAuthenticated}
                                />
                                <Route path="*" component={() => <h1 style={(this.state.isAuthenticated ? { color:"grey" , marginTop: "130px"} : { color:"red" , marginTop: "130px", textShadow: "5px 5px rgba(0,0,0,0.5)"})}>404 NOT FOUND</h1>}/>
                            </Switch>
                        </Container>
                        {welcomeBackground === false ? (
                            <Footer />
                        ) : (
                            <span></span>
                        )}
                    </div>
                </BrowserRouter>
            </React.Fragment>
        );
    }

    setErrorMessage(message, debug) {
        this.setState({
            error: { message: message, debug: debug }
        });
    }

    async login() {
        await this.userAgentApplication.loginPopup({
            scopes: config.scopes,
            prompt: "select_account"
        });
        await this.getUserProfile();
    }

    logout() {
        this.userAgentApplication.logout();
    }

    async sendmail() {
        try {
            var accessToken = await window.msal.acquireTokenSilent({
                scopes: config.scopes
            });

            var response = await sendMail(accessToken);

            this.setState({ response: response });
        } catch (err) {
            this.props.showError("ERROR", JSON.stringify(err));
        }
    }

    async getUserProfile() {
        try {
            // Get the access token silently
            // If the cache contains a non-expired token, this function
            // will just return the cached token. Otherwise, it will
            // make a request to the Azure OAuth endpoint to get a token

            var accessToken = await this.userAgentApplication.acquireTokenSilent(
                {
                    scopes: config.scopes
                }
            );

            if (accessToken) {
                this.setState({
                    accessToken: accessToken.accessToken
                });
                // Get the user's profile from Graph
                var user = await getUserDetails(accessToken);
                this.setState({
                    isAuthenticated: true,
                    user: {
                        displayName: user.displayName,
                        email: user.mail || user.userPrincipalName
                    },
                    error: null
                });
            }
        } catch (err) {
            var error = {};
            if (typeof err === "string") {
                var errParts = err.split("|");
                error =
                    errParts.length > 1
                        ? { message: errParts[1], debug: errParts[0] }
                        : { message: err };
            } else {
                error = {
                    message: err.message,
                    debug: JSON.stringify(err)
                };
            }

            this.setState({
                isAuthenticated: false,
                user: {},
                error: error
            });
        }
    }
}

export default App;

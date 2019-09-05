import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "reactstrap";
import { UserAgentApplication } from "msal";
import NavBar from "./Authentication/NavBar";
import ErrorMessage from "./Authentication/ErrorMessage";
import Content from "./Authentication/Content";
import config from "./Authentication/Config";
import { getUserDetails, sendMail } from "./Authentication/GraphService";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";

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
    if (this.state.error) {
      error = (
        <ErrorMessage
          message={this.state.error.message}
          debug={this.state.error.debug}
        />
      );
    }

    return (
      <Router>
        <div>
          <NavBar
            isAuthenticated={this.state.isAuthenticated}
            authButtonMethod={
              this.state.isAuthenticated
                ? this.logout.bind(this)
                : this.login.bind(this)
            }
            user={this.state.user}
          />
          <Container>
          {error}
            <Route
              exact
              path="/"
              render={props => (
                <Content
                  {...props}
                  isAuthenticated={this.state.isAuthenticated}
                  user={this.state.user}
                  sendMailButtonMethod={this.sendmail.bind(this)}
                />
              )}
            />
          </Container>
        </div>
      </Router>
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
  
      this.setState({response: response});
    } catch(err) {
      this.props.showError('ERROR', JSON.stringify(err));
    }
  }

  async getUserProfile() {
    try {
      // Get the access token silently
      // If the cache contains a non-expired token, this function
      // will just return the cached token. Otherwise, it will
      // make a request to the Azure OAuth endpoint to get a token

      var accessToken = await this.userAgentApplication.acquireTokenSilent({
        scopes: config.scopes
      });

      //debugger;
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

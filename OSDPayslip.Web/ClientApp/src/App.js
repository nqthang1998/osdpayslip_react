import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'reactstrap';
import { UserAgentApplication } from 'msal';
import NavBar from './Authentication/NavBar';
import ErrorMessage from './Authentication/ErrorMessage';
import Welcome from './Authentication/Content';
import config from './Authentication/Config';
import { getUserDetails } from './Authentication/GraphService';
import './App.css'
import 'bootstrap/dist/css/bootstrap.css';

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
      isAuthenticated: (user !== null),
      loginLink: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?response_type=id_token&scope=user.read%20calendars.read%20openid%20profile&client_id=ab5572ca-cca6-46c5-86c1-8653758e75ec&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&state=0247d111-db00-49b4-86ed-f19766d848af&nonce=8e1f3b6f-f244-4648-85d7-7ea3515c99d8&client_info=1&x-client-SKU=MSAL.JS&x-client-Ver=1.1.3&prompt=select_account&client-request-id=5d72904a-6942-4162-a4f4-0e9842653b93&response_mode=fragment",
      user: {},
      error: null
    };

    if (user) {
      // Enhance user object with data from Graph
      this.getUserProfile();
    }
  }

  render() {
    let error = null;
    if (this.state.error) {
      error = <ErrorMessage message={this.state.error.message} debug={this.state.error.debug} />;
    }

    return (
      <Router>
        <div>
          <NavBar
            isAuthenticated={this.state.isAuthenticated}
            authButtonMethod={this.state.isAuthenticated ? this.logout.bind(this) : this.login.bind(this)}
            user={this.state.user}/>
          <Container>
            {error}
            <Route exact path="/"
              render={(props) =>
                <Welcome {...props}
                  isAuthenticated={this.state.isAuthenticated}
                  user={this.state.user}
                  authButtonMethod={this.login.bind(this)} />
              } />
          </Container>
        </div>
      </Router>
    );
  }

  setErrorMessage(message, debug) {
    this.setState({
      error: {message: message, debug: debug}
    });
  }

  async login() {
      await this.userAgentApplication.loginPopup(
        {
          scopes: config.scopes,
          prompt: "select_account"
      });
      await this.getUserProfile();
  }

  logout() {
    this.userAgentApplication.logout();
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

      if (accessToken) {
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
    }
    catch(err) {
      var error = {};
      if (typeof(err) === 'string') {
        var errParts = err.split('|');
        error = errParts.length > 1 ?
          { message: errParts[1], debug: errParts[0] } :
          { message: err };
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
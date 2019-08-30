import React from 'react';
import {
  Jumbotron } from 'reactstrap';

function WelcomeContent(props) {
  // If authenticated, greet the user
  if (props.isAuthenticated) {
    return (
      <div>
        <h1 style={{textAlign: "center"}}>Monthly Payslip Request</h1>
        <button onClick={props.sendMailButtonMethod}>Send Email</button>
      </div>
    );
  }

  // Not authenticated, present a sign in button
  return <React.Fragment>
            <div style={{textAlign: "center", fontWeight: "bold"}}>You have not log in yet!</div>
            <div style={{textAlign: "center"}}>Please log in to access our abilities!</div>
          </React.Fragment>;
}

export default class Content extends React.Component {
  render() {
        // Only show body content if logged in
        let bodyContent = null;
        if (this.props.isAuthenticated) {
          bodyContent = (
              //Content goes here
              <span></span>
          );
        }
    return (
      <Jumbotron style={{backgroundColor: "transparent"}}>
        <WelcomeContent
          isAuthenticated={this.props.isAuthenticated}
          user={this.props.user}
          sendMailButtonMethod={this.props.sendMailButtonMethod} />
        {bodyContent}
      </Jumbotron>
    );
  }
}
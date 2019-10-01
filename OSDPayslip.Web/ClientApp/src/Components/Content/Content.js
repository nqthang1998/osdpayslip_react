import React from "react";
import { Jumbotron } from "reactstrap";
import ListMonthPayslip from "./ListMonthPayslip/ListMonthlyPayslip";

function WelcomeContent(props) {
    // If authenticated, greet the user
    if (props.isAuthenticated) {
        return (
            <span></span>
        );
    }

    // Not authenticated, present a sign in button
    return (
        <React.Fragment>
            <div style={{ textAlign: "center", fontWeight: "bold" }}>
                You have not log in yet!
            </div>
            <div style={{ textAlign: "center" }}>
                Please log in to access our abilities!
            </div>
        </React.Fragment>
    );
}

export default class Content extends React.Component {
    render() {
        // Only show body content if logged in
        let bodyContent = null;
        if (this.props.isAuthenticated) {
            bodyContent = (
                //Content goes HERE !!!
                <ListMonthPayslip user={this.props.user.name}/>
            );
        }
        return (
            <Jumbotron style={{ backgroundColor: "transparent" }}>
                <WelcomeContent
                    isAuthenticated={this.props.isAuthenticated}
                    user={this.props.user}
                    sendMailButtonMethod={this.props.sendMailButtonMethod}
                />
                {bodyContent}
            </Jumbotron>
        );
    }
}

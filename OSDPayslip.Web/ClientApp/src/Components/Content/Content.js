import React from "react";
import { Jumbotron } from "reactstrap";
import ListMonthPayslip from "./ListMonthPayslip/ListMonthlyPayslip";
import Feather from "../../feather-pen-paper.png";

function WelcomeContent(props) {
    // If authenticated, greet the user
    if (props.isAuthenticated) {
        return <span></span>;
    }

    // Not authenticated, present a sign in button
    return (
        <React.Fragment>
            <div className="welcome-container text-center">
                <br />
                <h1>
                    𝙚𝙋𝙖𝙮𝙨𝙡𝙞𝙥
                </h1>
                <img className="icon" src={Feather} alt=""></img>
                <br />
                <br />
                <br />
                <br />
                <h2>A product of Orient Software</h2>
                <h2>Intern Team</h2>
                <br />
                <br />
                <br />
                <br />
                <br />
                <h5 className="credit">
                    Design by @Le Hoang Long - @Le Huu Phuoc
                </h5>
                <h5 className="credit">
                    @Nguyen Quoc Thang - @Nguyen Van Duc
                </h5>
                <h5 className="credit">
                    @Nguyen Ngoc Du - @Pham Ngoc Tan
                </h5>
                <br />
            </div>
            <div className="text-center" style={{marginTop: "20px", color: "white"}}>
                <h4>You have not logged in yet!</h4>
                <h5>Please log in to access our abilities!</h5>
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
                <ListMonthPayslip user={this.props.user.name} />
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

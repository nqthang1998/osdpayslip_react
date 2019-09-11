import React, { Component } from "react";
import { Stack } from "office-ui-fabric-react/lib/Stack";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { BrowserRouter as Router, Link } from "react-router-dom";
import axios from "axios";
import { UserAgentApplication } from "msal";
import config from "../../Authentication/Config";
import { sendMail } from "../../Authentication/GraphService";
import PayslipItem from "../PayslipItem/PayslipItem";
import { DefaultButton } from "office-ui-fabric-react/lib/Button";

class PayslipList extends Component {
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

        this.state = {
            request: []
        };
    }

    componentDidMount() {
        axios({
            name: "GET",
            url: "https://localhost:44304/api/PayslipDetail/46"
        }).then(res => {
            this.setState({
                request: res.data
            });
        });
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

    render() {
        return (
            <React.Fragment>
                <div className="PayslipList">
                    <div className="PayslipList-title">
                        <h1>Payslip Details</h1>
                        <div className="searchbydate">
                            <Stack>
                                <TextField placeholder="Search by Employee Id" />
                            </Stack>
                        </div>
                        <div className="send">
                            <button className="ms-Button">
                                <span className="ms-Button-label">
                                    <DefaultButton
                                        onClick={this.props.triggerParentToOpen}
                                        text="Back"
                                    />
                                </span>
                                <span className="ms-Button-label">
                                    <DefaultButton
                                        onClick={this.sendmail.bind(this)}
                                        text="Send All"
                                    />
                                </span>
                            </button>
                        </div>

                        <div>
                            <table border="1" className="table-name">
                                <thead>
                                    <tr className="ms-Table-row">
                                        <th className="ms-Table-cell"> No</th>
                                        <th className="ms-Table-cell">
                                            Employee Id
                                        </th>
                                        <th className="ms-Table-cell">
                                            Employee Name
                                        </th>
                                        <th className="ms-Table-cell">
                                            Email{" "}
                                        </th>
                                        <th className="ms-Table-cell">
                                            Status
                                        </th>
                                        <th className="ms-Table-cell">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <PayslipItem
                                        request={this.state.request}
                                        triggerParentToPreview={
                                            this.props.triggerParentToPreview
                                        }
                                    />
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
export default PayslipList;

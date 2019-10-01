// import React, { Component } from 'react';
import axios from "axios";
import * as React from "react";
import {
    Dialog,
    DialogType,
    DialogFooter
} from "office-ui-fabric-react/lib/Dialog";
import {
    PrimaryButton,
    DefaultButton
} from "office-ui-fabric-react/lib/Button";

import { UserAgentApplication } from "msal";
import { getUserDetails } from "../../../../Services/GraphService";
import config from "../../../../Services/Config";

class ButtonDialog extends React.Component {
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
            user: user,
            hideDialog: true,
            file: null,
            message: "",
            sltMonth: "1",
            userName: ""
        };

        if (user) {
            // Enhance user object with data from Graph
            this.getUserProfile();
        }
    }

    componentDidMount() {
        this.setState(
            {
                userName: this.props.data.userName
            },
            () => {
                this.forceUpdate();
            }
        );
    }

    onFileChange(e) {
        let file = e.target.files[0];
        this.setState({ file: file });
        this.selectedValue = e.target.value;
    }
    fileUpload(e) {
        let file = this.state.file;
        if(file !== null) {
            console.log(file.name);
            console.log(this.state.sltMonth);
            const formData = new FormData();
            formData.append(file.name, file);
            formData.append("Month", this.state.sltMonth.toString());
            formData.append("CreatedBy", this.state.user.displayName);
            axios({
                method: "POST",
                url: "https://localhost:44304/api/RequestDetail/create",
                data: formData
            }).then(res => {
                console.log(res);
            });
            alert("Your Request has been created Successfully !!!");
            window.location.reload();
        } else {
            alert("You cannot Create a Request without your Excel File!")
        }
    }

    onSelectChange = () => {
        var selector = document.getElementById("selectMonth");
        var monthValue = selector[selector.selectedIndex].value;
        this.setState({
            sltMonth: monthValue
        });
    };

    DeleteRequest() {
        var deleteRequest = this.props.data.deleteRequest;
        console.log("deleteRequest= ", deleteRequest);
        console.log(deleteRequest[0].Id);
        for (var i = 0; i < deleteRequest.length; i++) {
            axios({
                method: "DELETE",
                url: `https://localhost:44304/api/RequestDetail/${deleteRequest[i].Id}`
            }).then(res => {
                console.log(res);
            });
        }
    }
    onDelete = () => {
        if (
            window.confirm(
                "Are you sure you want to delete selected request(s)?"
            )
        ) {
            this.DeleteRequest();
            alert("Your Request has been deleted successfully !!!");
            window.location.reload();
        }
    };

    showDialog = () => {
        this.setState({ hideDialog: false });
    };

    closeDialog = () => {
        this.setState({ hideDialog: true });
    };

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

    render() {
        console.log(this.state.userName);
        var deleteRequest = this.props.data.deleteRequest;
        console.log(deleteRequest);
        return (
            <div className="find">
                <DefaultButton
                    className="ms-Button--primary"
                    secondaryText="Opens the Sample Dialog"
                    onClick={this.showDialog}
                >
                    <div style={{ color: "#fff" }}>
                        <i class="fas fa-plus-circle"></i> Create New Request
                    </div>
                </DefaultButton>

                <div className="delete-request">
                    <DefaultButton
                        className="ms-Button--primary"
                        onClick={this.onDelete}
                        disabled={deleteRequest.length > 0 ? false : true}
                    >
                        <div style={{ color: "#fff" }}>
                        <i class="fas fa-trash-alt"></i> Delete Request
                        </div>
                    </DefaultButton>
                </div>
                <form>
                    <Dialog
                        hidden={this.state.hideDialog}
                        onDismiss={this.closeDialog}
                        dialogContentProps={{
                            type: DialogType.largeHeader,
                            title: "Create New Request",
                            subText: "Upload file payslip format excel"
                        }}
                        modalProps={{
                            isBlocking: false,
                            styles: { main: { maxWidth: 450 } }
                        }}
                    >
                        <h5>Payslip data:</h5>
                        <input
                            type="file"
                            onChange={e => {
                                this.onFileChange(e);
                            }}
                        />
                        <select
                            className="Dropdown"
                            id="selectMonth"
                            placeholder="Select Month for Payslip..."
                            onChange={this.onSelectChange}
                        >
                            <option className="Dropdown-option" value="1">
                                January
                            </option>
                            <option className="Dropdown-option" value="2">
                                February
                            </option>
                            <option className="Dropdown-option" value="3">
                                March
                            </option>
                            <option className="Dropdown-option" value="4">
                                April
                            </option>
                            <option className="Dropdown-option" value="5">
                                May
                            </option>
                            <option className="Dropdown-option" value="6">
                                June
                            </option>
                            <option className="Dropdown-option" value="7">
                                July
                            </option>
                            <option className="Dropdown-option" value="8">
                                August
                            </option>
                            <option className="Dropdown-option" value="9">
                                September
                            </option>
                            <option className="Dropdown-option" value="10">
                                October
                            </option>
                            <option className="Dropdown-option" value="11">
                                November
                            </option>
                            <option className="Dropdown-option" value="12">
                                December
                            </option>
                        </select>

                        <DialogFooter>
                            <PrimaryButton
                                onClick={e => {
                                    this.fileUpload(e);
                                    this.closeDialog(e);
                                }}
                                type="submit"
                                text="Create"
                            />
                            <DefaultButton
                                onClick={this.closeDialog}
                                type="reset"
                                text="Cancel"
                            />
                        </DialogFooter>
                    </Dialog>
                </form>
            </div>
        );
    }
}

export default ButtonDialog;

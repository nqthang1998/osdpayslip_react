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


class ButtonDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hideDialog: true,
            file: null,
            message: "",
            sltMonth: "1",
            userName: ""
        };

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
            const formData = new FormData();
            formData.append(file.name, file);
            formData.append("Month", this.state.sltMonth.toString());
            formData.append("CreatedBy", this.state.userName);
            axios({
                method: "POST",
                url: "https://localhost:44304/api/RequestDetail/create",
                data: formData
            }).then(res => {
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
        for (var i = 0; i < deleteRequest.length; i++) {
            axios({
                method: "DELETE",
                url: `https://localhost:44304/api/RequestDetail/${deleteRequest[i].Id}`
            }).then(res => {
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

    render() {
        if(this.state.userName === undefined) {
            window.location.reload();
        }
        var deleteRequest = this.props.data.deleteRequest;
        return (
            <div className="find">
                <DefaultButton
                    className="ms-Button--primary"
                    secondaryText="Opens the Sample Dialog"
                    onClick={this.showDialog}
                >
                    <div style={{ color: "#fff" }}>
                        <i className="fas fa-plus-circle"></i> Create New Request
                    </div>
                </DefaultButton>

                <div className="delete-request">
                    <DefaultButton
                        className="ms-Button--primary"
                        onClick={this.onDelete}
                        disabled={deleteRequest.length > 0 ? false : true}
                    >
                        <div style={{ color: "#fff" }}>
                        <i className="fas fa-trash-alt"></i> Delete Request
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

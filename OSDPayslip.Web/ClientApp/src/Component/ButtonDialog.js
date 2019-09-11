// import React, { Component } from 'react';
import axios, { post } from "axios";
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
import { ChoiceGroup, Dropdown, Button } from "office-ui-fabric-react/lib";

class ButtonDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hideDialog: true,
            file: null,
            message: "",
            sltMonth: ""
        };
    }
    onFileChange(e) {
        let file = e.target.files[0];
        this.setState({ file: file });
        this.selectedValue = e.target.value;
    }
    fileUpload(e) {
        let file = this.state.file;
        console.log(file.name);
        console.log(this.state.sltMonth);
        const formData = new FormData();
        formData.append(file.name, file);
        formData.append("Month", this.state.sltMonth.toString());
        // for (let file of this.state.file) {
        //   formData.append(file.filename, file);
        //   formData.append("Month", this.selectedValue.toString());
        // }
        // const uploadReq = new HttpRequest(
        //   "POST",
        //   "https://localhost:44304/api/RequestDetail/create",
        //   formData,
        //   {
        //     reportProgress: true
        //   }
        // );
        axios({
            method: "POST",
            url: "https://localhost:44304/api/RequestDetail/create",
            data: formData
        }).then(res => {
            console.log(res);
        });
        // this.http.request(uploadReq).subscribe(event => {
        //   if (event.type === HttpEventType.Response)
        //     this.message = event.body.toString();
        //   this.setState({
        //     message: this.message
        //   });
        // });
        // alert(this.state.message);
    }

    onSelectChange = () => {
        var selector = document.getElementById("selectMonth");
        var monthValue = selector[selector.selectedIndex].value;
        this.setState({
            sltMonth: monthValue
        });
    };

    showDialog = () => {
        this.setState({ hideDialog: false });
    };

    closeDialog = () => {
        this.setState({ hideDialog: true });
    };

    render() {
        return (
            <div className="find">
                <DefaultButton
                    secondaryText="Opens the Sample Dialog"
                    onClick={this.showDialog}
                    text="Create New Request"
                />
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

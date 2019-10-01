import React, { Component } from "react";
import { Stack } from "office-ui-fabric-react/lib/Stack";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import axios from "axios";
import { UserAgentApplication } from "msal";
import config from "../../../../Services/Config";
import { sendMail } from "../../../../Services/GraphService";
import PayslipItem from "./PayslipItem/PayslipItem";
import { DefaultButton } from "office-ui-fabric-react/lib/Button";
import { Link } from "react-router-dom";

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
            request: [],
            requestInfo: [],
            baseText: [],
            requestId: this.props.match.params,
            searchField: "",
            parentCheckbox: false,
            countSuccess: 0,
            countReady: 0,
            needResend: false,
            needDisable: true
        };
    }

    async componentDidMount() {
        await axios({
            name: "GET",
            url: `https://localhost:44304/api/RequestDetail/${this.state.requestId.requestId}`
        }).then(res => {
            this.setState({
                requestInfo: res.data
            }, () => {
                this.forceUpdate();
            })
        })

        await axios({
            name: "GET",
            url: `https://localhost:44304/api/PayslipDetail/${this.state.requestId.requestId}`
        }).then(res => {
            console.log(res.data);
            this.setState(
                {
                    request: res.data
                },
                () => {
                    const readyReq = this.state.request.filter(
                        item => item.Status == 1
                    );
                    const successReq = this.state.request.filter(
                        item => item.Status == 2
                    );
                    if (successReq.length === this.state.request.length) {
                        this.setState(
                            {
                                needDisable: false,
                                countReady: readyReq.length,
                                countSuccess: successReq.length
                            },
                            () => {
                                this.forceUpdate();
                            }
                        );
                    } else if (successReq.length > 0) {
                        this.setState(
                            {
                                needResend: true,
                                countReady: readyReq.length,
                                countSuccess: successReq.length
                            },
                            () => {
                                this.forceUpdate();
                            }
                        );
                    } else {
                        this.setState(
                            {
                                countReady: readyReq.length,
                                countSuccess: successReq.length
                            },
                            () => {
                                this.forceUpdate();
                                this.renderPDF();
                            }
                        );
                    }
                }
            );
            this.setState(
                {
                    request: this.state.request.map(item => {
                        var o = Object.assign({}, item);
                        o.isChecked = false;
                        return o;
                    })
                },
                () => {
                    const statusRequest = this.state.request;
                    for (let i = 0; i < statusRequest.length; i++) {
                        setTimeout(() => {
                            if (statusRequest[i].Status === 0) {
                                statusRequest[i].Status = 1;
                                this.setState(
                                    {
                                        request: statusRequest
                                    },
                                    () => {
                                        this.forceUpdate();
                                        this.countReady();
                                    }
                                );
                            }
                            if (i == statusRequest.length - 1) {
                                this.setState({
                                    needDisable: false
                                });
                                alert(
                                    "You can send E-mail in this Request now."
                                );
                            }
                        }, i * 2500);
                    }
                }
            );
        });
    }

    countReady() {
        this.state.request.map(item => {
            if (item.Status === 1) {
                this.setState(
                    {
                        countReady: this.state.countReady + 1
                    },
                    () => {
                        this.forceUpdate();
                    }
                );
            }
        });
    }

    countSuccess() {
        this.state.request.map(item => {
            if (item.Status === 2) {
                this.setState(
                    {
                        countSuccess: this.state.countSuccess + 1,
                        countReady: this.state.countReady - 1
                    },
                    () => {
                        this.forceUpdate();
                        if (
                            this.state.countSuccess ===
                            this.state.request.length
                        ) {
                            this.updateStatusForAllSent();
                        }
                    }
                );
            }
        });
    }

    renderPDF = () => {
        const formData = new FormData();
        formData.append("RequestId", this.state.requestId.requestId);
        axios({
            method: "POST",
            url: "https://localhost:44304/api/PayslipDetail",
            data: formData
        }).then(res => {
            console.log(res);
        });
    };

    async sendmailToAll() {
        this.setState(
            {
                needDisable: true
            },
            () => {
                this.forceUpdate();
            }
        );
        if (this.state.countSuccess !== this.state.request.length) {
            const formData = new FormData();
            formData.append("RequestId", this.state.requestId.requestId);
            await axios({
                method: "POST",
                url: `https://localhost:44304/api/RequestDetail/updatepending`,
                data: formData
            });
            const formData1 = new FormData();
            formData1.append("RequestId", this.state.requestId.requestId);
            await axios({
                method: "POST",
                url: `https://localhost:44304/api/PayslipDetail/getpdf`,
                data: formData1
            }).then(res => {
                this.setState(
                    {
                        baseText: res.data
                    },
                    () => {
                        this.forceUpdate();
                    }
                );
            });
            var accessToken = await window.msal.acquireTokenSilent({
                scopes: config.scopes
            });
            for (let i = 0; i < this.state.request.length; i++) {
                console.log(this.state.request[i].Email);
                var response = await sendMail(
                    accessToken,
                    this.state.request[i].Email,
                    this.state.baseText[i],
                    this.state.requestInfo[0].PayslipForMonth,
                    this.state.request[i].EmployeeName
                );
                const formData2 = new FormData();
                formData2.append("RequestId", this.state.requestId.requestId);
                formData2.append(
                    "EmployeeID",
                    this.state.request[i].EmployeeId
                );
                await axios({
                    method: "POST",
                    url: `https://localhost:44304/api/PayslipDetail/updatestatus`,
                    data: formData2
                }).then(res => {
                    const successRequest = this.state.request;
                    successRequest[i].Status = 2;
                    this.setState(
                        {
                            request: successRequest
                        },
                        () => {
                            this.countSuccess();
                            this.forceUpdate();
                        }
                    );
                });
            }
            this.setState(
                {
                    needDisable: false
                },
                () => {
                    this.forceUpdate();
                }
            );
            // Delete PDF Files
        } else {
            this.setState(
                {
                    needDisable: false
                },
                () => {
                    this.forceUpdate();
                }
            );
            alert(
                "Cannot Send! All E-mails have been Successfully! If you want to Resend, please Create a brand new Request!"
            );
        }
    }

    async sendMailToRequested() {
        this.setState(
            {
                needDisable: true
            },
            () => {
                this.forceUpdate();
            }
        );
        const sendRequest = this.state.request.filter(
            item => item.isChecked === true
        );
        let alertNeeded = false;
        for (let i = 0; i < sendRequest.length; i++) {
            if (sendRequest[i].Status === 2) {
                alertNeeded = true;
            }
        }
        if (alertNeeded === false) {
            const formData = new FormData();
            formData.append("RequestId", this.state.requestId.requestId);
            await axios({
                method: "POST",
                url: `https://localhost:44304/api/RequestDetail/updatepending`,
                data: formData
            });
            const formData1 = new FormData();
            formData1.append("RequestId", this.state.requestId.requestId);
            await axios({
                method: "POST",
                url: `https://localhost:44304/api/PayslipDetail/getpdf`,
                data: formData1
            }).then(res => {
                this.setState(
                    {
                        baseText: res.data
                    },
                    () => {
                        this.forceUpdate();
                    }
                );
            });
            var accessToken = await window.msal.acquireTokenSilent({
                scopes: config.scopes
            });
            for (let i = 0; i < this.state.request.length; i++) {
                if (this.state.request[i].isChecked === true) {
                    var response = await sendMail(
                        accessToken,
                        this.state.request[i].Email,
                        this.state.baseText[i],
                        this.state.requestInfo[0].PayslipForMonth,
                        this.state.request[i].EmployeeName
                    );
                    const formData2 = new FormData();
                    formData2.append(
                        "RequestId",
                        this.state.requestId.requestId
                    );
                    formData2.append(
                        "EmployeeID",
                        this.state.request[i].EmployeeId
                    );
                    await axios({
                        method: "POST",
                        url: `https://localhost:44304/api/PayslipDetail/updatestatus`,
                        data: formData2
                    }).then(res => {
                        const successRequest = this.state.request;
                        successRequest[i].Status = 2;
                        this.setState(
                            {
                                request: successRequest,
                                needResend: true
                            },
                            () => {
                                this.countSuccess();
                                this.forceUpdate();
                            }
                        );
                    });
                }
            }
            this.setState(
                {
                    needDisable: false
                },
                () => {
                    this.forceUpdate();
                }
            );
        } else {
            console.log(alertNeeded);
            this.setState(
                {
                    needDisable: false
                },
                () => {
                    this.forceUpdate();
                }
            );
            alert(
                "Cannot Send! You have checked an Employee(s) who had been sent Successfully! Please uncheck them to continued!"
            );
        }

        console.log(this.state.countReady);
    }

    async sendMailToTheRest() {
        this.setState(
            {
                needDisable: true
            },
            () => {
                this.forceUpdate();
            }
        );
        if (this.state.countSuccess !== this.state.request.length) {
            const formData = new FormData();
            formData.append("RequestId", this.state.requestId.requestId);
            await axios({
                method: "POST",
                url: `https://localhost:44304/api/RequestDetail/updatepending`,
                data: formData
            });
            const formData1 = new FormData();
            formData1.append("RequestId", this.state.requestId.requestId);
            await axios({
                method: "POST",
                url: `https://localhost:44304/api/PayslipDetail/getpdf`,
                data: formData1
            }).then(res => {
                this.setState(
                    {
                        baseText: res.data
                    },
                    () => {
                        this.forceUpdate();
                    }
                );
            });
            var accessToken = await window.msal.acquireTokenSilent({
                scopes: config.scopes
            });
            for (let i = 0; i < this.state.request.length; i++) {
                if (this.state.request[i].Status === 1) {
                    var response = await sendMail(
                        accessToken,
                        this.state.request[i].Email,
                        this.state.baseText[i],
                        this.state.requestInfo[0].PayslipForMonth,
                        this.state.request[i].EmployeeName
                    );
                    const formData2 = new FormData();
                    formData2.append(
                        "RequestId",
                        this.state.requestId.requestId
                    );
                    formData2.append(
                        "EmployeeID",
                        this.state.request[i].EmployeeId
                    );
                    await axios({
                        method: "POST",
                        url: `https://localhost:44304/api/PayslipDetail/updatestatus`,
                        data: formData2
                    }).then(res => {
                        const successRequest = this.state.request;
                        successRequest[i].Status = 2;
                        this.setState(
                            {
                                request: successRequest,
                                needResend: true
                            },
                            () => {
                                this.countSuccess();
                                this.forceUpdate();
                            }
                        );
                    });
                }
            }
            this.setState(
                {
                    needDisable: false
                },
                () => {
                    this.forceUpdate();
                }
            );
        } else {
            alert(
                "Cannot Send! All E-mails have been Successfully! If you want to Resend, please Create a brand new Request!"
            );
            this.setState(
                {
                    needDisable: false
                },
                () => {
                    this.forceUpdate();
                }
            );
        }
    }

    checkAll() {
        var newRequest = this.state.request;
        this.setState(
            {
                request: newRequest,
                parentCheckbox: !this.state.parentCheckbox
            },
            () => {
                for (var i = 0; i < this.state.request.length; i++) {
                    newRequest[i].isChecked = this.state.parentCheckbox;
                    this.forceUpdate();
                }
            }
        );
    }

    onSearch(e) {
        this.setState({
            searchField: e.target.value
        });
    }

    updateRequest(newReq) {
        this.setState(
            {
                request: newReq
            },
            () => {
                this.forceUpdate();
            }
        );
    }

    async detelePDF() {
        await axios({
            method: "DELETE",
            url: `https://localhost:44304/api/PayslipDetail/deletepdf/${this.state.requestId.requestId}`
        }).then(res => {
            console.log(res);
        });
    }

    async updateStatusForAllSent() {
        const formData = new FormData();
        formData.append("RequestId", this.state.requestId.requestId);
        await axios({
            method: "POST",
            url: `https://localhost:44304/api/RequestDetail/updatesucces`,
            data: formData
        });

        // alert("All E-mails have been sent Successfully !");
    }

    render() {
        const filteredRequest = this.state.request.filter(item =>
            item.EmployeeName.toLowerCase().includes(
                this.state.searchField.toLowerCase()
            )
        );

        const sendRequest = this.state.request.filter(
            item => item.isChecked == true
        );

        const requestInfo = this.state.requestInfo[0];
        console.log(this.state.requestInfo[0]);

        return (
            <React.Fragment>
                <div className="PayslipList">
                    <div className="PayslipList-title">
                        <br />
                        <h1>Payslip Details</h1>
                        {this.state.requestInfo.map(item => (
                        <h3>
                            Request created in: <strong>{item.CreateDate.slice(8, 10) +
                                "-" +
                                item.CreateDate.slice(5, 7) +
                                "-" +
                                item.CreateDate.slice(0, 4)}</strong> | By: <strong>{item.CreateBy}</strong> - <strong>{this.state.countSuccess}/
                            {this.state.request.length}</strong> E-mail has been sent{" "}
                            <span style={{ color: "green" }}>Successfully</span>
                            .
                        </h3>
                        ))}
                        <div className="searchbydate">
                            <Stack>
                                <TextField
                                    placeholder="Search by Employee Name"
                                    onChange={this.onSearch.bind(this)}
                                />
                            </Stack>
                        </div>
                        <div className="send">
                            <button className="ms-Button">
                                {sendRequest.length > 0 ? (
                                    <span className="ms-Button-label">
                                        <DefaultButton
                                            className="ms-Button--primary"
                                            onClick={this.sendMailToRequested.bind(
                                                this
                                            )}
                                            disabled={this.state.needDisable}
                                        >
                                            <div style={{ color: "#fff" }}><i class="far fa-paper-plane"></i> Send</div>
                                            </DefaultButton>
                                    </span>
                                ) : this.state.needResend === true ? (
                                    <DefaultButton
                                        className="ms-Button--primary"
                                        onClick={this.sendMailToRequested.bind(
                                            this
                                        )}
                                        onClick={this.sendMailToTheRest.bind(
                                            this
                                        )}
                                        disabled={this.state.needDisable}
                                    >
                                        <div style={{ color: "#fff" }}><i class="far fa-paper-plane"></i> Send to the Rest</div>
                                        </DefaultButton>
                                ) : (
                                            <span className="ms-Button-label">
                                                <DefaultButton
                                                    className="ms-Button--primary"
                                                    onClick={this.sendmailToAll.bind(
                                                        this
                                                    )}
                                                    disabled={this.state.needDisable}
                                                >
                                                    <div style={{ color: "#fff" }}><i class="far fa-paper-plane"></i> Send All</div>
                                                </DefaultButton>
                                            </span>
                                        )}
                            </button>
                        </div>

                        <div>
                            <table border="1" className="table-name">
                                <thead>
                                    <tr className="ms-Table-row">
                                        <th className="ms-Table-cell">
                                            <input
                                                id="parent-checkbox"
                                                type="checkbox"
                                                className="ms-CheckBox-input"
                                                onClick={this.checkAll.bind(
                                                    this
                                                )}
                                                checked={
                                                    this.state.parentCheckbox
                                                }
                                            ></input>
                                        </th>
                                        <th className="ms-Table-cell"> No</th>
                                        <th className="ms-Table-cell">
                                            Employee Id
                                        </th>
                                        <th className="ms-Table-cell">
                                            Employee Name
                                        </th>
                                        <th className="ms-Table-cell">Email</th>
                                        <th className="ms-Table-cell">
                                            Status
                                        </th>
                                        <th className="ms-Table-cell">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.searchField === "" ? (
                                        <PayslipItem
                                            updateRequest={this.updateRequest.bind(
                                                this
                                            )}
                                            data={{
                                                request: this.state.request,
                                                oldRequest: this.state.request,
                                                requestId: this.state.requestId
                                                    .requestId
                                            }}
                                        />
                                    ) : (
                                            <PayslipItem
                                                updateRequest={this.updateRequest.bind(
                                                    this
                                                )}
                                                data={{
                                                    request: filteredRequest,
                                                    oldRequest: this.state.request,
                                                    requestId: this.state.requestId
                                                        .requestId
                                                }}
                                            />
                                        )}
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

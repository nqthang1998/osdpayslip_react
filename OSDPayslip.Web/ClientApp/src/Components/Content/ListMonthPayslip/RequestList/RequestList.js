import React, { Component } from "react";
import RequestItem from "./RequestItem/RequestItem";
import axios from "axios";

import { Stack } from "office-ui-fabric-react/lib/Stack";
import ButtonDialog from "./ButtonDialog";

class RequestList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            request: [],
            userName: this.props.data.userName,
            searchField: "0",
            parentCheckbox: false
        };
    }

    async componentDidMount() {
        await axios({
            name: "GET",
            url: "https://localhost:44304/api/RequestDetail"
        }).then(res => {
            this.setState({
                request: res.data.reverse()
            });
            this.setState({
                request: this.state.request.map(item => {
                    var o = Object.assign({}, item);
                    o.isChecked = false;
                    return o;
                })
            });
        });
    }

    onChange = e => {
        this.setState({
            searchField: e.target.value
        });
    };

    resetSelected = e => {
        document.getElementById("searchMonth").selectedIndex = 0;
        this.setState({
            searchField: "0"
        });
    };

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

    render() {
        const filteredRequest = this.state.request.filter(
            item => item.PayslipForMonth === this.state.searchField
        );
        const deleteRequest = this.state.request.filter(
            item => item.isChecked === true
        );

        return (
            <React.Fragment>
                <div className="Dropdown-Label">
                    <div className="EmployeeList">
                        <h1>Monthly Payslip Request</h1>
                    </div>
                    <br />
                    <br />
                    <br />
                    <br />
                    <div className="find">
                        <Stack>
                            <select
                                className="Dropdown1"
                                onChange={this.onChange}
                                id="searchMonth"
                            >
                                <option
                                    className="Dropdown-option"
                                    value="0"
                                ></option>
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
                        </Stack>
                    </div>

                        <button
                            className="ms-Button ms-Button--default"
                            style={{
                                float: "right",
                                marginTop: "-40px",
                                height: "30px",
                                width: "px",
                                borderStyle: "solid"
                            }}
                            onClick={this.resetSelected}
                        >
                            <i className="fas fa-window-close fa-2x" style={{width: "50%"}}></i>
                        </button>

                    <div className="send">
                        <ButtonDialog
                            data={{
                                userName: this.state.userName,
                                deleteRequest: deleteRequest
                            }}
                        />
                    </div>

                    <table border="0" className="table-name">
                        <thead className="thead-row">
                            <tr className="ms-Table-row">
                                <th className="ms-Table-cell">
                                    <input
                                        id="parent-checkbox"
                                        type="checkbox"
                                        className="ms-CheckBox-input"
                                        onClick={this.checkAll.bind(this)}
                                        checked={this.state.parentCheckbox}
                                    ></input>
                                </th>
                                <th className="ms-Table-cell">Request No</th>
                                <th className="ms-Table-cell">Create Date</th>
                                <th className="ms-Table-cell">
                                    No of Employee
                                </th>
                                <th className="ms-Table-cell">
                                    Payslip for Month
                                </th>
                                <th className="ms-Table-cell">Created by</th>
                                <th className="ms-Table-cell">Status</th>
                                <th className="ms-Table-cell">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.searchField === "0" ? (
                                <RequestItem
                                    updateRequest={this.updateRequest.bind(
                                        this
                                    )}
                                    data={{
                                        request: this.state.request,
                                        oldRequest: this.state.request,
                                        updateRequest: this.props.data
                                            .updateRequest,
                                        parentCheckbox: this.state
                                            .parentCheckbox
                                    }}
                                />
                            ) : (
                                <RequestItem
                                    updateRequest={this.updateRequest.bind(
                                        this
                                    )}
                                    data={{
                                        request: filteredRequest,
                                        oldRequest: this.state.request,
                                        updateRequest: this.props.data
                                            .updateRequest,
                                        parentCheckbox: this.state
                                            .parentCheckbox
                                    }}
                                />
                            )}
                        </tbody>
                    </table>
                </div>
            </React.Fragment>
        );
    }
}

export default RequestList;

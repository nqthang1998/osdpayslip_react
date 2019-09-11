import React, { Component } from "react";
import EmployeeItem from "../EmployeeItem/EmployeeItem";
import axios from "axios";

import { Stack } from "office-ui-fabric-react/lib/Stack";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import ButtonDialog from "../../Component/ButtonDialog";

class EmployeeList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            request: []
        };
    }

    componentDidMount() {
        axios({
            name: "GET",
            url: "https://localhost:44304/api/RequestDetail"
        }).then(res => {
            this.setState({
                request: res.data
            });
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className="Dropdown-Label">
                    <div className="EmployeeList">
                        <h1>Monthly Payslip Request</h1>
                    </div>
                    <div className="find">
                        <Stack>
                            <TextField placeholder="Search by Date" />
                        </Stack>
                    </div>
                    <div className="send">
                        <ButtonDialog />
                    </div>

                    <table border="1" className="table-name">
                        <thead>
                            <tr className="ms-Table-row">
                                <th className="ms-Table-cell">Request No</th>
                                <th className="ms-Table-cell">Employee Date</th>
                                <th className="ms-Table-cell">
                                    No of Employee
                                </th>
                                <th className="ms-Table-cell">Payslip for</th>
                                <th className="ms-Table-cell">Created by</th>
                                <th className="ms-Table-cell">Status</th>
                                <th className="ms-Table-cell">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <EmployeeItem
                                request={this.state.request}
                                triggerParentToOpen={
                                    this.props.triggerParentToOpen
                                }
                            />
                        </tbody>
                    </table>
                </div>
            </React.Fragment>
        );
    }
}

export default EmployeeList;

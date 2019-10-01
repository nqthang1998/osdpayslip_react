import React, { Component } from "react";
import RequestList from "./RequestList/RequestList";

class ListMonthPayslip extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // isOpen: 0,
            // isPreview: 0,
            employeeId: 0,
            request: []
        };
    }

    updateRequest(req) {
        this.setState({
            request: req
        });
    }

    updateEmployeeId(employeeId) {
        this.setState({
            employeeId: employeeId
        });
    }

    render() {
        console.log(this.state.isOpen);
        console.log("The Employee Id is: " + this.state.Id)
        return (
            <div className="Payslisp">
                <div className="create-search">
                    <div>
                    <RequestList
                                data={{
                                    request: this.state.request,
                                    updateRequest: this.updateRequest.bind(this),
                                    userName: this.props.user
                                }}
                            />
                    </div>
                </div>
            </div>
        );
    }
}
export default ListMonthPayslip;

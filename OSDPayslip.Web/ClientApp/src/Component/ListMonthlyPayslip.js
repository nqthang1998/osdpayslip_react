import React, { Component } from "react";
import { Stack } from "office-ui-fabric-react/lib/Stack";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import ButtonDialog from "./ButtonDialog";
import EmployeeList from "../components/EmployeeList/EmployeeList";
import PayslipList from "../components/PayslipList/PayslipList";
import PayslipReport from "./PayslipReport";
import { BrowserRouter as Router, Link } from "react-router-dom";

class ListMonthPayslip extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: 0,
            isPreview: 0,
            request: []
        };
    }

    updateIsOpen = () => {
        if (this.state.isOpen === 0) {
            this.setState({
                isOpen: 1
            });
        } else {
            this.setState({
                isOpen: 0
            });
        }
    };

    updateIsPreview = () => {
        if (this.state.isPreview === 0) {
            this.setState({
                isPreview: 1
            });
        } else {
            this.setState({
                isPreview: 0
            });
        }
    };

    updateRequest(request) {
        this.setState({
            request: []
        })
        if(request)
            this.setState({
                request: request
            })
    }

    render() {
        return (
            <div className="Payslisp">
                <div className="create-search">
                    <div>
                        {this.state.isOpen === 0 ? (
                            <EmployeeList
                                triggerParentToOpen={this.updateIsOpen}
                                triggerParentToRequest={this.updateRequest(this.state.request)}
                            />
                        ) : this.state.isPreview === 0 ? (
                            <PayslipList
                                triggerParentToOpen={this.updateIsOpen}
                                triggerParentToPreview={this.updateIsPreview}
                                triggerParentToRequest={this.updateRequest(this.state.request)}
                            />
                        ) : (
                            <PayslipReport
                                triggerParentToPreview={this.updateIsPreview}
                                triggerParentToRequest={this.updateRequest(this.state.request)}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
export default ListMonthPayslip;

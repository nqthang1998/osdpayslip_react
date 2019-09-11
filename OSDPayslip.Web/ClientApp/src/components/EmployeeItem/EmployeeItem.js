import React, { Component } from "react";
import { Stack } from "office-ui-fabric-react/lib/Stack";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { sizeBoolean } from "office-ui-fabric-react";

class EmployeeItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
        this.isOpenClicked = this.isOpenClicked.bind(this);
    }

    isOpenClicked() {
        if (this.state.isOpen === false) {
            this.setState({ isOpen: false });
        } else {
            this.setState({ isOpen: true });
        }
    }

    render() {
        var req = this.props.request;
        console.log(req);

        return (
            <React.Fragment>
                {req.map(item => (
                    <tr className="ms-Table-row" key={item.Id}>
                        <td className="ms-Table-cell">{item.Id}</td>
                        <td className="ms-Table-cell">
                            {item.CreateDate.slice(8, 10) +
                                "-" +
                                item.CreateDate.slice(5, 7) +
                                "-" +
                                item.CreateDate.slice(0, 4) +
                                " | " +
                                item.CreateDate.slice(11, 16)}
                        </td>
                        <td className="ms-Table-cell">{item.NoOfDeployee}</td>
                        <td className="ms-Table-cell">
                            {item.PayslipForMonth}
                        </td>
                        <td className="ms-Table-cell">{item.CreateBy}</td>
                        <td className="ms-Table-cell">
                            {item.Status === 0 ? (
                                <h3 className="new" style={{ color: "red" }}>
                                    New
                                </h3>
                            ) : item.Status === 1 ? (
                                <h3 className="new" style={{ color: "yellow" }}>
                                    Partially Sent
                                </h3>
                            ) : (
                                <h3 className="new" style={{ color: "green" }}>
                                    Fully Sent
                                </h3>
                            )}
                        </td>
                        <td className="ms-Table-cell">
                            <button
                                className="open"
                                onClick={this.props.triggerParentToOpen}
                            >
                                Open
                            </button>
                        </td>
                    </tr>
                ))}
            </React.Fragment>
        );
    }
}

export default EmployeeItem;

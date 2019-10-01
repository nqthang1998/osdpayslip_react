import React, { Component } from "react";
import { Link } from "react-router-dom";

class PayslipItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            request: this.props.data.request,
            oldRequest: this.props.data.oldRequest,
            parentCheckbox: this.props.data.parentCheckbox,
            requestId: this.props.data.requestId
        };
    }

    componentDidMount() {
        this.setState({
            request: this.props.data.request
        })
    }

    findIndex(Id){
        var req = this.props.data.request;
        for (var i = 0; i < req.length; i++) {
            if (req[i].Stt === Id) {
                return i;
            }
        }
        return -1;
    }

    handleCheck = Stt => {
        this.setState({
            request: this.props.data.request,
            oldRequest: this.props.data.oldRequest
        }, () => {
            var foundIndex = this.findIndex(Stt);
            var newRequest = this.state.request;
            newRequest[foundIndex].isChecked = !newRequest[foundIndex].isChecked;

            this.setState({
                request: newRequest
            }, () => {
                var request = this.state.request;
                var oldRequest = this.state.oldRequest;
                request.map(item => {
                    oldRequest.map(olditem => {
                        if (item.Id === olditem.Id) {
                            olditem = item
                        }
                    })
                })
                this.setState({
                    oldRequest: oldRequest
                }, () => {
                    this.props.updateRequest(this.state.oldRequest);
                })

            })
        })
    }

    render() {
        var item = [];
        item = this.props.data.request;
        return <React.Fragment>{this.showItem(item)}</React.Fragment>;
    }

    showItem(item) {
        var result = null;
        if (item.length > 0) {
            result = item.map(item => {
                return (
                    <tr className="ms-Table-row" key={item.Stt}>
                        <td className="ms-Table-cell">
                            <input
                                id="child-checkbox"
                                type="checkbox"
                                className="ms-CheckBox-input"
                                checked={item.isChecked}
                                onClick={() => this.handleCheck(item.Stt)}
                            ></input>
                        </td>
                        <td className="ms-Table-cell">{item.Stt}</td>
                        <td className="ms-Table-cell">{item.EmployeeId}</td>
                        <td className="ms-Table-cell">{item.EmployeeName}</td>
                        <td className="ms-Table-cell">{item.Email}</td>
                        <td className="ms-Table-cell">
                            {item.Status === 0 ? (
                                <h3
                                    className="status"
                                    style={{ color: "#B8860B" }}
                                >
                                    Pending for PDF
                                </h3>
                            ) : item.Status === 1 ? (
                                <h3
                                    className="status"
                                    style={{ color: "orange" }}
                                >
                                    Ready to Send
                                </h3>
                            ) : item.Status === 2 ? (
                                <h3
                                    className="status"
                                    style={{ color: "green" }}
                                >
                                    Success
                                </h3>
                            ) : (
                                <h3 className="status" style={{ color: "red" }}>
                                    Fail
                                </h3>
                            )}
                        </td>
                        <td className="ms-Table-cell">
                            <Link to={`/preview/${this.state.requestId}/${item.EmployeeId}`} target="_blank">
                                <button
                                    className="preview"
                                    style={{
                                        fontWeight: "bold",
                                        textDecoration: "underline"
                                    }}
                                >
                                    Preview
                                </button>
                            </Link>
                        </td>
                    </tr>
                );
            });
        } else {
            return (
                <tr>
                    <td colSpan={7} style={{ color: "grey" }}>
                        No Employee in this Request!
                    </td>
                </tr>
            );
        }
        return result;
    }
}
export default PayslipItem;

import React, { Component } from "react";
import { Link } from "react-router-dom";

class RequestItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            request: this.props.data.request,
            oldRequest: this.props.data.oldRequest,
            parentCheckbox: this.props.data.parentCheckbox,
        };
    }

    componentDidMount() {
        this.setState({
            request: this.props.data.request
        })
    }

    findIndex(requestId) {
        var req = this.props.data.request;
        for (var i = 0; i < req.length; i++) {
            if (req[i].Id === requestId) {
                return i;
            }
        }
        return -1;
    }

    handleCheck = requestId => {
        console.log(requestId);
        this.setState({
            request: this.props.data.request,
            oldRequest: this.props.data.oldRequest
        }, () => {
            console.log(this.state.request);
            var foundIndex = this.findIndex(requestId);
            var newRequest = this.state.request;
            newRequest[foundIndex].isChecked = !newRequest[foundIndex].isChecked;

            this.setState({
                request: newRequest
            }, () => {
                console.log(this.state.request);
                var request = this.state.request;
                var oldRequest = this.state.oldRequest;
                request.map(item => {
                    oldRequest.map(olditem => {
                        if (item.Id === olditem.Id) {
                            olditem = item
                        }
                    })
                })
                console.log(oldRequest)
                this.setState({
                    oldRequest: oldRequest
                }, () => {
                    this.props.updateRequest(this.state.oldRequest);
                })

            })
            console.log(foundIndex);
        })
    }

    render() {
        var req = this.props.data.request;
        console.log(req);
        console.log(this.state.request);
        return <React.Fragment>{this.showItem(req)}</React.Fragment>;
    }
    showItem(item) {
        var result = null;
        if (item.length > 0) {
            result = item.map(item => {
                return (
                    <tr className="ms-Table-row" key={item.Id}>
                        <td className="ms-Table-cell">
                            <input
                                id="child-checkbox"
                                type="checkbox"
                                className="ms-CheckBox-input"
                                checked={item.isChecked}
                                onClick={() => this.handleCheck(item.Id)}
                            ></input>
                        </td>
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
                            {item.PayslipForMonth === 1
                                ? "January"
                                : item.PayslipForMonth === 2
                                    ? "February"
                                    : item.PayslipForMonth === 3
                                        ? "March"
                                        : item.PayslipForMonth === 4
                                            ? "April"
                                            : item.PayslipForMonth === 5
                                                ? "May"
                                                : item.PayslipForMonth === 6
                                                    ? "June"
                                                    : item.PayslipForMonth === 7
                                                        ? "July"
                                                        : item.PayslipForMonth === 8
                                                            ? "August"
                                                            : item.PayslipForMonth === 9
                                                                ? "September"
                                                                : item.PayslipForMonth === 10
                                                                    ? "October"
                                                                    : item.PayslipForMonth === 11
                                                                        ? "November"
                                                                        : "December"}
                        </td>
                        <td className="ms-Table-cell">{item.CreateBy}</td>
                        <td className="ms-Table-cell">
                            {item.Status === 0 ? (
                                <h3 className="new" style={{ color: "red" }}>
                                    New
                                </h3>
                            ) : item.Status === 1 ? (
                                <h3 className="new" style={{ color: "#B8860B" }}>
                                    Partially Sent
                                </h3>
                            ) : (
                                        <h3
                                            className="new"
                                            style={{ color: "green" }}
                                        >
                                            Fully Sent
                                </h3>
                                    )}
                        </td>
                        <td className="ms-Table-cell">
                            <Link to={`/details/${item.Id}`}>
                                <button
                                    className="preview"
                                    style={{
                                        fontWeight: "bold",
                                        backgroundColor: "while"
                                    }}
                                >
                                    View Details
                                </button>
                            </Link>
                        </td>
                    </tr>
                );
            });
        } else {
            return (
                <tr>
                    <td colSpan={8} style={{ color: "grey" }}>
                        No Request Available!
                    </td>
                </tr>
            );
        }
        return result;
    }
}
export default RequestItem;

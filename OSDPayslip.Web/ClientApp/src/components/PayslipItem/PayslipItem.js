import React, { Component } from "react";
import { Link } from "react-router-dom";

class PayslipItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            SttReq: []
        };
    }

    onDataSend = id => {
        var data = this.props.request;
        this.setState({
            SttReq: data[id-1]
        });
        console.log(this.state.SttReq);
    };

    render() {
        var req = this.props.request;
        console.log(req);

        return (
            <React.Fragment>
                {req.map(item => (
                    <tr className="ms-Table-row" key={item.Stt}>
                        <td className="ms-Table-cell">{item.Stt}</td>
                        <td className="ms-Table-cell">{item.EmployeeId}</td>
                        <td className="ms-Table-cell">{item.EmployeeName}</td>
                        <td className="ms-Table-cell">{item.Email}</td>
                        <td className="ms-Table-cell">
                            {item.Status === 0 ? (
                                <h3 className="status"  style={{ color: "red" }}>Pending</h3>
                            ) : item.Status === 1 ? (
                                <h3 className="status" style={{ color: "orange" }}>Ready</h3>
                            ) : item.Status === 2 ? (
                                <h3 className="status" style={{ color: "green" }}>Success</h3>
                            ) : (
                                <h3 className="status" style={{ color: "green" }}>Fail</h3>
                            )}
                        </td>
                        <td className="ms-Table-cell">
                            <button
                                className="open"
                                onClick={this.props.triggerParentToPreview}
                            >
                                Preview
                            </button>
                        </td>
                    </tr>
                ))}
            </React.Fragment>
        );
    }
}

export default PayslipItem;

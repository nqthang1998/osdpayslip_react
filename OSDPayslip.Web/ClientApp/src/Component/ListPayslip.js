import React, { Component } from 'react';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { TextField } from 'office-ui-fabric-react/lib/TextField';

import { BrowserRouter as Router,  Link} from "react-router-dom";
class ListPayslip extends Component {
   
    render() {
        return (
            <div className="Paylist">
                <h3 className="title">
                    Monthly Payslip Request
                </h3>
                <div className="find">
                    <Stack >
                        <TextField placeholder="Search by Date" />
                    </Stack>
                </div>
                <div className="send">
                    <button className="ms-Button">
                        <span className="ms-Button-label">Create New Request</span>
                    </button>
                </div>
                <div>
               
                    <table border="1" className="table-name" >
                        <tbody><tr className="ms-Table-row">
                            <td className="ms-Table-cell"> No</td>
                            <td className="ms-Table-cell">Employee Id</td>
                            <td className="ms-Table-cell">Employee Name</td>
                            <td className="ms-Table-cell">Email </td>
                            <td className="ms-Table-cell">Status</td>
                            <td className="ms-Table-cell">Action</td>
                        </tr>
                            <tr className="ms-Table-row">
                                <td className="ms-Table-cell">1</td>
                                <td className="ms-Table-cell"></td>
                                <td className="ms-Table-cell"></td>
                                <td className="ms-Table-cell"></td>
                                <td className="ms-Table-cell"></td>
                                <td className="ms-Table-cell">
                                    <button className="ms-Button">
                                        <span className="ms-Button-label"><Link to="/payslip" target="_blank">Preview</Link>
                                        
                                        </span>
                                    </button>
                                </td>
                            </tr>
                            <tr className="ms-Table-row">
                                <td className="ms-Table-cell">File name</td>
                                <td className="ms-Table-cell">File name</td>
                                <td className="ms-Table-cell">File name</td>
                                <td className="ms-Table-cell">Location</td>
                                <td className="ms-Table-cell">Modified</td>
                                <td className="ms-Table-cell">Type</td>
                            </tr>
                            <tr className="ms-Table-row">
                                <td className="ms-Table-cell">File name</td>
                                <td className="ms-Table-cell">File name</td>
                                <td className="ms-Table-cell">File name</td>
                                <td className="ms-Table-cell">Location</td>
                                <td className="ms-Table-cell">Modified</td>
                                <td className="ms-Table-cell">Type</td>
                            </tr>
                            <tr className="ms-Table-row">
                                <td className="ms-Table-cell">File name</td>
                                <td className="ms-Table-cell">File name</td>
                                <td className="ms-Table-cell">File name</td>
                                <td className="ms-Table-cell">Location</td>
                                <td className="ms-Table-cell">Modified</td>
                                <td className="ms-Table-cell">Type</td>
                            </tr>
                            <tr className="ms-Table-row">
                                <td className="ms-Table-cell">File name</td>
                                <td className="ms-Table-cell">File name</td>
                                <td className="ms-Table-cell">File name</td>
                                <td className="ms-Table-cell">Location</td>
                                <td className="ms-Table-cell">Modified</td>
                                <td className="ms-Table-cell">Type</td>
                            </tr>
                        </tbody></table>
            
                </div>
                </div>
                );
            }
        };
        export default ListPayslip;

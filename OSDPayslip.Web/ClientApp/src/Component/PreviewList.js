import React, { Component } from 'react';
import PayslipReport from './PayslipReport'
import { BrowserRouter as Router, Route } from "react-router-dom";
import ListPayslip from './ListPayslip'

class PreviewList extends Component {

    render() {     
        return (
            <Router>
              
                <Route path="/payslip" component={PayslipReport} />
                <Route exact path="/" component={ListPayslip} />
                
            </Router>

        );
    }
};
export default PreviewList;

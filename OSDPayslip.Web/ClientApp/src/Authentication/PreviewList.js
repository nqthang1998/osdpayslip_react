import React, { Component } from 'react';
import PayslipReport from './PayslipReport'
import { BrowserRouter as Router, Route } from "react-router-dom";

import PreviewListTest from './ListPayslip';
class PreviewList extends Component {

    render() {     
        return (
            <Router>
              
                <Route path="/payslip" component={PayslipReport} />
                <Route exact path="/" component={PreviewListTest} />
                
            </Router>

        );
    }
};
export default PreviewList;

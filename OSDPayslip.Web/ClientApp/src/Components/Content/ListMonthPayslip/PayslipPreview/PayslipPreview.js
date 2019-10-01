import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'

class PayslipPreview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            request: [],
            requestInfo: [],
            requestId: this.props.match.params.requestId,
            employeeId: this.props.match.params.employeeId
        };
    }


    componentDidMount() {
        axios({
            name: "GET",
            url: `https://localhost:44304/api/RequestDetail/${this.state.requestId}`
        }).then(res => {
            this.setState({
                requestInfo: res.data
            },() => {
                console.log(this.state.requestInfo[0].PayslipForMonth)
            })
        })

        axios({
            name: "GET",
            url: `https://localhost:44304/api/PayslipDetail/getpreview/${this.state.requestId}/${this.state.employeeId}`
        }).then(res => {
            this.setState({
                request: res.data
            });
        });
    }


    render() {
        var requestInfo = [];
        var requestNote = [];
        requestInfo = this.state.requestInfo;
        requestNote = this.state.request;
        var MonthText
        let MonthName = ["January","February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        for (let i = 0; i < MonthName.length; i++) {
            if ((requestInfo.PayslipForMonth - 1) === i) {
                MonthText = MonthName[i]
            }
        }
        console.log(requestInfo[0])

        return (

            <div className="PaylistReport">
                <table className="header">
                    <tbody><tr>
                        <td>Kính gửi Anh/ Chị-<i>To Mr./ Mrs. </i>{this.state.request.EmployeeName}</td>
                        <td rowSpan={3} style={{ textAlign: 'right', verticalAlign: 'top' }}><img alt="" src="https://www.orientsoftware.net/Themes/OrientSoftwareTheme/Content/Images/header/osd-logo-black.png" /></td>
                    </tr>
                        <tr>
                            <td>Phòng nhân sự xin gửi đến Anh/ Chị thông tin về Lương và Thu nhập - <i>HR Dept would like to send you the payslip information</i></td>
                        </tr>
                        <tr>
                            <td />
                        </tr>
                    </tbody></table>
                <table>
                    <tbody><tr>
                        <td className="text-center"><h1>BẢNG LƯƠNG - PAYSLIP</h1></td>
                    </tr>
                        <tr>
                            <td className="text-center">Tháng {requestInfo.PayslipForMonth} - Năm/ <i>Month - Year</i></td>
                        </tr>
                    </tbody></table>
                <table className="table employee-info">
                    <thead>
                        <tr>
                            <td colSpan={6}><h2>Thông tin nhân viên/ <i>Employee information</i></h2></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ width: '1%', whiteSpace: 'nowrap' }}>Mã nhân viên/ <i>Employee code</i></td>
                            <td style={{ width: '100px', textAlign: 'center' }}>{this.state.request.EmployeeID}</td>
                            <td style={{ width: '1%', whiteSpace: 'nowrap' }}>Họ và tên/ <i>Fullname</i></td>
                            <td style={{ width: '100px', textAlign: 'center' }}>{this.state.request.EmployeeName}</td>
                            <td style={{ width: '1%', whiteSpace: 'nowrap' }}>Bộ phận- Nhóm/<i> Dept-Team</i></td>
                            <td style={{ width: '100px', textAlign: 'center' }}>{this.state.request.DeptTeam}</td>
                        </tr>
                    </tbody>
                </table>
                <table className="table timesheet-info">
                    <thead>
                        <tr>
                            <td colSpan={4}><h2>Thông tin chấm công/ <i>Working timesheet information</i></h2></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td> Ngày công chuẩn/ <i>Standard working day</i>
                            </td>
                            <td style={{ textAlign: "center" }}>  {this.state.request.StandardWorkingDay}</td>
                            <td>Phép năm còn lại/ <i>Leave balance</i></td>
                            <td style={{ textAlign: "center" }}>  {this.state.request.LeaveBalance}</td>
                        </tr>
                        <tr>
                            <td>Ngày công thực tế/ <i>Actual working day</i></td>
                            <td style={{ textAlign: "center" }}>  {this.state.request.ActualWorkingDay}</td>
                            <td>Nghỉ lễ/ <i>Holidays</i></td>
                            <td style={{ textAlign: "center" }}>  {this.state.request.Holidays}</td>
                        </tr>
                        <tr>
                            <td>Ngày nghỉ không tính lương/ <i>Unpaid leave</i></td>
                            <td style={{ textAlign: "center" }}>  {this.state.request.UnpaidLeave}</td>
                            <td />
                            <td />
                        </tr>
                    </tbody>
                </table>
                <table className="table calculate-salary">
                    <thead>
                        <tr>
                            <td colSpan={2}><h2>A. Tổng thu nhập/ <i>Total gross income</i> = (3+4+5+6)</h2></td>
                            <td colSpan={2} className="text-right">{this.state.request.ActuaSalary + this.state.request.Allowance + (this.state.request.Bonus + this.state.request.Salary13Th + this.state.request.IncomeOther) + this.state.request.OtherDeductions}</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1. Lương căn bản/ <i>Basic salary</i></td>
                            <td className="text-right">{this.state.request.BasicSalary}</td>
                            <td><strong>5. Các khoản thu nhập khác/ <i>Other income</i></strong></td>
                            <td className="text-right"><strong></strong>{this.state.request.Bonus + this.state.request.Salary13Th + this.state.request.IncomeOther}</td>
                        </tr>
                        <tr>
                            <td rowSpan={2}>2. Lương gộp/ <i>Gross salary</i></td>
                            <td rowSpan={2} className="text-right">{this.state.request.GrossSalary}</td>
                            <td>- Thưởng/ <i>Bonus</i></td>
                            <td className="text-right">{this.state.request.Bonus}</td>
                        </tr>
                        <tr>
                            <td>- Lương tháng 13/ <i>13th salary</i></td>
                            <td className="text-right">{this.state.request.Salary13Th}</td>
                        </tr>
                        <tr>
                            <td><strong>3. Lương theo ngày công/ <i>Actual salary</i></strong></td>
                            <td className="text-right"><strong>{this.state.request.ActuaSalary}</strong></td>
                            <td>- Các khoản khác/ Others</td>
                            <td className="text-right">{this.state.request.IncomeOther}</td>
                        </tr>
                        <tr>
                            <td><strong>4. Phụ cấp/ <i>Allowance</i></strong></td>
                            <td className="text-right"><strong>{this.state.request.Allowance}</strong></td>
                            <td><strong>6. Các khoản thu lại khác/ <i>Other deductions</i></strong></td>
                            <td className="text-right"><strong>{this.state.request.OtherDeductions}</strong></td>
                        </tr>
                    </tbody>
                </table>
                <table className="table calculate-salary">
                    <thead>
                        <tr>
                            <td colSpan={2}><h2>B. Các khoản khấu trừ/ <i>Deductions</i> = (1+3)</h2></td>
                            <td colSpan={2} className="text-right">{this.state.request.GrossSalary}</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>1. Bảo hiểm/ <i>Insurance</i> = (10,5% x A1)</strong></td>
                            <td className="text-right"><strong>{this.state.request.BasicSalary * 0.105}</strong></td>
                            <td>2. Số người phụ thuộc/ <i>No of dependants</i></td>
                            <td className="text-right">{this.state.request.NoOfDependants}</td>
                        </tr>
                        <tr>
                            <td>1.1 BHXH/ <i>Social insurance</i> (8%)</td>
                            <td className="text-right">{this.state.request.SocialInsurance}</td>
                            <td><strong>3. Thuế TNCN/ <i>Personal income tax </i></strong></td>
                            <td className="text-right"><strong>{this.state.request.PersonalIncomeTax}</strong></td>
                        </tr>
                        <tr>
                            <td>1.2 BHYT/ <i>Health insurance</i> (1.5%)</td>
                            <td className="text-right">{this.state.request.HealthInsurance}</td>
                            <td />
                            <td />
                        </tr>
                        <tr>
                            <td>1.3 BHTN/ <i>Unemployment insurance</i> (1%)</td>
                            <td className="text-right">{this.state.request.UnemploymentInsurance}</td>
                            <td />
                            <td />
                        </tr>
                    </tbody>
                </table>
                <table className="table calculate-salary">
                    <thead>
                        <tr>
                            <td colSpan={2}><h2>C. Các khoản thanh toán khác/<br />  <i>Other payment</i> = (1+2+3)</h2></td>
                            <td colSpan={2} className="text-right">{this.state.request.PaymentOther}</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>1. Khoản thanh toán từ bảo hiểm/<br /> <i>Payment from social insurance, premium insurance</i></strong></td>
                            <td className="text-right"><strong>{this.state.request.PaymentFromSocialInsurance}</strong></td>
                            <td><strong>3. Quyết toán thuế TNCN/ <i>Finalization of PIT</i></strong></td>
                            <td className="text-right"><strong>{this.state.request.FinalizationOfPIT}</strong></td>
                        </tr>
                        <tr>
                            <td><strong>2. Các khoản thanh toán khác/ <i>Others</i></strong></td>
                            <td className="text-right"><strong>{this.state.request.GrossSalary}</strong></td>
                            <td />
                            <td />
                        </tr>
                    </tbody>
                </table>
                <table className="table calculate-salary net-income">
                    <thead>
                        <tr>
                            <td style={{ paddingTop: '10px', paddingBottom: '10px' }} colSpan={2}><h2>D. Thu nhập thực nhận/ <i>Net income</i> = (A-B+C)</h2></td>
                            <td style={{ paddingTop: '10px', paddingBottom: '10px' }} colSpan={2} className="text-right">{this.state.request.NetIncome}</td>
                        </tr>
                    </thead>
                </table>
                <div className="notes">
                    <h3 style={{ fontWeight: 900 }}>Ghi chú/ <i>Notes:</i></h3>
                    <h5></h5>
                    <hr />
                    <hr />
                    <hr />
                    <hr />
                    <h3>Lưu ý/ <i>Notice:</i></h3>
                    <ul>
                        <li style={{ fontSize: "14px" }}>Mọi vấn đề liên quan đến tiền lương, ngày công và các phúc lợi khác, vui lòng gửi email cho Phòng Nhân Sự trong vòng 5 ngày kể từ ngày nhận lương để
                được giải đáp/ <i>Any questions about salary, working day and other benefits, please write an email to HR department within 5 days from received salary for
                  more details.</i>
                        </li>
                        <li style={{ fontSize: "14px" }}>Thông tin về lương phải được bảo mật/ <i>Information from salary is confidential</i></li>
                    </ul>
                    <h3>Trân trọng/ <i>Regards</i></h3>
                </div>
            </div>
        );
    }
}
export default PayslipPreview;


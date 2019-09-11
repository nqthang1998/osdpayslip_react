import React, { Component } from 'react';
import axios from 'axios'

class PayslipReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            request : []
        };
    }

    render() {

        return (
            <div className="PaylistReport">
                <table className="header">
                    <tbody><tr>
                        <td>Kính gửi Anh/ Chị- <i>To Mr./ Mrs. </i></td>
                        <td rowSpan={3} style={{ textAlign: 'right', verticalAlign: 'top' }}><img alt="" src="https://www.orientsoftware.net/Themes/OrientSoftwareTheme/Content/Images/header/osd-logo-black.png" /></td>
                    </tr>
                        <tr>
                            <td>Phòng nhân sự xin gửi đến Anh/ Chị thông tin về Lương và Thu nhập - <i>HR Dept would like to send you the payslip information</i></td>
                        </tr>
                        <tr>
                            <td />
                        </tr>
                    </tbody></table>
                <table className="title">
                    <tbody><tr>
                        <td className="text-center"><h1>BẢNG LƯƠNG - PAYSLIP</h1></td>
                    </tr>
                        <tr>
                            <td className="text-center">Tháng- Năm/ <i>Month- Year</i></td>
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
                            <td style={{ width: '100px' }}>{this.state.Id}</td>
                            <td style={{ width: '1%', whiteSpace: 'nowrap' }}>Họ và tên/ <i>Fullname</i></td>
                            <td >{this.state.Fullname}</td>
                            <td style={{ width: '1%', whiteSpace: 'nowrap' }}>Bộ phận- Nhóm/<i> Dept-Team</i></td>
                            <td >{this.state.Group}</td>
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
                            <td>Ngày công chuẩn/ <i>Standard working day</i></td>
                            <td />
                            <td>Phép năm còn lại/ <i>Leave balance</i></td>
                            <td />
                        </tr>
                        <tr>
                            <td>Ngày công thực tế/ <i>Actual working day</i></td>
                            <td />
                            <td>Nghỉ lễ/ <i>Holidays</i></td>
                            <td />
                        </tr>
                        <tr>
                            <td>Ngày nghỉ không tính lương/ <i>Unpaid leave</i></td>
                            <td />
                            <td />
                            <td />
                        </tr>
                    </tbody>
                </table>
                <table className="table calculate-salary">
                    <thead>
                        <tr>
                            <td colSpan={2}><h2>A. Tổng thu nhập/ <i>Total gross income</i> = (3+4+5+6)</h2></td>
                            <td colSpan={2} className="text-right">xxxx</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1. Lương căn bản/ <i>Basic salary</i></td>
                            <td className="text-right">xxx</td>
                            <td><strong>5. Các khoản thu nhập khác/ <i>Other income</i></strong></td>
                            <td className="text-right"><strong>xxx</strong></td>
                        </tr>
                        <tr>
                            <td rowSpan={2}>2. Lương gộp/ <i>Gross salary</i></td>
                            <td rowSpan={2} className="text-right">xxx</td>
                            <td>- Thưởng/ <i>Bonus</i></td>
                            <td className="text-right">xxx</td>
                        </tr>
                        <tr>
                            <td>- Lương tháng 13/ <i>13th salary</i></td>
                            <td className="text-right">xxx</td>
                        </tr>
                        <tr>
                            <td><strong>3. Lương theo ngày công/ <i>Actual salary</i></strong></td>
                            <td className="text-right"><strong>xxx</strong></td>
                            <td>- Các khoản khác/ Others</td>
                            <td className="text-right">xxx</td>
                        </tr>
                        <tr>
                            <td><strong>4. Phụ cấp/ <i>Allowance</i></strong></td>
                            <td className="text-right"><strong>xxx</strong></td>
                            <td><strong>6. Các khoản thu lại khác/ <i>Other deductions</i></strong></td>
                            <td className="text-right"><strong>xxx</strong></td>
                        </tr>
                    </tbody>
                </table>
                <table className="table calculate-salary">
                    <thead>
                        <tr>
                            <td colSpan={2}><h2>B. Các khoản khấu trừ/ <i>Deductions</i> = (1+3)</h2></td>
                            <td colSpan={2} className="text-right">xxxx</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>1. Bảo hiểm/ <i>Insurance</i> = (1.1+1.2+1.3)</strong></td>
                            <td className="text-right"><strong>xxx</strong></td>
                            <td>2. Số người phụ thuộc/ <i>No of dependants</i></td>
                            <td className="text-right">xxx</td>
                        </tr>
                        <tr>
                            <td>1.1 BHXH/ <i>Social insurance</i> (8%)</td>
                            <td className="text-right">xxx</td>
                            <td><strong>3. Thuế TNCN/ <i>Personal income tax </i></strong></td>
                            <td className="text-right"><strong>xxx</strong></td>
                        </tr>
                        <tr>
                            <td>1.2 BHYT/ <i>Health insurance</i> (1.5%)</td>
                            <td className="text-right">xxx</td>
                            <td />
                            <td />
                        </tr>
                        <tr>
                            <td>1.3 BHTN/ <i>Unemployment insurance</i> (1%)</td>
                            <td className="text-right">xxx</td>
                            <td />
                            <td />
                        </tr>
                    </tbody>
                </table>
                <table className="table calculate-salary">
                    <thead>
                        <tr>
                            <td colSpan={2}><h2>C. Các khoản thanh toán khác/ <i>Other payment</i> = (1+2+3)</h2></td>
                            <td colSpan={2} className="text-right">xxxx</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>1. Khoản thanh toán từ bảo hiểm/ <i>Payment from social insurance, premium insurance</i></strong></td>
                            <td className="text-right"><strong>xxx</strong></td>
                            <td><strong>3. Quyết toán thuế TNCN/ <i>Finalization of PIT</i></strong></td>
                            <td className="text-right"><strong>xxx</strong></td>
                        </tr>
                        <tr>
                            <td><strong>2. Các khoản thanh toán khác/ <i>Others</i></strong></td>
                            <td className="text-right"><strong>xxx</strong></td>
                            <td />
                            <td />
                        </tr>
                    </tbody>
                </table>
                <table className="table calculate-salary net-income">
                    <thead>
                        <tr>
                            <td style={{ paddingTop: '10px', paddingBottom: '10px' }} colSpan={2}><h2>D. Thu nhập thực nhận/ <i>Net income</i> = (A-B+C)</h2></td>
                            <td style={{ paddingTop: '10px', paddingBottom: '10px' }} colSpan={2} className="text-right">xxxx</td>
                        </tr>
                    </thead>
                </table>
                <div className="notes">
                    <h2 style={{ fontWeight: 900 }}>Ghi chú/ <i>Notes:</i></h2>
                    <h3>Ghi chú chung/ <i>General notes:</i></h3>
                    <ul>
                        <li>
                            Thu nhập không chịu thuế: tiền hoàn thuế hàng năm, tiền chi hộ chế độ BHXH/ <i>Non-taxable income: refund of personal income tax, payment of social insuance.</i>
                        </li>
                        <li>
                            Các khoản thu khác: tiền bồi thường chi phí đào tạo, nộp thuế bổ sung/ <i>Other receivables: training fee compensation, additional tax payment.</i>
                        </li>
                        <li>
                            Phụ cấp: khuyến học, trainer, chứng chỉ Microsoft, internet/ <i>Allowance: study promotion, trainer, Microsoft certification, internet.</i>
                        </li>
                        <li>
                            Nộp BHXH, BHYT, BHTN: 10,5% lương căn bản/ <i>Social insurance, health insurance, unemployment insurance: 10,5% basic salary. </i>
                        </li>
                    </ul>
                    <h3>Ghi chú cá nhân/ <i>Individual notes:</i></h3>
                    <hr />
                    <hr />
                    <hr />
                    <hr />
                    <h3>Lưu ý/ <i>Notice:</i></h3>
                    <ul>
                        <li>Mọi vấn đề liên quan đến tiền lương, ngày công và các phúc lợi khác, vui lòng gửi email cho Phòng Nhân Sự trong vòng 5 ngày kể từ ngày nhận lương để
                được giải đáp/ <i>Any questions about salary, working day and other benefits, please write an email to HR department within 5 days from received salary for
                  more details.</i>
                        </li>
                        <li>Thông tin về lương phải được bảo mật/ <i>Information from salary is confidential</i></li>
                    </ul>
                    <h3>Trân trọng/ <i>Regards</i></h3>
                </div>
            </div>
        );
    }
}
export default PayslipReport;

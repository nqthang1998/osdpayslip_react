using OSDPayslip.Models.Abstract;
using System;
using System.Collections.Generic;
using System.Text;

namespace OSDPayslip.Service.Payslip.DTO
{
    public class OutputEmployeePayslipList
    {
        public int Stt;
        public string EmployeeId;
        public string EmployeeName;
        public string Email;
        public Status Status;
    }
}

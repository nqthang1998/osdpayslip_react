using OSDPayslip.Data.Infrastructure;
using OSDPayslip.Models.Abstract;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace OSDPayslip.Models.Models
{
    public class PayslipDetail : DomainEntity<int>, IAuditable
    {
        public int StandardWorkingDay { get; set; }
        public int ActualWorkingDay { get; set; }
        public int UnpaidLeave { get; set; }
        public int LeaveBalance { get; set; }
        public int Holidays { get; set; }
        // II.Total gross income
        public double? BasicSalary { get; set; }
        public double? GrossSalary { get; set; }
        public double? ActuaSalary { get; set; }
        public double? Allowance { get; set; }
        // II.1.Other income
        public double? Bonus { get; set; }
        public double? Salary13Th { get; set; }
        public double? IncomeOther { get; set; }
        public double? OtherDeductions { get; set; }
        // III.Deductions
        //
        public double? Insurance { get; set; }
        public double? SocialInsurance { get; set; }
        public double? HealthInsurance { get; set; }
        public double? UnemploymentInsurance { get; set; }
        public int? NoOfDependants { get; set; }
        public double? PersonalIncomeTax { get; set; }
        /// IV. Other payment 
        public double? PaymentFromSocialInsurance { get; set; }
        public double? FinalizationOfPIT { get; set; }
        public double? PaymentOther { get; set; }
        public double? NetIncome { get; set; }
        // Employee
        public string EmployeeID { get; set; }
        [ForeignKey("EmployeeID")]
        public Employee Employee { get; set; }
        public int RequestID { get; set; }
        [ForeignKey("RequestID")]
        public RequestDetail RequestDetail { get; set; }
        public DateTime? CreateDate { get; set; }
        public string CreateBy { get; set; }
        public DateTime? ModifyDate { get; set; }
        public string ModifyBy { get; set; }
        public Status Status { get; set; }
    }
}

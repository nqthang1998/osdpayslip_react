namespace OSDPayslip.Service.HandlePdf.DTO
{
    public class InputPdfFile
    {
        public string Id { get; set; }
        public string FullName { get; set; }
        public string DeptTeam { get; set; }
        public int StandardWorkingDay { get; set; }
        public int ActualWorkingDay { get; set; }
        public int UnpaidLeave { get; set; }
        public int LeaveBalance { get; set; }
        public int Holidays { get; set; }
        public double? BasicSalary { get; set; }

        public double? GrossSalary { get; set; }
        public double? ActuaSalary { get; set; }
        public double? Allowance { get; set; }
        public double? Bonus { get; set; }

        public double? Salary13Th { get; set; }
        public double? IncomeOther { get; set; }
        public double? OtherDeductions { get; set; }
        public double? Insurance { get; set; }

        public double? SocialInsurance { get; set; }
        public double? HealthInsurance { get; set; }
        public double? UnemploymentInsurance { get; set; }
        public int? NoOfDependants { get; set; }
        public double? PersonalIncomeTax { get; set; }
        public double? PaymentFromSocialInsurance { get; set; }

        public double? FinalizationOfPIT { get; set; }
        public double? PaymentOther { get; set; }
        public double? NetIncome { get; set; }
        public string MonthYear { get; set; }
    }
}
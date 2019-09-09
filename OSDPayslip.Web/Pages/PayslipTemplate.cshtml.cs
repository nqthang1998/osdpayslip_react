using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using OSDPayslip.Models.ViewModels;

namespace OSDPayslip.Web.Pages
{
    public class PayslipTemplateModel : PageModel
    {
        public EmployeeViewModel _employeeViewModel;
        public PayslipDetailViewModel _payslipDetailViewModel;
        public void OnGet(EmployeeViewModel employeeViewModel, PayslipDetailViewModel payslipDetailViewModel)
        {
            _employeeViewModel = employeeViewModel;
            _payslipDetailViewModel = payslipDetailViewModel;
        }
    }
}
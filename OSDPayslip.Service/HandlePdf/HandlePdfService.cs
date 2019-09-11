using IronPdf;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using OSDPayslip.Application.Reponsitories.Interfaces;
using OSDPayslip.Service.HandlePdf.DTO;
using OSDPayslip.Service.Request;
using OSDPayslip.Service.ViewRender;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace OSDPayslip.Service.HandlePdf
{
    public class HandlePdfService : IHandlePdfService
    {
        private readonly IViewRenderService _viewRenderService;
        private readonly IPayslipDetailReponsitory _payslipDetailReponsitory;
        private readonly IEmployeeReponsitory _employeeReponsitory;
        private readonly IRequestService _requestDetailService;

        public HandlePdfService(IViewRenderService viewRenderService, IPayslipDetailReponsitory payslipDetailReponsitory, IEmployeeReponsitory employeeReponsitory, IRequestService requestService)
        {
            _viewRenderService = viewRenderService;
            _employeeReponsitory = employeeReponsitory;
            _payslipDetailReponsitory = payslipDetailReponsitory;
            _requestDetailService = requestService;
        }

        public bool ConvertHtmlToPdf(int RequestID)
        {

            var payslips = _payslipDetailReponsitory.FindAll().Where(x => x.RequestID == RequestID).ToList();
            var request =  _requestDetailService.GetById(RequestID);
            string[] months = new string[] { "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" };
            string month = months[request.PayslipForMonth];
            if (payslips == null)
            {
                return false;
            }
            try
            {
                foreach (var item in payslips)
                {
                    var employee = _employeeReponsitory.FindById(item.EmployeeID);
                    var date = DateTime.Now;
                    InputPdfFile model = new InputPdfFile()
                    {
                        Id = item.EmployeeID,
                        FullName = employee.FullName,
                        DeptTeam = employee.DeptTeam,
                        StandardWorkingDay = item.StandardWorkingDay,
                        ActualWorkingDay = item.ActualWorkingDay,
                        UnpaidLeave = item.UnpaidLeave,
                        LeaveBalance = item.LeaveBalance,
                        Holidays = item.Holidays,
                        BasicSalary = item.BasicSalary,
                        GrossSalary = item.GrossSalary,
                        ActuaSalary = item.ActuaSalary,
                        Allowance = item.Allowance,
                        Bonus = item.Bonus,
                        Salary13Th = item.Salary13Th,
                        IncomeOther = item.IncomeOther,
                        OtherDeductions = item.OtherDeductions,
                        SocialInsurance = item.SocialInsurance,
                        HealthInsurance = item.HealthInsurance,
                        UnemploymentInsurance = item.UnemploymentInsurance,
                        NoOfDependants = item.NoOfDependants,
                        PersonalIncomeTax = item.PersonalIncomeTax,
                        PaymentFromSocialInsurance = item.PaymentFromSocialInsurance,
                        FinalizationOfPIT = item.FinalizationOfPIT,
                        PaymentOther = item.PaymentOther,
                        NetIncome = item.NetIncome,
                        MonthYear = date.Month.ToString() + date.Year.ToString(),
                    };
                    var StringHtml =  _viewRenderService.RenderToStringAsync(@"../../Pages/PayslipTemplate", model).GetAwaiter().GetResult();
                    var pdfPrintOptions = new PdfPrintOptions()
                    {
                        DPI = 300,
                        PaperSize = PdfPrintOptions.PdfPaperSize.A4,
                    };
                    HtmlToPdf Renderer = new HtmlToPdf(pdfPrintOptions);
                    Renderer.RenderHtmlAsPdf(StringHtml).SaveAs(@"..\OSDPayslip.Web\wwwroot\PDF\" + model.Id + "_Payslips_" + month + ".pdf");
                    PdfDocument Pdf = PdfDocument.FromFile(@"..\OSDPayslip.Web\wwwroot\PDF\" + model.Id + "_Payslips_" + month + ".pdf");
                    Pdf.Password = "luong" + date.Month.ToString() + date.Year.ToString();
                    Pdf.SaveAs(@"..\OSDPayslip.Web\wwwroot\PDF\" + model.Id + "_Payslips_" + month + ".pdf");
                }
            }
            catch(Exception ex)
            {
                throw ex;
            }
            return true;
        }
    }
}
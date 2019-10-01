using AutoMapper;
using IronPdf;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using OSDPayslip.Application.Reponsitories.Interfaces;
using OSDPayslip.Models.Abstract;
using OSDPayslip.Models.Models;
using OSDPayslip.Models.ViewModels;
using OSDPayslip.Service.HandlePdf.DTO;
using OSDPayslip.Service.Request;
using OSDPayslip.Service.ViewRender;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using static IronPdf.PdfDocument;

namespace OSDPayslip.Service.HandlePdf
{
    public class HandlePdfService : IHandlePdfService
    {
        private readonly IViewRenderService _viewRenderService;
        private readonly IPayslipDetailReponsitory _payslipDetailReponsitory;
        private readonly IEmployeeReponsitory _employeeReponsitory;
        private readonly IRequestService _requestDetailService;
        private readonly IRequestDetailReponsitory _requestDetailReponsitory;
        private readonly Mapper _mapper;
        string[] months = new string[] { "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" };
        public HandlePdfService(Mapper mapper, IViewRenderService viewRenderService, IPayslipDetailReponsitory payslipDetailReponsitory, IEmployeeReponsitory employeeReponsitory, IRequestService requestService,IRequestDetailReponsitory requestDetailReponsitory)
        {
            _viewRenderService = viewRenderService;
            _employeeReponsitory = employeeReponsitory;
            _payslipDetailReponsitory = payslipDetailReponsitory;
            _requestDetailService = requestService;
            _requestDetailReponsitory = requestDetailReponsitory;
            _mapper = mapper;
        }
        public List<string> ConvertPdfToBase64(int RequestID)
        {
            var payslips = _payslipDetailReponsitory.FindAll().Where(x => x.RequestID == RequestID).ToList();
            var request = _requestDetailService.GetById(RequestID);
            List<string> listPdf = new List<string>();
            foreach (var item in payslips)
            {
                    string month = months[request.PayslipForMonth];
                    var employee = _employeeReponsitory.FindById(item.EmployeeID);
                    byte[] pdfBytes = File.ReadAllBytes(@"..\OSDPayslip.Web\wwwroot\PDF\" + RequestID.ToString() + @"\" + employee.Id + "_Payslips_" + month + ".pdf");
                    string pdfBase64 = Convert.ToBase64String(pdfBytes);
                    listPdf.Add(pdfBase64);
            }
            return listPdf;
        }
        public bool DeleteFolder(int RequestID)
        {
            string folderPath = @"..\OSDPayslip.Web\wwwroot\PDF\" + RequestID.ToString();
            if (Directory.Exists(folderPath))
            {
                Directory.Delete(folderPath);
                return true;
            }
            return false;
        }
        public string CreatePassWord(string identityId, string birthday)
        {
            string password;
            string[] dayAndMonth = birthday.Split('/');
            password = "luong" + dayAndMonth[0] + dayAndMonth[1] + identityId;
            return password;
        }
        public InputPdfFile InputPdfFile(PayslipDetail item)
        {
            var date = DateTime.Now;
            Employee employee = _employeeReponsitory.FindById(item.EmployeeID);
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
                Insurance = item.Insurance,
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
                TotalGrossIncome = item.ActuaSalary + item.Allowance + item.IncomeOther + item.OtherDeductions,
                TotalInsurance = item.SocialInsurance + item.HealthInsurance + item.UnemploymentInsurance,
                TotalDeduction = item.SocialInsurance + item.HealthInsurance + item.UnemploymentInsurance + item.PersonalIncomeTax,
                TotalOtherPayment = item.PaymentFromSocialInsurance + item.FinalizationOfPIT + item.PaymentOther,
                BirthDay = employee.BirthDay,
                IdentidyId = employee.IdentidyId,
                Notes = item.Notes.Split(';')
            };
            return model;
        }
        public bool ConvertHtmlToPdf(int RequestID)
        {
            var payslips = _payslipDetailReponsitory.FindAll().Where(x => x.RequestID == RequestID).ToList();
            var request = _requestDetailService.GetById(RequestID);
            var temp = _requestDetailReponsitory.FindById(RequestID);
            _requestDetailReponsitory.Commit();
            string month = months[request.PayslipForMonth];
            if (payslips == null)
            {
                return false;
            }

            foreach (var item in payslips)
            {
                PdfDocument checkPDF = null;
                InputPdfFile model = InputPdfFile(item);
                string StringHtml = _viewRenderService.RenderToStringAsync(@"../../Pages/PayslipTemplate", model).GetAwaiter().GetResult();
                string folderPath = @"..\OSDPayslip.Web\wwwroot\PDF\" + RequestID.ToString();
                string pdfPath = folderPath + @"\" + model.Id + "_Payslips_" + month + ".pdf";
                var pdfPrintOptions = new PdfPrintOptions()
                {
                    DPI = 300,
                };

                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }
                HtmlToPdf Renderer = new HtmlToPdf(pdfPrintOptions);
                Renderer.PrintOptions.PaperSize = PdfPrintOptions.PdfPaperSize.A2;
                checkPDF = Renderer.RenderHtmlAsPdf(StringHtml).SaveAs(pdfPath);
                if (checkPDF != null)
                {
                    PdfDocument Pdf = PdfDocument.FromFile(pdfPath);
                    PdfSecuritySettings securitySettings = Pdf.SecuritySettings;
                    securitySettings.UserPassword = CreatePassWord(model.IdentidyId,model.BirthDay);
                    if (Pdf.Password != null)
                    {
                        Pdf.SaveAs(pdfPath);
                    }
                }
            }

            return true;
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using OSDPayslip.Data.Infrastructure;
using OSDPayslip.Models.ViewModels;
using OSDPayslip.Service.Employees;
using OSDPayslip.Service.HandlePdf;
using OSDPayslip.Service.Payslip;
using OSDPayslip.Service.Payslip.DTO;
using OSDPayslip.Service.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;

namespace OSDPayslip.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PayslipDetailController : Controller
    {
        private readonly IPayslipService _payslipService;
        private readonly IHandlePdfService _handlePdfService;
        private readonly IEmployeeService _employeeService;
        private readonly IServiceProvider _services;
        public PayslipDetailController(IPayslipService payslipService, IEmployeeService employeeService, IHandlePdfService handlePdfService, IServiceProvider services)
        {
            _employeeService = employeeService;
            _payslipService = payslipService;
            _handlePdfService = handlePdfService;
            _services = services;
        }

        // GET: api/PayslipDetail
        [HttpGet]
        [Route("getpayslips/{id}")]
        public ActionResult<IEnumerable<PayslipDetailViewModel>> GetPayslipDetails(int id)
        {
            return _payslipService.GetAll().Where(x => x.RequestID == id).ToList();
        }

        // GET: api/PayslipDetail/5
        [HttpGet("{id}")]
        public ActionResult<IEnumerable<OutputEmployeePayslipList>> GetPayslipDetail(int id)
        {
            var payslipDetail = _payslipService.GetAllByRequestId(id).ToList();
            List<OutputEmployeePayslipList> output = new List<OutputEmployeePayslipList>();
            int stt = 1;
            foreach (var item in payslipDetail)
            {
                var employee = _employeeService.GetById(item.EmployeeID);
                var temp = new OutputEmployeePayslipList()
                {
                    Stt = stt,
                    EmployeeId = employee.Id,
                    Email = employee.Email,
                    EmployeeName = employee.FullName,
                    Status = item.Status,
                };
                output.Add(temp);
                stt++;
            }
            if (payslipDetail == null)
            {
                return NotFound();
            }
            return output;
        }


        // POST: api/PayslipDetail
        [HttpPost]
        public ActionResult PostPayslipDetail(int Id)
        {
            ThreadPool.QueueUserWorkItem(async task =>
            {
                await Task.Run(() =>
                {
                    using (var scope = _services.CreateScope())
                    {
                        var handlePdfService = scope.ServiceProvider
                            .GetRequiredService<IHandlePdfService>();
                        handlePdfService.ConvertHtmlToPdf(Id);
                    }
                });
            });
            return Json("Send complete!!");
        }

        // DELETE: api/PayslipDetail/5
        [HttpDelete("{id}")]
        public ActionResult<PayslipDetailViewModel> DeletePayslipDetail(int id)
        {
            var payslipDetail = _payslipService.GetById(id);
            if (payslipDetail == null)
            {
                return NotFound();
            }

            _payslipService.Delete(id);
            _payslipService.Save();

            return payslipDetail;
        }
    }
}
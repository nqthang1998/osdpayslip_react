using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using OSDPayslip.Data;
using OSDPayslip.Models.ViewModels;
using OSDPayslip.Service.Employees;
using OSDPayslip.Service.HandlePdf;
using OSDPayslip.Service.Payslip;
using OSDPayslip.Service.Payslip.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
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
        private readonly IServiceScopeFactory _serviceScopeFactory;

        public PayslipDetailController(IPayslipService payslipService, IEmployeeService employeeService, IHandlePdfService handlePdfService, IServiceScopeFactory serviceScopeFactory)
        {
            _employeeService = employeeService;
            _payslipService = payslipService;
            _handlePdfService = handlePdfService;
            _serviceScopeFactory = serviceScopeFactory;
        }

        // GET: api/PayslipDetail
        [HttpGet]
        [Route("getpayslips/{id}")]
        public ActionResult<IEnumerable<PayslipDetailViewModel>> GetPayslipDetails(int id)
        {
            return _payslipService.GetAll().Where(x => x.RequestID == id).ToList();
        }

        [HttpGet]
        [Route("getpreview/{idrequest}/{employeeid}")]
        public OutputPreviewPayslip GetPreviewPayslips(int idRequest, string EmployeeID)
        {
            return _payslipService.GetPayslipPreviews(idRequest, EmployeeID);
        }
        [HttpPost]
        [Route("updatestatus")]
        public void UpdateStatus()
        {
            var requestId = Convert.ToInt32(Request.Form["RequestId"]);
            var EmployeeID = Convert.ToString(Request.Form["EmployeeID"]);
            _payslipService.UpdateStatus(EmployeeID, requestId);
        }

        [HttpPost]
        [Route("getpdf")]
        public IEnumerable<string> GetBase64PDF()
        {
            var id = Convert.ToInt32(Request.Form["RequestId"]); 
            return _handlePdfService.ConvertPdfToBase64(id);
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
        public ActionResult PostPayslipDetail()
        {
            var requestId = Request.Form["RequestId"];
            int Id = Convert.ToInt32(requestId);
            ThreadPool.QueueUserWorkItem(async task =>
            {
                await Task.Run(() =>
                {
                    _payslipService.MyDispose();
                    using (var scope = _serviceScopeFactory.CreateScope())
                    {
                        var handlePdfService = scope.ServiceProvider
                            .GetRequiredService<IHandlePdfService>();
                        handlePdfService.ConvertHtmlToPdf(Id);
                    }
                });
            });
            return Json("Send complete!!");
        }

        [HttpDelete("{id}")]
        [Route("deletepdf/{id}")]
        public ActionResult DeleteFolder(int id)
        {
            if (_handlePdfService.DeleteFolder(id))
            {
                return Json("Deltete complete!!");
            }
            return Json("Deltete Fail!!");
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
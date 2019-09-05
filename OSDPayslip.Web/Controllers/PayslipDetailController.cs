using Microsoft.AspNetCore.Mvc;
using OSDPayslip.Models.ViewModels;
using OSDPayslip.Service.Employees;
using OSDPayslip.Service.Payslip;
using OSDPayslip.Service.Payslip.DTO;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OSDPayslip.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PayslipDetailController : ControllerBase
    {
        private readonly IPayslipService _payslipService;
        private readonly IEmployeeService _employeeService;
        public PayslipDetailController(IPayslipService payslipService, IEmployeeService employeeService)
        {
            _employeeService = employeeService;
            _payslipService = payslipService;
        }

        // GET: api/PayslipDetail
        [HttpGet("{id}")]
        [Route("getpayslips")]
        public ActionResult<IEnumerable<PayslipDetailViewModel>> GetPayslipDetails(int id)
        {
            return _payslipService.GetAll().Where(x=>x.RequestID == id).ToList();
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
        public ActionResult<PayslipDetailViewModel> PostPayslipDetail(PayslipDetailViewModel payslipDetail)
        {
            _payslipService.Add(payslipDetail);
            _payslipService.Save();
            return CreatedAtAction("GetPayslipDetail", new { id = payslipDetail.Id }, payslipDetail);
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
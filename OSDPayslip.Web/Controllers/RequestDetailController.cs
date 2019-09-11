using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using OSDPayslip.Models.ViewModels;
using OSDPayslip.Service.Payslip;
using OSDPayslip.Service.Request;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;

namespace OSDPayslip.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RequestDetailController : Controller
    {
        private readonly IRequestService _requestService;
        private readonly IPayslipService _payslipService;
        private readonly IHostingEnvironment _hostingEnvironment;

        public RequestDetailController(IRequestService requestService, IHostingEnvironment hostingEnvironment, IPayslipService payslipService)
        {
            _requestService = requestService;
            _hostingEnvironment = hostingEnvironment;
            _payslipService = payslipService;
        }

        // GET: api/RequestDetail
        [HttpGet]
        public ActionResult<IEnumerable<RequestDetailViewModel>> GetRequestDetail()
        {
            return _requestService.GetAll().ToList();
        }

        [HttpPost]
        [Route("create")] // localhost:/api/RequestDetail/create
        public ActionResult ReadExcelFile()
        {
            try
            {
                var file = Request.Form.Files[0];
                var month = Request.Form["Month"];
                string webRootPath = _hostingEnvironment.WebRootPath;
                string[] months = new string[] { "Jan", "Feb", "Mar", "Apr",
                       "May", "Jun", "July", "Aug",
                    "Sep", "Oct", "Nov", "Dec" };
                string fileName = months[Convert.ToInt32(month) - 1] + "_" + ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                string filePath = @".\wwwroot\Upload\";
                FileInfo fileInfo = new FileInfo(Path.Combine(filePath, fileName));
                _payslipService.MoveFile(file, webRootPath, months[Convert.ToInt32(month) - 1]);

                var count = _payslipService.CountNoOfEmployee(fileInfo);
                var requestId = _requestService.CreateNewRequest(Convert.ToInt32(month), count);
                try { 
                _payslipService.HandleExcelFile(fileInfo, requestId);
                }catch(Exception ex)
                {
                    _requestService.Delete(requestId);
                    return Json("Upload Failed: " + ex.Message);
                   }

                return Json("Upload Successful.");
            }
            catch (System.Exception ex)
            {
                return Json("Upload Failed: " + ex.Message);
            }
        }

        // GET: api/RequestDetail/5
        [HttpGet("{id}")]
        public ActionResult<IEnumerable<RequestDetailViewModel>> GetRequestDetail(int id)
        {
            var requestDetail = _requestService.GetAllById(id).ToList();

            if (requestDetail == null)
            {
                return NotFound();
            }

            return requestDetail;
        }

        // POST: api/RequestDetail
        [HttpPost]
        public ActionResult<RequestDetailViewModel> PostRequestDetail(RequestDetailViewModel requestDetail)
        {
            _requestService.Add(requestDetail);
            _requestService.Save();
            return CreatedAtAction("GetRequestDetail", new { id = requestDetail.Id }, requestDetail);
        }

        // DELETE: api/RequestDetail/5
        [HttpDelete("{id}")]
        public ActionResult<RequestDetailViewModel> DeleteRequestDetail(int id)
        {
            var requestDetail = _requestService.GetById(id);
            if (RequestDetailExists(id) == false)
            {
                return NotFound();
            }

            _requestService.Delete(id);
            _requestService.Save();
            return requestDetail;
        }

        private bool RequestDetailExists(int id)
        {
            var requestDetail = _requestService.GetById(id);
            if (requestDetail != null)
            {
                return true;
            }
            return false;
        }
    }
}
using Microsoft.AspNetCore.Http;
using OSDPayslip.Models.ViewModels;
using OSDPayslip.Service.Payslip.DTO;
using System.Collections.Generic;
using System.IO;

namespace OSDPayslip.Service.Payslip
{
    public interface IPayslipService
    {
        PayslipDetailViewModel Add(PayslipDetailViewModel payslipDetail);

        PayslipDetailViewModel Update(PayslipDetailViewModel payslipDetail);

        void Delete(int id);

        IEnumerable<PayslipDetailViewModel> GetAll();

        IEnumerable<PayslipDetailViewModel> GetAllById(int id);

        PayslipDetailViewModel GetById(int id);

        void Save();

        void HandleExcelFile(FileInfo fileInfo, int requestId);

        void MoveFile(IFormFile file, string webRoot, string Month);
        IEnumerable<PayslipDetailViewModel> GetAllByRequestId(int id);
        int CountNoOfEmployee(FileInfo fileInfo);
        OutputPreviewPayslip GetPayslipPreviews(int RequestId,string EmployeeID);
        void MyDispose();
        bool UpdateStatus(string employeeId, int requestId);
    }
}
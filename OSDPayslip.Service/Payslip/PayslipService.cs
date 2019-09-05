using AutoMapper;
using Microsoft.AspNetCore.Http;
using OfficeOpenXml;
using OSDPayslip.Application.Reponsitories.Interfaces;
using OSDPayslip.Models.Models;
using OSDPayslip.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;

namespace OSDPayslip.Service.Payslip
{
    public class PayslipService : IPayslipService
    {
        private readonly IPayslipDetailReponsitory _payslipDetailReponsitory;
        private readonly Mapper _mapper;
        private readonly IEmployeeReponsitory _employeeReponsitory;

        public PayslipService(IPayslipDetailReponsitory payslipDetailReponsitory, Mapper mapper, IEmployeeReponsitory employeeReponsitory)
        {
            _employeeReponsitory = employeeReponsitory;
            _payslipDetailReponsitory = payslipDetailReponsitory;
            _mapper = mapper;
        }

        public PayslipDetailViewModel Add(PayslipDetailViewModel payslipDetail)
        {
            var temp = _mapper.Map<PayslipDetailViewModel, PayslipDetail>(payslipDetail);
            _payslipDetailReponsitory.Add(temp);
            return payslipDetail;
        }

        public void Delete(int id)
        {
            _payslipDetailReponsitory.Remove(id);
        }

        public IEnumerable<PayslipDetailViewModel> GetAll()
        {
            var lst = _payslipDetailReponsitory.FindAll().ToList();
            IEnumerable<PayslipDetailViewModel> payslipDetailViewModels = new List<PayslipDetailViewModel>();
            return payslipDetailViewModels = _mapper.Map<List<PayslipDetail>, List<PayslipDetailViewModel>>(lst);
        }

        public IEnumerable<PayslipDetailViewModel> GetAllById(int id)
        {
            var lst = _payslipDetailReponsitory.FindAll().Where(x => x.Id == id).ToList();
            IEnumerable<PayslipDetailViewModel> payslipDetailViewModels = new List<PayslipDetailViewModel>();
            return payslipDetailViewModels = _mapper.Map<List<PayslipDetail>, List<PayslipDetailViewModel>>(lst);
        }

        public IEnumerable<PayslipDetailViewModel> GetAllByRequestId(int id)
        {
            var lst = _payslipDetailReponsitory.FindAll().Where(x => x.RequestID == id).ToList();
            IEnumerable<PayslipDetailViewModel> payslipDetailViewModels = new List<PayslipDetailViewModel>();
            return payslipDetailViewModels = _mapper.Map<List<PayslipDetail>, List<PayslipDetailViewModel>>(lst);
        }

        public PayslipDetailViewModel GetById(int id)
        {
            var item = _payslipDetailReponsitory.FindAll().Where(x => x.Id == id).FirstOrDefault();

            PayslipDetailViewModel payslipDetailViewModels = new PayslipDetailViewModel();
            return payslipDetailViewModels = _mapper.Map<PayslipDetail, PayslipDetailViewModel>(item);
        }

        public void Save()
        {
            _payslipDetailReponsitory.Commit();
        }

        public PayslipDetailViewModel Update(PayslipDetailViewModel payslipDetail)
        {
            var temp = _mapper.Map<PayslipDetailViewModel, PayslipDetail>(payslipDetail);
            _payslipDetailReponsitory.Update(temp);
            return payslipDetail;
        }

        public void MoveFile(IFormFile file, string webRoot, string Month)
        {
            string folderName = "Upload";
            string newPath = Path.Combine(webRoot, folderName);
            if (!Directory.Exists(newPath))
            {
                Directory.CreateDirectory(newPath);
            }
            if (file.Length > 0)
            {
                string fileName = Month + "_" + ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                string fullPath = Path.Combine(newPath, fileName);
                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }
            }
        }

        public int HandleExcelFile(FileInfo fileInfo, int requestId)
        {
            int rowCount = 0;
            using (ExcelPackage excel = new ExcelPackage(fileInfo))
            {
                ExcelWorksheet worksheet = excel.Workbook.Worksheets[1];
                rowCount = worksheet.Dimension.Rows;
                int ColCount = worksheet.Dimension.Columns;
                for (int row = 6; row < rowCount; row++)
                {
                    EmployeeViewModel e = new EmployeeViewModel()
                    {
                        Id = worksheet.Cells[row, 2].Value.ToString(),
                        FullName = worksheet.Cells[row, 3].Value.ToString(),
                        Email = worksheet.Cells[row, 4].Value.ToString(),
                        Position = worksheet.Cells[row, 5].Value.ToString(),
                        DeptTeam = worksheet.Cells[row, 6].Value.ToString(),
                        StartDay = worksheet.Cells[row, 7].Value.ToString(),
                    };
                    PayslipDetailViewModel payslipDetailViewModel = new PayslipDetailViewModel()
                    {
                        StandardWorkingDay = Convert.ToInt32(worksheet.Cells[row, 8].Value),
                        UnpaidLeave = Convert.ToInt32(worksheet.Cells[row, 9].Value),
                        ActualWorkingDay = Convert.ToInt32(worksheet.Cells[row, 10].Value),
                        LeaveBalance = Convert.ToInt32(worksheet.Cells[row, 11].Value),
                        //Total grosss incom
                        GrossSalary = Convert.ToDouble(worksheet.Cells[row, 12].Value),
                        ActuaSalary = Convert.ToDouble(worksheet.Cells[row, 13].Value),
                        BasicSalary = Convert.ToDouble(worksheet.Cells[row, 14].Value),
                        Allowance = Convert.ToDouble(worksheet.Cells[row, 15].Value),
                        Bonus = Convert.ToDouble(worksheet.Cells[row, 16].Value),
                        Salary13Th = Convert.ToDouble(worksheet.Cells[row, 17].Value),
                        IncomeOther = Convert.ToDouble(worksheet.Cells[row, 18].Value),
                        OtherDeductions = Convert.ToDouble(worksheet.Cells[row, 20].Value),
                        ///Deductions
                        SocialInsurance = Convert.ToDouble(worksheet.Cells[row, 23].Value),
                        HealthInsurance = Convert.ToDouble(worksheet.Cells[row, 24].Value),
                        UnemploymentInsurance = Convert.ToDouble(worksheet.Cells[row, 25].Value),
                        NoOfDependants = Convert.ToInt32(worksheet.Cells[row, 29].Value),
                        PersonalIncomeTax = Convert.ToDouble(worksheet.Cells[row, 33].Value),
                        PaymentFromSocialInsurance = Convert.ToDouble(worksheet.Cells[row, 34].Value),
                        PaymentOther = Convert.ToDouble(worksheet.Cells[row, 35].Value),
                        FinalizationOfPIT = Convert.ToDouble(worksheet.Cells[row, 36].Value),
                        NetIncome = Convert.ToDouble(worksheet.Cells[row, 37].Value),
                        EmployeeID = e.Id,
                        RequestID = requestId
                    };
                    var employee = _mapper.Map<EmployeeViewModel, Employee>(e);
                    if (_employeeReponsitory.FindAll().Where(x => x.Id == employee.Id) != null)
                    {
                        _employeeReponsitory.Remove(employee);
                    }
                    _employeeReponsitory.Add(employee);
                    _employeeReponsitory.Commit();
                    var payslip = _mapper.Map<PayslipDetailViewModel, PayslipDetail>(payslipDetailViewModel);
                    if(_payslipDetailReponsitory.FindAll().Where(x=>x.RequestID == payslip.RequestID) != null)
                    {
                        _payslipDetailReponsitory.Remove(payslip);
                    }
                    _payslipDetailReponsitory.Add(payslip);
                    _payslipDetailReponsitory.Commit();
                }
            }
            return rowCount;
        }
    }
}
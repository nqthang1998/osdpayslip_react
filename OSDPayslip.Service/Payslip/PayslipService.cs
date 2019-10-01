using AutoMapper;
using Microsoft.AspNetCore.Http;
using OfficeOpenXml;
using OSDPayslip.Application.Reponsitories.Interfaces;
using OSDPayslip.Models.Abstract;
using OSDPayslip.Models.Models;
using OSDPayslip.Models.ViewModels;
using OSDPayslip.Service.Payslip.DTO;
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
        private readonly IRequestDetailReponsitory _requestDetailReponsitory;
        private readonly IEmployeeReponsitory _employeeReponsitory;

        public PayslipService(IPayslipDetailReponsitory payslipDetailReponsitory, Mapper mapper, IEmployeeReponsitory employeeReponsitory,IRequestDetailReponsitory requestDetailReponsitory)
        {
            _employeeReponsitory = employeeReponsitory;
            _payslipDetailReponsitory = payslipDetailReponsitory;
            _mapper = mapper;
            _requestDetailReponsitory = requestDetailReponsitory;
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
            _employeeReponsitory.Commit();
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

        public int CountNoOfEmployee(FileInfo fileInfo)
        {
            int rowCount = 0;
            using (ExcelPackage excel = new ExcelPackage(fileInfo))
            {
                ExcelWorksheet worksheet = excel.Workbook.Worksheets[1];
                rowCount = worksheet.Dimension.Rows;
            }
            return rowCount - 5;
        }
        public OutputPreviewPayslip GetPayslipPreviews(int RequestId,string EmployeeID)
        {
            var payslipDetails = _payslipDetailReponsitory.FindAll().Where(x=> x.RequestID == RequestId && x.EmployeeID == EmployeeID).FirstOrDefault();
            var employee = _employeeReponsitory.FindById(EmployeeID);
            OutputPreviewPayslip outputEmployeePayslipList = new OutputPreviewPayslip()
            {
                StandardWorkingDay = payslipDetails.StandardWorkingDay,
                UnpaidLeave = payslipDetails.UnpaidLeave,
                ActualWorkingDay = payslipDetails.ActualWorkingDay,
                LeaveBalance = payslipDetails.LeaveBalance,
                //Total grosss incom
                GrossSalary = payslipDetails.GrossSalary,
                ActuaSalary = payslipDetails.ActuaSalary,
                BasicSalary = payslipDetails.BasicSalary,
                Allowance = payslipDetails.Allowance,
                Bonus = payslipDetails.Bonus,
                Salary13Th = payslipDetails.Salary13Th,
                IncomeOther = payslipDetails.IncomeOther,
                OtherDeductions = payslipDetails.OtherDeductions,
                ///Deductions
                SocialInsurance = payslipDetails.SocialInsurance,
                HealthInsurance = payslipDetails.HealthInsurance,
                UnemploymentInsurance = payslipDetails.UnemploymentInsurance,
                NoOfDependants = payslipDetails.NoOfDependants,
                PersonalIncomeTax = payslipDetails.PersonalIncomeTax,
                PaymentFromSocialInsurance = payslipDetails.PaymentFromSocialInsurance,
                PaymentOther = payslipDetails.PaymentOther,
                FinalizationOfPIT = payslipDetails.FinalizationOfPIT,
                NetIncome = payslipDetails.NetIncome,
                EmployeeID = employee.Id,
                Status = payslipDetails.Status,
                Email = employee.Email,
                DeptTeam = employee.DeptTeam,
                EmployeeName = employee.FullName,
                Holidays = payslipDetails.Holidays,
                Id = payslipDetails.Holidays,
                Notes = payslipDetails.Notes.Split(';'),
            };
            return outputEmployeePayslipList;
        }
        public EmployeeViewModel GetEmployeeViewModelByWorkSheet(ExcelWorksheet worksheet, int row)
        {
            EmployeeViewModel e = new EmployeeViewModel()
            {
                Id = worksheet.Cells[row, 2].Value.ToString(),
                FullName = worksheet.Cells[row, 3].Value.ToString(),
                Email = worksheet.Cells[row, 4].Value.ToString(),
                Position = worksheet.Cells[row, 5].Value.ToString(),
                DeptTeam = worksheet.Cells[row, 6].Value.ToString(),
                BirthDay = worksheet.Cells[row, 7].Value.ToString(),
                IdentidyId = worksheet.Cells[row, 8].Value.ToString(),
            };
            return e;
        }
        public PayslipDetailViewModel GetPayslipDetailViewModelByWorkSheet(ExcelWorksheet worksheet, int row, int requestId, EmployeeViewModel e)
        {
            PayslipDetailViewModel payslipDetailViewModel = new PayslipDetailViewModel()
            {
                StandardWorkingDay = Convert.ToInt32(worksheet.Cells[row, 10].Value),
                UnpaidLeave = Convert.ToInt32(worksheet.Cells[row, 11].Value),
                ActualWorkingDay = Convert.ToInt32(worksheet.Cells[row, 12].Value),
                LeaveBalance = Convert.ToInt32(worksheet.Cells[row, 13].Value),
                //Total grosss incom
                GrossSalary = Convert.ToDouble(worksheet.Cells[row, 14].Value),
                ActuaSalary = Convert.ToDouble(worksheet.Cells[row, 15].Value),
                BasicSalary = Convert.ToDouble(worksheet.Cells[row, 16].Value),
                Allowance = Convert.ToDouble(worksheet.Cells[row, 17].Value),
                Bonus = Convert.ToDouble(worksheet.Cells[row, 18].Value),
                Salary13Th = Convert.ToDouble(worksheet.Cells[row, 19].Value),
                IncomeOther = Convert.ToDouble(worksheet.Cells[row, 20].Value),
                OtherDeductions = Convert.ToDouble(worksheet.Cells[row, 22].Value),
                ///Deductions
                SocialInsurance = Convert.ToDouble(worksheet.Cells[row, 25].Value),
                HealthInsurance = Convert.ToDouble(worksheet.Cells[row, 26].Value),
                UnemploymentInsurance = Convert.ToDouble(worksheet.Cells[row, 27].Value),
                NoOfDependants = Convert.ToInt32(worksheet.Cells[row, 31].Value),
                PersonalIncomeTax = Convert.ToDouble(worksheet.Cells[row, 35].Value),
                PaymentFromSocialInsurance = Convert.ToDouble(worksheet.Cells[row, 36].Value),
                PaymentOther = Convert.ToDouble(worksheet.Cells[row, 37].Value),
                FinalizationOfPIT = Convert.ToDouble(worksheet.Cells[row, 38].Value),
                NetIncome = Convert.ToDouble(worksheet.Cells[row, 39].Value),
                Notes = Convert.ToString(worksheet.Cells[row, 40].Value),
                EmployeeID = e.Id,
                RequestID = requestId
            };
            return payslipDetailViewModel;
        }
        public void MyDispose()
        {
            _payslipDetailReponsitory.MyDispose();
        }
        public void HandleExcelFile(FileInfo fileInfo, int requestId)
        {
            using (ExcelPackage excel = new ExcelPackage(fileInfo))
            {
                ExcelWorksheet worksheet = excel.Workbook.Worksheets[1];
                int rowCount = rowCount = worksheet.Dimension.Rows;

                for (int row = 6; row <= rowCount; row++)
                {
                    try
                    {
                        EmployeeViewModel e = GetEmployeeViewModelByWorkSheet(worksheet, row);
                        PayslipDetailViewModel payslipDetailViewModel = GetPayslipDetailViewModelByWorkSheet(worksheet, row, requestId, e);

                        var employee = _mapper.Map<EmployeeViewModel, Employee>(e);
                        Employee temp =  _employeeReponsitory.FindById(employee.Id);
                        if (temp  == null)
                        {
                            _employeeReponsitory.Add(employee);
                        }
                        else
                        {
                            temp.Email = employee.Email;
                            temp.FullName = employee.FullName;
                            temp.DeptTeam = employee.DeptTeam;
                            temp.StartDay = employee.StartDay;
                            temp.Position = employee.Position;
                        }
                        _employeeReponsitory.Commit();
                        var payslip = _mapper.Map<PayslipDetailViewModel, PayslipDetail>(payslipDetailViewModel);
                        _payslipDetailReponsitory.Add(payslip);
                        _payslipDetailReponsitory.Commit();
                    }
                    catch (Exception ex)
                    {
                        throw ex;
                    }
                }
            }
        }


        public bool UpdateStatus(string employeeId,int requestId)
        {
            var temp = _payslipDetailReponsitory.FindAll().Where(x => x.EmployeeID == employeeId && x.RequestID == requestId).FirstOrDefault();
            temp.Status = Status.success;
            _requestDetailReponsitory.Commit();
            return true;
        }
    }
}
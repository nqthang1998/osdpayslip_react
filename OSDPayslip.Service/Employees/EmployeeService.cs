using AutoMapper;
using OSDPayslip.Application.Reponsitories;
using OSDPayslip.Application.Reponsitories.Interfaces;
using OSDPayslip.Models.Models;
using OSDPayslip.Models.ViewModels;
using System.Linq;

namespace OSDPayslip.Service.Employees
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeReponsitory _employeeReponsitory;
        private readonly Mapper _mapper;

        public EmployeeService(IEmployeeReponsitory employeeReponsitory, Mapper mapper)
        {
            _employeeReponsitory = employeeReponsitory;
            _mapper = mapper;
        }

        public EmployeeViewModel Add(EmployeeViewModel vm)
        {
            var temp = _mapper.Map<EmployeeViewModel, Employee>(vm);
            _employeeReponsitory.Add(temp);
            return vm;
        }
        public EmployeeViewModel GetById(string id)
        {
            var temp =  _employeeReponsitory.FindById(id);
            return _mapper.Map<Employee,  EmployeeViewModel> (temp);
        }

        public int GetNumber()
        {
            return _employeeReponsitory.FindAll().ToList().Count();
        }
    }
}
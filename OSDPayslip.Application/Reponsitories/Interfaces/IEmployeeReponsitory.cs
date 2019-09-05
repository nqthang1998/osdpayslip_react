using OSDPayslip.Data.Infrastructure;
using OSDPayslip.Models.Models;

namespace OSDPayslip.Application.Reponsitories.Interfaces
{
    public interface IEmployeeReponsitory : IRepository<Employee, string>
    {
    }
}
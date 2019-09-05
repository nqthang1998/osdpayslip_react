using OSDPayslip.Application.Reponsitories.Interfaces;
using OSDPayslip.Data;
using OSDPayslip.Data.Infrastructure;
using OSDPayslip.Models.Models;

namespace OSDPayslip.Application.Reponsitories
{
    public class EmployeeReponsitory : Repository<Employee, string>, IEmployeeReponsitory
    {
        private OSDPayslipDbContext _context;

        public EmployeeReponsitory(OSDPayslipDbContext context) : base(context)
        {
            _context = context;
        }
    }
}
using OSDPayslip.Data.Infrastructure;
using OSDPayslip.Models.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace OSDPayslip.Application.Reponsitories.Interfaces
{
    public interface IPayslipDetailReponsitory : IRepository<PayslipDetail, int>
    {
    }
}

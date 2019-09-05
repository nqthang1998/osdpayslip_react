using OSDPayslip.Application.Reponsitories.Interfaces;
using OSDPayslip.Data;
using OSDPayslip.Data.Infrastructure;
using OSDPayslip.Models.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace OSDPayslip.Application.Reponsitories
{
    public class PayslipDetailReponsitory : Repository<PayslipDetail,int>, IPayslipDetailReponsitory
    {
        private OSDPayslipDbContext _context;
        public PayslipDetailReponsitory (OSDPayslipDbContext context) : base(context)
        {
            _context = context;
        }
    }
}

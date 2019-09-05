using OSDPayslip.Application.Reponsitories.Interfaces;
using OSDPayslip.Data;
using OSDPayslip.Data.Infrastructure;
using OSDPayslip.Models.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace OSDPayslip.Application.Reponsitories
{
    public class RequestDetailReponsitory : Repository<RequestDetail, int>, IRequestDetailReponsitory
    {
        OSDPayslipDbContext _context;
        public RequestDetailReponsitory(OSDPayslipDbContext context) : base(context)
        {
            _context = context;
        }

    }
}

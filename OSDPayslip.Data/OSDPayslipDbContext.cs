using Microsoft.EntityFrameworkCore;
using OSDPayslip.Models.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace OSDPayslip.Data
{
    public class OSDPayslipDbContext : DbContext
    {
        public OSDPayslipDbContext(DbContextOptions<OSDPayslipDbContext> options) : base (options)
        {

        }
        public virtual DbSet<Employee> Employees { get; set; }
        public virtual DbSet<PayslipDetail> PayslipDetails { get; set; }
        public virtual DbSet<RequestDetail> RequestDetail { get; set; }

    }
}

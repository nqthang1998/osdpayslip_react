﻿using OSDPayslip.Models.Abstract;
using System.Collections.Generic;

namespace OSDPayslip.Models.Models
{
    public class Employee : DomainEntity<string>
    {
        public string FullName { get; set; }
        public string DeptTeam { get; set; }
        public string Position { get; set; }
        public string BirthDay { get; set; }
        public string IdentidyId { get; set; }
        public string Email { get; set; }
        public string StartDay { get; set; }
        public virtual IEnumerable<PayslipDetail> PayslipDetails { get; set; }
    }
}
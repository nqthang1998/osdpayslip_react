using OSDPayslip.Data.Infrastructure;
using OSDPayslip.Models.Abstract;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSDPayslip.Models.Models
{
    public class RequestDetail : DomainEntity<int>, IAuditable
    {
        public int? NoOfDeployee { get; set; }
        public int? PayslipForMonth { get; set; }
        public virtual IEnumerable<PayslipDetail> PayslipDetails { get; set; }
        public DateTime? CreateDate { get; set; }
        public string CreateBy { get; set; }
        public DateTime? ModifyDate { get; set; }
        public string ModifyBy { get; set; }
        public Status Status { get; set; }
    }
}
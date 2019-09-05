using System;

namespace OSDPayslip.Models.Abstract
{
    public class Auditable : IAuditable
    {
        public DateTime? CreateDate { get; set; }
        public string CreateBy { get; set; }
        public DateTime? ModifyDate { get; set; }
        public string ModifyBy { get; set; }
        public Status Status { get; set; }
    }
}
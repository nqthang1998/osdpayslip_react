using OSDPayslip.Models.Abstract;
using System;

namespace OSDPayslip.Models.ViewModels
{
    public class RequestDetailViewModel
    {
        public int Id { get; set; }
        public int NoOfDeployee { get; set; }
        public int PayslipForMonth { get; set; }

        public DateTime? CreateDate { get; set; }
        public string CreateBy { get; set; }
        public DateTime? ModifyDate { get; set; }
        public string ModifyBy { get; set; }
        public Status Status { get; set; }
    }
}
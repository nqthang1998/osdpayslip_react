using OSDPayslip.Models.Models;
using OSDPayslip.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace OSDPayslip.Service.Request
{
    public interface IRequestService
    {
        RequestDetailViewModel Add(RequestDetailViewModel requestDetail);
        void UpdatePendingStatus(int requestId);
        void UpdateSuccessStatus(int requestId);
        void Delete(int id);
        IEnumerable<RequestDetailViewModel> GetAll();
        IEnumerable<RequestDetailViewModel> GetAllById(int id);
        RequestDetailViewModel GetById(int id);
        void Save();
        int CreateNewRequest(int month, int count,string CreatedBy);
    }
}

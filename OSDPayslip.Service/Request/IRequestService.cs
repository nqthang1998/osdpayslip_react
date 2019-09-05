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
        RequestDetailViewModel Update(RequestDetailViewModel requestDetail);
        void Delete(int id);
        IEnumerable<RequestDetailViewModel> GetAll();
        IEnumerable<RequestDetailViewModel> GetAllById(int id);
        RequestDetailViewModel GetById(int id);
        void Save();
        void UpdateNoOfDeployee(int n, int id);
        int CreateNewRequest(int month);
    }
}

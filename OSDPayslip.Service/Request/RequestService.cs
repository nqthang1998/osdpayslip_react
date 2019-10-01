using AutoMapper;
using OSDPayslip.Application.Reponsitories.Interfaces;
using OSDPayslip.Models.Abstract;
using OSDPayslip.Models.Models;
using OSDPayslip.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;

namespace OSDPayslip.Service.Request
{
    public class RequestService : IRequestService
    {
        private readonly IRequestDetailReponsitory _requestDetailReponsitory;
        private readonly Mapper _mapper;
        public RequestService(IRequestDetailReponsitory requestDetailReponsitory, Mapper mapper)
        {
            _requestDetailReponsitory = requestDetailReponsitory;
            _mapper = mapper;
        }

        public RequestDetailViewModel Add(RequestDetailViewModel requestDetail)
        {
            var temp = _mapper.Map<RequestDetailViewModel, RequestDetail>(requestDetail);
            _requestDetailReponsitory.Add(temp);
            return requestDetail;
        }

        public void Delete(int id)
        {
            _requestDetailReponsitory.Remove(id);
        }

        public IEnumerable<RequestDetailViewModel> GetAll()
        {
            var lst = _requestDetailReponsitory.FindAll().ToList();
            IEnumerable<RequestDetailViewModel> requestDetailViewModels = new List<RequestDetailViewModel>();
            return requestDetailViewModels = _mapper.Map<List<RequestDetail>, List<RequestDetailViewModel>>(lst);
        }

        public IEnumerable<RequestDetailViewModel> GetAllById(int id)
        {
            var lst = _requestDetailReponsitory.FindAll().Where(x => x.Id == id).ToList();
            IEnumerable<RequestDetailViewModel> requestDetailViewModels = new List<RequestDetailViewModel>();
            return requestDetailViewModels = _mapper.Map<List<RequestDetail>, List<RequestDetailViewModel>>(lst);
        }

        public RequestDetailViewModel GetById(int id)
        {
            var item = _requestDetailReponsitory.FindAll().Where(x => x.Id == id).FirstOrDefault();
            RequestDetailViewModel requestDetailViewModel = new RequestDetailViewModel();
            return requestDetailViewModel = _mapper.Map<RequestDetail, RequestDetailViewModel>(item);
        }

        public void Save()
        {
            _requestDetailReponsitory.Commit();
        }

        public RequestDetailViewModel Update(RequestDetailViewModel requestDetail)
        {
            var temp = _mapper.Map<RequestDetailViewModel, RequestDetail>(requestDetail);
            _requestDetailReponsitory.Update(temp);
            return requestDetail;
        }

        public int CreateNewRequest(int month, int count,string CreatedBy)
        {
            try
            {
                RequestDetailViewModel requestDetail = new RequestDetailViewModel()
                {
                    NoOfDeployee = count,
                    PayslipForMonth = month,
                    CreateDate = DateTime.Now,
                    ModifyDate = DateTime.Now,
                    CreateBy = CreatedBy,
                    ModifyBy = CreatedBy,
                    Status = 0
                };
                var temp = _mapper.Map<RequestDetailViewModel, RequestDetail>(requestDetail);
                _requestDetailReponsitory.Add(temp);
                _requestDetailReponsitory.Commit();
                var top = GetAll().Max(x => x.Id);
                return GetAll().Max(x => x.Id);
            }
            catch
            {
                return -1;
            }
        }
        public void UpdatePendingStatus(int requestId)
        {
            var payslipRequest = _requestDetailReponsitory.FindById(requestId);
            payslipRequest.Status = Status.pending;
            _requestDetailReponsitory.Commit();
        }

        public void UpdateSuccessStatus(int requestId)
        {
            var payslipRequest = _requestDetailReponsitory.FindById(requestId);
            payslipRequest.Status = Status.success;
            _requestDetailReponsitory.Commit();
        }
    }
}
using AutoMapper;
using OSDPayslip.Application.Reponsitories.Interfaces;
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

        public void UpdateNoOfDeployee(int n, int id)
        {
            var Request = GetById(id);
            Request.NoOfDeployee = n;
            var temp = _mapper.Map<RequestDetailViewModel, RequestDetail > (Request);
            _requestDetailReponsitory.Update(temp);
            _requestDetailReponsitory.Commit();
        }

        public int CreateNewRequest(int month)
        {
            RequestDetailViewModel requestDetail = new RequestDetailViewModel()
            {
                NoOfDeployee = 0,
                PayslipForMonth = month,
                CreateDate = DateTime.Now,
                ModifyDate = DateTime.Now,
                CreateBy = "",
                ModifyBy = "",
                Status = 0
            };
            var temp = _mapper.Map<RequestDetailViewModel, RequestDetail>(requestDetail);
            _requestDetailReponsitory.Add(temp);
            _requestDetailReponsitory.Commit();
            var top = GetAll().Max(x => x.Id);
            return GetAll().Max(x => x.Id);
        }
    }
}
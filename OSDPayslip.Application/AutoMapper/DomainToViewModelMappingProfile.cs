using AutoMapper;
using OSDPayslip.Models.Models;
using OSDPayslip.Models.ViewModels;

namespace OSDPayslip.Application.AutoMapper
{
    public class DomainToViewModelMappingProfile : Profile
    {
        public DomainToViewModelMappingProfile()
        {
            CreateMap<PayslipDetail, PayslipDetailViewModel>(MemberList.None);
            CreateMap<RequestDetail, RequestDetailViewModel>(MemberList.None);
            CreateMap<Employee, EmployeeViewModel>(MemberList.None);
        }
    }
}
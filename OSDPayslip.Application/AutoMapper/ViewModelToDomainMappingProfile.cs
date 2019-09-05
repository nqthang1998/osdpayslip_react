using AutoMapper;
using OSDPayslip.Models.Models;
using OSDPayslip.Models.ViewModels;

namespace OSDPayslip.Application.AutoMapper
{
    public class ViewModelToDomainMappingProfile : Profile
    {
        public ViewModelToDomainMappingProfile()
        {
            CreateMap<PayslipDetailViewModel, PayslipDetail>(MemberList.None);
            CreateMap<RequestDetailViewModel, RequestDetail>(MemberList.None);
            CreateMap<EmployeeViewModel, Employee>(MemberList.None);
        }
    }
}
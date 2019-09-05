using AutoMapper;

namespace OSDPayslip.Application.AutoMapper
{
    public class AutoMapperConfig
    {
        public Mapper RegisterMapping()
        {
            var temp = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new ViewModelToDomainMappingProfile());
                cfg.AddProfile(new DomainToViewModelMappingProfile());
            });
            return new Mapper(temp);
        }
    }
}
using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json.Serialization;
using OSDPayslip.Application.AutoMapper;
using OSDPayslip.Application.Reponsitories;
using OSDPayslip.Application.Reponsitories.Interfaces;
using OSDPayslip.Data;
using OSDPayslip.Service.Employees;
using OSDPayslip.Service.Payslip;
using OSDPayslip.Service.Request;

namespace OSDPayslip.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2).AddJsonOptions(opts =>
            {
                var resolver = opts.SerializerSettings.ContractResolver;
                if (resolver != null)
                {
                    (resolver as DefaultContractResolver).NamingStrategy = null;
                }
            });
            ///servicessss
            services.AddTransient<IRequestService, RequestService>();
            services.AddTransient<IPayslipService, PayslipService>();
            services.AddTransient<IEmployeeService, EmployeeService>();

            //Reponsitoriessssssss
            services.AddTransient<IRequestDetailReponsitory, RequestDetailReponsitory>();
            services.AddTransient<IEmployeeReponsitory, EmployeeReponsitory>();
            services.AddTransient<IPayslipDetailReponsitory, PayslipDetailReponsitory>();
            //Db context
            services.AddDbContext<OSDPayslipDbContext>(opts => opts.UseSqlServer(Configuration.GetConnectionString("OSDPayslip")));
            // Mapper
            AutoMapperConfig autoMapper = new AutoMapperConfig();
            Mapper mapper = autoMapper.RegisterMapping();
            services.AddSingleton(mapper);
            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            app.UseCors(
              options => options.WithOrigins("http://localhost:4200").AllowAnyMethod()
          );
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}

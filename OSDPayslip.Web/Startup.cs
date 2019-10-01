using AutoMapper;
using DinkToPdf;
using DinkToPdf.Contracts;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Azure.WebJobs;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json.Serialization;
using OSDPayslip.Application.AutoMapper;
using OSDPayslip.Application.Reponsitories;
using OSDPayslip.Application.Reponsitories.Interfaces;
using OSDPayslip.Data;
using OSDPayslip.Data.Infrastructure;
using OSDPayslip.Service.Employees;
using OSDPayslip.Service.HandlePdf;
using OSDPayslip.Service.Payslip;
using OSDPayslip.Service.Request;
using OSDPayslip.Service.ViewRender;
using System.Data;
using System.Data.SqlClient;

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
            services.AddTransient<IViewRenderService, ViewRenderService>();
            services.AddTransient<IEmployeeService, EmployeeService>();
            services.AddTransient<IHandlePdfService, HandlePdfService>();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddSingleton(typeof(IConverter), new SynchronizedConverter(new PdfTools()));
            //Reponsitoriesssssssss
            services.AddTransient<IRequestDetailReponsitory, RequestDetailReponsitory>();
            services.AddTransient<IEmployeeReponsitory, EmployeeReponsitory>();
            services.AddTransient<IPayslipDetailReponsitory, PayslipDetailReponsitory>();
            //Db context
            var conectionString = Configuration.GetConnectionString("OSDPayslip");
            //try
            //{
            services.AddDbContext<OSDPayslipDbContext>(opts => opts.UseSqlServer(conectionString));
            //}
            //finally
            //{
            //    using (SqlConnection connection = new SqlConnection(conectionString))
            //    {
            //        try
            //        {
            //            string sql = @"DELETE FROM dbo.RequestDetail WHERE  CreateDate < DATEADD(MONTH, -2, GETDATE())";
            //            using (SqlCommand command = new SqlCommand(sql, connection))
            //            {
            //                command.CommandType = CommandType.Text;
            //                connection.Open();
            //                command.ExecuteNonQuery();
            //                connection.Close();
            //            }
            //        }
            //        finally
            //        {
            //            string sql1 = @"DELETE FROM dbo.PayslipDetails WHERE  CreateDate < DATEADD(MONTH, -2, GETDATE())";
            //            using (SqlCommand command = new SqlCommand(sql1, connection))
            //            {
            //                command.CommandType = CommandType.Text;
            //                connection.Open();
            //                command.ExecuteNonQuery();
            //                connection.Close();
            //            }
            //        }
            //    }
            //}
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
            app.UseCors(
                 options => options.WithOrigins("http://localhost:3000").AllowAnyMethod().AllowAnyHeader().AllowAnyOrigin()
             );
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
          
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{contr oller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }
    }
}

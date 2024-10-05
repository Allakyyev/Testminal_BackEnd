using System.Globalization;
using DevExpress.AspNetCore;
using DevExpress.AspNetCore.Reporting;
using DevExpress.DashboardAspNetCore;
using DevExpress.DashboardWeb;
using DevExpress.XtraCharts;
using DevExpress.XtraReports.Web.Extensions;
using DevExpress.XtraReports.Web.WebDocumentViewer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting.Internal;
using Terminal_BackEnd.Infrastructure;
using Terminal_BackEnd.Infrastructure.Constants;
using Terminal_BackEnd.Infrastructure.Data;
using Terminal_BackEnd.Infrastructure.Entities;
using Terminal_BackEnd.Infrastructure.Services;
using Terminal_BackEnd.Infrastructure.Services.TerminalService;
using Terminal_BackEnd.Infrastructure.Services.UserService;
using Terminal_BackEnd.Web.Jobs;
using Terminal_BackEnd.Web.Services;

namespace Terminal_BackEnd.Web {
    public class Program {
        public static async Task Main(string[] args) {
            var builder = WebApplication.CreateBuilder(args);
            IFileProvider? fileProvider = builder.Environment.ContentRootFileProvider;
            IConfiguration? configuration = builder.Configuration;
            // Add services to the container.
            builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
            builder.Services.AddDefaultIdentity<ApplicationUser>(options => {
                options.SignIn.RequireConfirmedAccount = true;
                options.Password.RequiredLength = 5;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireDigit = false;
                options.SignIn.RequireConfirmedAccount = true;
            })
               .AddRoles<IdentityRole>()
               .AddEntityFrameworkStores<AppDbContext>()
               .AddDefaultTokenProviders();
            builder.Services.AddControllersWithViews().AddRazorRuntimeCompilation();
            builder.Services.AddControllersWithViews();
            builder.Services.AddRazorPages();
            builder.Services.Configure<TerminalSettings>(builder.Configuration.GetSection("TerminalSettings"));
            builder.Services.AddScoped<Endpoints>();
            builder.Services.AddAutoMapper(typeof(Program));
            builder.Services.AddScoped<IServiceProviderAPIService, ServiceProviderAPIService>();
            builder.Services.AddScoped<IAltynAsyrTerminalService, AltynAsyrTerminalService>();
            builder.Services.AddScoped<ITransactionControllerService, TransactionControllerService>();
            builder.Services.AddScoped<IApplicationUserService, ApplicationUserService>();
            builder.Services.AddScoped<ITerminalService, TerminalService>();
            builder.Services.AddScoped<ISecurityService, SecurityService>();
            builder.Services.AddHostedService<TransactionStatusesUpdateJob>();
            builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");
            builder.Services.AddDevExpressControls();
            builder.Services.AddScoped<DashboardConfigurator>((IServiceProvider serviceProvider) => {
                DashboardConfigurator configurator = new DashboardConfigurator();
                configurator.SetDashboardStorage(new DashboardFileRepository(fileProvider.GetFileInfo("Data/Dashboards").PhysicalPath));
                configurator.SetConnectionStringsProvider(new DashboardConnectionStringsProvider(configuration));
                return configurator;
            });
            builder.Services.AddMvc();
            builder.Services.AddControllersWithViews()
                .AddViewLocalization(LanguageViewLocationExpanderFormat.Suffix)
                .AddDataAnnotationsLocalization();

            builder.Services.ConfigureReportingServices(configurator => {
                if(builder.Environment.IsDevelopment()) {
                    configurator.UseDevelopmentMode();
                }
                configurator.ConfigureReportDesigner(designerConfigurator => {
                    designerConfigurator.RegisterDataSourceWizardConfigFileConnectionStringsProvider();
                });
                configurator.ConfigureWebDocumentViewer(viewerConfigurator => {
                    viewerConfigurator.UseFileDocumentStorage(Path.Combine(builder.Environment.ContentRootPath, "ReportDocuments"), StorageSynchronizationMode.InterProcess);
                    viewerConfigurator.UseFileReportStorage(Path.Combine(builder.Environment.ContentRootPath, "PreviewedReports"), StorageSynchronizationMode.InterProcess);
                    viewerConfigurator.UseFileExportedDocumentStorage(Path.Combine(builder.Environment.ContentRootPath, "ExportedDocuments"), StorageSynchronizationMode.InterProcess);
                    viewerConfigurator.UseCachedReportSourceBuilder();
                });
            });
            builder.Services.AddSingleton<ReportStorageWebExtension, CustomReportStorageWebExtension>();
            builder.Services.Configure<RequestLocalizationOptions>(options => {
                var supportedCultures = new[]
                {
                    new CultureInfo("ru"),
                    new CultureInfo("tk")
                };
                foreach(var culture in supportedCultures) {
                    culture.NumberFormat.NumberDecimalSeparator = ".";
                }
                options.DefaultRequestCulture = new RequestCulture(culture: "ru", uiCulture: "ru");
                options.SupportedCultures = supportedCultures;
                options.SupportedUICultures = supportedCultures;
            });
            var app = builder.Build();
            using(var scope = app.Services.CreateScope()) {
                var services = scope.ServiceProvider;
                var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                dbContext.Database.Migrate();
                var context = services.GetRequiredService<RoleManager<IdentityRole>>();
                if(!context.Roles.Any()) {
                    await context.CreateAsync(new IdentityRole {
                        Name = ConstantsCommon.Role.Admin
                    });
                    await context.CreateAsync(new IdentityRole {
                        Name = ConstantsCommon.Role.Standard
                    });
                    await context.CreateAsync(new IdentityRole {
                        Name = ConstantsCommon.Role.Cashier
                    });
                } else {
                    var adminRole = context.Roles.FirstOrDefault(r => !String.IsNullOrEmpty(r.Name) && (r.Name.Contains(ConstantsCommon.Role.Admin)));
                    if(adminRole == null) {
                        await context.CreateAsync(new IdentityRole {
                            Name = ConstantsCommon.Role.Admin
                        });
                    }
                    var standartRole = context.Roles.FirstOrDefault(r => !String.IsNullOrEmpty(r.Name) && (r.Name.Contains(ConstantsCommon.Role.Standard)));
                    if(standartRole == null) {
                        await context.CreateAsync(new IdentityRole {
                            Name = ConstantsCommon.Role.Standard
                        });
                    }
                    var cashierRole = context.Roles.FirstOrDefault(r => !String.IsNullOrEmpty(r.Name) && (r.Name.Contains(ConstantsCommon.Role.Cashier)));
                    if(cashierRole == null) {
                        await context.CreateAsync(new IdentityRole {
                            Name = ConstantsCommon.Role.Cashier
                        });
                    }
                }
                var userContext = services.GetRequiredService<UserManager<ApplicationUser>>();
                var admin = userContext.FindByNameAsync("Admin").GetAwaiter().GetResult();
                if(admin != null) await userContext.DeleteAsync(admin);
                ApplicationUser adminUser = new ApplicationUser {
                    FirstName = "Admin",
                    FamilyName = "Admin",
                    Email = "allakyyev@gmail.com",
                    UserName = "Admin",
                    EmailConfirmed = true,
                };

                var user = await userContext.CreateAsync(adminUser, "Password!1");
                await userContext.AddToRoleAsync(adminUser, "Admin");
                dbContext.SaveChanges();
            }
            // Configure the HTTP request pipeline.
            if(!app.Environment.IsDevelopment()) {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseDevExpressControls();
            app.UseRouting();
            app.UseAuthentication();  // Ensure that authentication is added
            app.UseAuthorization();
            app.MapDashboardRoute("api/dashboard", "DefaultDashboard");
            app.MapRazorPages();

            app.MapControllerRoute(
                name: "areas",
                pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}");
            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");
            app.Run();
        }
    }
}

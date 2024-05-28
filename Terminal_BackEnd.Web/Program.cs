using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Terminal_BackEnd.Infrastructure.Data;
using Terminal_BackEnd.Infrastructure.Entities;

namespace Terminal_BackEnd.Web {
    public class Program {
        public static void Main(string[] args) {
            var builder = WebApplication.CreateBuilder(args);

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
            builder.Services.AddControllersWithViews();
            builder.Services.AddRazorPages();

            var app = builder.Build();
            using(var scope = app.Services.CreateScope()) {
                var services = scope.ServiceProvider;
                var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                dbContext.Database.Migrate();
                var context = services.GetRequiredService<RoleManager<IdentityRole>>();
                if(!context.Roles.Any()) {
                    context.CreateAsync(new IdentityRole {
                        Name = "Admin"
                    });
                    context.CreateAsync(new IdentityRole {
                        Name = "Standart"
                    });
                }
                var userContext = services.GetRequiredService<UserManager<ApplicationUser>>();
                var admin = userContext.FindByNameAsync("Admin").GetAwaiter().GetResult();

                if(admin == null) {
                    ApplicationUser adminUser = new ApplicationUser {
                        FirstName = "Admin",
                        FamilyName = "Admin",
                        Email = $"allakyyev@gmail.com",
                        UserName = "Admin",
                        EmailConfirmed = true,
                    };

                    userContext.CreateAsync(adminUser, "Password!1");
                    userContext.AddToRoleAsync(adminUser, "Admin");
                    dbContext.SaveChanges();
                }
            }
            // Configure the HTTP request pipeline.
            if(!app.Environment.IsDevelopment()) {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();
            app.UseAuthentication();  // Ensure that authentication is added
            app.UseAuthorization();
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

using DevExtreme.AspNet.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Terminal_BackEnd.Infrastructure.Data;
using Terminal_BackEnd.Infrastructure.Entities;
using Terminal_BackEnd.Infrastructure.Services.UserService;
using Terminal_BackEnd.Infrastructure.ViewModels;


namespace Terminal_BackEnd.Web.API {
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class ApplicationUserAPIController : ControllerBase {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IApplicationUserService _userService;
        private readonly AppDbContext _dbContext;
        public ApplicationUserAPIController(IApplicationUserService userService, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager) {
            _userManager = userManager;
            _userService = userService;
            _roleManager = roleManager;
        }

        // GET: api/ApplicationUserAPI
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<object?> Get(DataSourceLoadOptions loadOptions) {
            return DataSourceLoader.Load<ApplicationUserViewModel>((await _userService.GetAllUsers()), loadOptions);
        }

        [HttpGet("Topups/{id}")]
        public async Task<object?> Topups(string id, DataSourceLoadOptions loadOptions) {
            return DataSourceLoader.Load<Topup>((await _userService.TopupsByUser(id)), loadOptions);
        }

        [Authorize(Roles = "Admin")]
        // DELETE: api/CallBacksAPI/5
        [HttpDelete("{id}")]
        public async Task Delete(string id) {
            var user = await _userManager.FindByIdAsync(id);
            if(user == null) return;
            //if (user.Photo != null)
            //{
            //    _imgService.DeleteImage(user.Photo, "Users");
            //}
            await _userManager.DeleteAsync(user);
        }

    }
}
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Terminal_BackEnd.Infrastructure.Data;
using Terminal_BackEnd.Infrastructure.Entities;
using Terminal_BackEnd.Infrastructure.Services.UserService;
using Terminal_BackEnd.Infrastructure.ViewModel;

namespace Terminal_BackEnd.Web.Controllers {
    [Authorize()]
    public class BalanceController : Controller {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly AppDbContext _dbContex;
        private readonly IApplicationUserService _applicationUserService;

        public BalanceController(UserManager<ApplicationUser> userManager, AppDbContext dbContext, IApplicationUserService applicationUserService)
        {
            _userManager = userManager;
            _dbContex = dbContext;
            _applicationUserService = applicationUserService;
        }
        public async Task<IActionResult> Index() {
            var userId = _applicationUserService.GetUserId();
            if(userId == null) return BadRequest();
            var currentBalance = await _applicationUserService.GetCurrentTotal(userId);            
            UserBalanceViewModel model = new UserBalanceViewModel() {
                CurrentBalance = currentBalance,
                UserId = userId
            };
            return View(model);
        }
    }
}

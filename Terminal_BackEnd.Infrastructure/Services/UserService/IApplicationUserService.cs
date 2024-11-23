using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Terminal_BackEnd.Infrastructure.Data;
using Terminal_BackEnd.Infrastructure.Entities;
using Terminal_BackEnd.Infrastructure.ViewModels;

namespace Terminal_BackEnd.Infrastructure.Services.UserService {
    public interface IApplicationUserService {
        Task<ApplicationUser> GetUserProfile(string userId);
        Task<IEnumerable<ApplicationUserViewModel>> GetAllUsers();
        Task DeleteUser(string id);
        Task<bool> Topup(string userId, long totalSum);
        Task<IEnumerable<Topup>> TopupsByUser(string userId);
        Task UpdateCurrentTotal(string userId, int amount);
        Task<long> GetCurrentTotal(string userId);
        string? GetUserId();
    }

    public class ApplicationUserService : IApplicationUserService {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly AppDbContext _dbContex;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ApplicationUserService(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, AppDbContext dbContex, IHttpContextAccessor httpContextAccessor) {
            _userManager = userManager;
            _roleManager = roleManager;
            _dbContex = dbContex;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task DeleteUser(string id) {
            var user = await _userManager.FindByIdAsync(id);
            if(user != null) {
                IdentityResult result = await _userManager.DeleteAsync(user);
            }
        }
        public string? GetUserId() {
            var user = _httpContextAccessor.HttpContext.User;
            if(user?.Identity?.IsAuthenticated ?? false) {
                return user.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            }
            return null;
        }
        public async Task UpdateCurrentTotal(string userId, int amount) {
            var user = await _userManager.FindByIdAsync(userId);
            if(user != null) {
                user.CurrentTotal -= (amount / 100);
                _dbContex.Update(user);
                _dbContex.SaveChanges();
            }
        }
        public async Task<long> GetCurrentTotal(string userId) {
            var user = await _userManager.FindByIdAsync(userId);
            if(user != null) {
                return user.CurrentTotal;
            }
            return -1;
        }
        public async Task<IEnumerable<ApplicationUserViewModel>> GetAllUsers() {
            List<ApplicationUserViewModel> usersViewModels = new List<ApplicationUserViewModel>();
            var appUsers = _userManager.Users.AsNoTracking().Where(o => o.UserName != "Admin").OrderBy(o => o.FirstName).ToList();
            if(appUsers.Any()) {
                foreach(var user in appUsers) {
                    ApplicationUserViewModel userViewModel = new ApplicationUserViewModel() {
                        PhoneNumber = user.PhoneNumber,
                        PhoneNumberConfirmed = user.PhoneNumberConfirmed,
                        EmailConfirmed = user.EmailConfirmed,
                        FirstName = user.FirstName,
                        FamilyName = user.FamilyName,
                        Address = user.Address,
                        CompanyAddress = user.CompanyAddress,
                        CompanyName = user.CompanyName,
                        Email = user.Email,
                        Id = user.Id,
                        UserName = user.UserName,
                        PasswordHash = user.PasswordHash,
                        CurrentTotal = user.CurrentTotal
                    };
                    var roles = await _userManager.GetRolesAsync(user);
                    userViewModel.Role = roles.FirstOrDefault();
                    usersViewModels.Add(userViewModel);
                }
            }
            return usersViewModels;
        }

        public async Task<ApplicationUser> GetUserProfile(string userId) {
            var appUser = await _userManager.Users
                .SingleOrDefaultAsync(s => s.Id == userId);

            return appUser;
        }

        public async Task<bool> Topup(string userId, long totalSum) {
            try {
                if(!(totalSum > 0)) return false;
                var user = await _userManager.FindByIdAsync(userId);
                if(user != null) {
                    user.CurrentTotal += totalSum;
                    _dbContex.Update(user);
                    _dbContex.SaveChanges();
                    var topUp = new Topup() { UserId = userId, TopupSum = totalSum, TopupDate = DateTime.Now };
                    await _dbContex.AddAsync<Topup>(topUp);
                    await _dbContex.SaveChangesAsync();
                    return true;
                }
                return false;
            } catch(Exception ex) {
                return false;
            }
        }

        public async Task<IEnumerable<Topup>> TopupsByUser(string userId) {
            return _dbContex.Topups.Where(t => t.UserId == userId).ToList();
        }
    }
}

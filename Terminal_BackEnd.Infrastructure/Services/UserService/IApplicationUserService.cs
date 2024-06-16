using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Terminal_BackEnd.Infrastructure.Entities;

namespace Terminal_BackEnd.Infrastructure.Services.UserService {
    public interface IApplicationUserService {
        Task<ApplicationUser> GetUserProfile(string userId);
        IEnumerable<ApplicationUser> GetAllUsers();
        Task DeleteUser(string id);
    }

    public class ApplicationUserService : IApplicationUserService {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public ApplicationUserService(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager) {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task DeleteUser(string id) {
            var user = await _userManager.FindByIdAsync(id);
            if(user != null) {
                IdentityResult result = await _userManager.DeleteAsync(user);
            }
        }

        public IEnumerable<ApplicationUser> GetAllUsers() {
            var appUsers = _userManager.Users.AsNoTracking().Where(o => o.UserName != "Admin").OrderBy(o => o.FirstName);
            return appUsers;
        }

        public async Task<ApplicationUser> GetUserProfile(string userId) {
            var appUser = await _userManager.Users
                .SingleOrDefaultAsync(s => s.Id == userId);

            return appUser;
        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Terminal_BackEnd.Infrastructure.Constants;
using Terminal_BackEnd.Infrastructure.Data;
using Terminal_BackEnd.Infrastructure.Entities;
using Terminal_BackEnd.Infrastructure.Services.UserService;
using Terminal_BackEnd.Infrastructure.Services.UserService.Models;

namespace Terminal_BackEnd.Web.Controllers {
    //[Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class ApplicationUserController : Controller {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly AppDbContext _dbContex;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IApplicationUserService _applicationUserService;        
        //private readonly IStringLocalizer<SharedResource> _localizer;

        public ApplicationUserController(RoleManager<IdentityRole> roleManager,
            UserManager<ApplicationUser> userManager, AppDbContext dbContext, IApplicationUserService applicationUserService) {
            _roleManager = roleManager;
            _userManager = userManager;
            _dbContex = dbContext;
            _applicationUserService = applicationUserService;
        }
        // GET: Admin/ApplicationUser
        public IActionResult Index() {
            return View();
        }

        [HttpGet]
        // GET: Admin/ApplicationUser/ChangePassword/{id}
        public async Task<IActionResult> ChangePassword(string id) {
            var user = await _userManager.FindByIdAsync(id);

            if(user == null) {
                return NotFound();
            } else {
                ChangePasswordModel userForChangePass = new ChangePasswordModel {
                    Email = await _userManager.GetEmailAsync(user),
                    UserName = user.UserName,
                    Id = id,
                    ConfirmPassword = String.Empty,
                    Password = String.Empty
                };
                return View(userForChangePass);
            }
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CreateUserModel model) {
            if(ModelState.IsValid) {
                ApplicationUser user = new ApplicationUser {
                    FirstName = model.FirstName,
                    FamilyName = model.FamilyName,
                    Email = model.Email,
                    EmailConfirmed = true,
                    PhoneNumber = model.PhoneNumber,
                    PhoneNumberConfirmed = true,
                    UserName = model.UserName,
                    CompanyAddress = model.CompanyAddress,
                    CompanyName = model.CompanyName,
                    Address = model.Address
                };


                var existing_user = await _userManager.FindByEmailAsync(user.Email);

                if(existing_user != null) {
                    ModelState.AddModelError("Email", "This email already in use");
                    // If we got this far, something failed, redisplay form
                    return View(model);
                }

                var result = await _userManager.CreateAsync(user, model.Password);

                if(result.Succeeded) {
                    var roleInRoles = model.Role == ConstantsCommon.Role.Standard ||
                                      model.Role == ConstantsCommon.Role.Cashier;
                    if(roleInRoles)
                        await _userManager.AddToRoleAsync(user, model.Role);
                    else
                        await _userManager.AddToRoleAsync(user, ConstantsCommon.Role.Standard);
                    return RedirectToAction("Index");
                }
            }

            return View(model);
        }


        [HttpGet]
        public async Task<IActionResult> Edit(string id) {
            var user = await _userManager.FindByIdAsync(id);
            if(user != null) {
                return View(user);
            }
            return RedirectToAction("Index");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(ApplicationUser model) {
            if(ModelState.IsValid) {
                model.EmailConfirmed = true;
                model.PhoneNumberConfirmed = true;
                var user = await _userManager.FindByIdAsync(model.Id);
                user.Id = model.Id;
                user.FirstName = model.FirstName;
                user.Email = model.Email;
                user.EmailConfirmed = true;
                user.FamilyName = model.FamilyName;
                user.PasswordHash = model.PasswordHash;
                user.UserName = model.UserName;
                user.PhoneNumber = model.PhoneNumber;
                user.PhoneNumberConfirmed = true;
                user.CompanyAddress = model.CompanyAddress;
                user.CompanyName = model.CompanyName;
                user.Address = model.Address;

                var result = await _userManager.UpdateAsync(user);
                if(result.Succeeded) {

                    return RedirectToAction("Index");
                }
            }

            return View(model);
        }

        [HttpGet]
        public async Task<IActionResult> Stats() {
            return View();
        }

        [HttpPost]
        // GET: Admin/ApplicationUser/Edit/5
        public async Task<IActionResult> ChangePassword(ChangePasswordModel model) {
            if(!ModelState.IsValid) {
                return View(model);
            }

            var user = await _userManager.FindByIdAsync(model.Id);
            if(user == null) {
                // Don't reveal that the user does not exist
                ViewBag.ErrorList = "User does not exists";
                return View();
            }
            var Code = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, Code, model.Password);
            if(result.Succeeded) {
                return RedirectToAction("Index");
            } else {
                ViewBag.ErrorList = result.Errors.ToList();
                return View(model);
            }
        }

        [HttpGet]
        public IActionResult Create() {
            return View(new CreateUserModel() {
                Email = String.Empty,
                UserName = String.Empty,
                Password = String.Empty,
                ConfirmPassword = String.Empty,
                FirstName = String.Empty,
                FamilyName = String.Empty,
                Role = ConstantsCommon.Role.Standard
            });
        }

        // GET: Admin/ApplicationUser/Delete/5
        public IActionResult Delete(string id) {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Topup(string id) {
            var user = await _userManager.FindByIdAsync(id);
            if(user != null) {
                ViewBag.UserName = user.UserName + " - " + user.FirstName;
                return View(new Topup() { UserId = id, TopupDate = DateTime.Now, TopupSum = 0 });
            }
            return RedirectToAction("Index");
        }

        [HttpPost]
        public async Task<IActionResult> AddTopup(Topup model) {
            if(ModelState.IsValid) {
                var result = await _applicationUserService.Topup(model.UserId, model.TopupSum);
                return View("Topup", new { id = model.UserId });
            }                            
            return RedirectToAction("Index");
        }

        [HttpGet] IActionResult SuccessTopup() {
            return View();
        }
    }
}

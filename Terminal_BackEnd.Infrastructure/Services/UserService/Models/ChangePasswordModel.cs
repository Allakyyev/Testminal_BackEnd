using System.ComponentModel.DataAnnotations;

namespace Terminal_BackEnd.Infrastructure.Services.UserService.Models {
    public class ChangePasswordModel {
        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        public required string UserName { get; set; }
        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 7)]
        [DataType(DataType.Password)]
        public required string Password { get; set; }


        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public required string ConfirmPassword { get; set; }

        public string Id { get; set; }

    }
}

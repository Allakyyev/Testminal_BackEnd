using System.ComponentModel.DataAnnotations;

namespace Terminal_BackEnd.Infrastructure.Services.UserService.Models {
    public class EditUserModel {
        public string Id { get; set; }

        [Required(ErrorMessage = "Email is required")]
        public required string Email { get; set; }

        [Required(ErrorMessage = "Name is required")]
        public required string UserName { get; set; }
       
        public string? PhoneNumber { get; set; }
        [Required]
        public required string FirstName { get; set; }
        [Required]
        public required string FamilyName { get; set; }       

        public string? CompanyName { get; set; }
        public string? CompanyAddress { get; set; }
        public string? Address { get; set; }
    }
}

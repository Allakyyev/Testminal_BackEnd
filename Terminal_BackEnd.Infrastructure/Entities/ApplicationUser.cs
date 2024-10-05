using Microsoft.AspNetCore.Identity;

namespace Terminal_BackEnd.Infrastructure.Entities {
    public class ApplicationUser : IdentityUser {
        public required string FirstName { get; set; }
        public required string FamilyName { get; set; }
        public string? CompanyName { get; set; }
        public string?  CompanyAddress{ get; set; }
        public string? Address { get; set; }
        public List<Terminal> Terminals { get; set; } = [];
        public List<Topup> Topups { get; set; } = [];
    }
}
